const { query, createSdkMcpServer } = require("@anthropic-ai/claude-agent-sdk");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { compile } = require("../index.js");
const {
  generateAutoCaptureView,
  generateContentView,
} = require("./swift-gen.js");
const { startServer, PORT } = require("./server.js");

const {
  getDslOverview,
  getDslReference,
  writeDesign,
  compileAndScreenshot,
  readTheme,
  readComponents,
  editTheme,
  editComponents,
  editPresets,
  listScreenshots,
} = require("./tools.js");

const ROOT = path.resolve(__dirname, "../..");
const SAMPLE_DIR = path.join(ROOT, "sample-images");
const OUT_DIR = path.join(ROOT, "agent-output");
const DESIGN_DIR = path.join(ROOT, "design");
const SIMULATOR = "iPhone 17 Pro";

// How many screenshots to process
const COUNT = parseInt(process.argv[2] || "10", 10);

// ── MCP Server ──────────────────────────────────────────────────────────
const server = createSdkMcpServer({
  name: "design-dsl",
  tools: [
    getDslOverview,
    getDslReference,
    writeDesign,
    compileAndScreenshot,
    readTheme,
    readComponents,
    editTheme,
    editComponents,
    editPresets,
    listScreenshots,
  ],
});

// ── System Prompt ───────────────────────────────────────────────────────
const systemPrompt = `You are a Design Agent that recreates mobile app screens using a compact DSL.

## Your Job
You will be given paths to reference screenshots. For EACH screenshot, you must:
1. Read it using the Read tool to see what it looks like
2. Write a .design file that recreates the screen's layout

## Workflow
1. First, call get_dsl_overview to learn the DSL syntax
2. For each screenshot path given to you:
   a. Use Read to view the reference screenshot
   b. Analyze the layout: typography hierarchy, colors, spacing, icons, buttons, sections
   c. Write a .design file using write_design with the filename you're told to use
3. If you need details on specific topics, call get_dsl_reference with: 'elements', 'modifiers', 'presets', 'layout_patterns', 'colors', or 'theme'
4. If you need to add reusable components, use read_theme/edit_theme and edit_presets

## Design Principles
- Match the LAYOUT and HIERARCHY, not pixel-perfect branding
- Use SF Symbols (Img(sys:"icon.name")) for icons — pick closest match
- Focus on: spacing, font sizes, alignment, visual weight, component types
- Solid color backgrounds: VS { ... }.bg(.purple) or ZS with a colored rectangle
- For screens with photos/images, use colored placeholder rectangles with SF Symbol overlays

## What You CAN'T Do (DSL Limitations)
- No actual images/photos — use colored rectangles or SF Symbols
- No gradients (use solid colors)
- No custom fonts (use system fonts)
- No tab bars or nav bars as system components (approximate with HS layouts)
- No state or interactivity

## Important
- Keep DSL concise — that's the whole point
- Prefer presets (B.cta, V.card) over manual styling when they fit
- Do NOT call compile_and_screenshot — the runner handles building/screenshots
- Just focus on writing good .design files`;

// ── Helpers ─────────────────────────────────────────────────────────────

function getSortedScreenshots() {
  return fs
    .readdirSync(SAMPLE_DIR)
    .filter((f) => f.endsWith(".png"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/(\d+)\.png$/)?.[1] || "0");
      const numB = parseInt(b.match(/(\d+)\.png$/)?.[1] || "0");
      return numA - numB;
    });
}

function compileAllDesignFiles(designFiles) {
  const screens = [];
  const errors = [];

  for (const { name, filename } of designFiles) {
    const designPath = path.join(OUT_DIR, filename);
    if (!fs.existsSync(designPath)) {
      errors.push({ name, error: `File not found: ${filename}` });
      continue;
    }

    const input = fs.readFileSync(designPath, "utf-8");
    const viewName = `Screen${name.replace(/[^a-zA-Z0-9]/g, "")}View`;

    try {
      const swift = compile(input, viewName);
      const swiftPath = path.join(DESIGN_DIR, `${viewName}.swift`);
      fs.writeFileSync(swiftPath, swift);
      screens.push({ name, viewName, filename });
    } catch (err) {
      errors.push({ name, error: err.message });
    }
  }

  return { screens, errors };
}

function cleanGeneratedViews() {
  // Remove old Screen*View.swift and AutoCaptureView.swift
  const files = fs.readdirSync(DESIGN_DIR);
  for (const f of files) {
    if (
      (f.startsWith("Screen") && f.endsWith("View.swift")) ||
      f === "AutoCaptureView.swift"
    ) {
      fs.unlinkSync(path.join(DESIGN_DIR, f));
    }
  }
}

function buildApp() {
  console.log("\nBuilding Xcode project...");
  try {
    execSync(
      `xcodebuild -project design.xcodeproj -scheme design -destination 'platform=iOS Simulator,name=${SIMULATOR}' build 2>&1`,
      { cwd: ROOT, timeout: 120000, maxBuffer: 50 * 1024 * 1024 }
    );
    return { success: true };
  } catch (err) {
    const output = err.stdout ? err.stdout.toString() : err.message;
    const errorLines = output
      .split("\n")
      .filter((l) => l.includes("error:"))
      .slice(0, 15)
      .join("\n");
    return { success: false, error: errorLines || output.slice(-2000) };
  }
}

function launchApp() {
  console.log("Installing and launching app...");
  try {
    execSync(
      `xcrun simctl terminate "${SIMULATOR}" com.awwal.design 2>/dev/null || true`,
      { cwd: ROOT }
    );

    // Find the built .app
    const appPath = execSync(
      `find ~/Library/Developer/Xcode/DerivedData -name "design.app" -path "*/Build/Products/Debug-iphonesimulator/*" -not -path "*/Index.noindex/*" | head -1`,
      { encoding: "utf-8" }
    ).trim();

    if (!appPath) throw new Error("Could not find built .app");

    execSync(`xcrun simctl boot "${SIMULATOR}" 2>/dev/null || true`, {
      cwd: ROOT,
    });
    execSync(`xcrun simctl install "${SIMULATOR}" "${appPath}"`, {
      cwd: ROOT,
    });
    execSync(`xcrun simctl launch "${SIMULATOR}" com.awwal.design`, {
      cwd: ROOT,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const allFiles = getSortedScreenshots();
  const files = allFiles.slice(0, COUNT);

  console.log(`\nProcessing ${files.length} screenshots...\n`);

  // ── Phase 1: Agent generates .design files ──────────────────────────
  const designFiles = files.map((f, i) => ({
    name: `${i}`,
    filename: `screen-${i}.design`,
    sourceFile: f,
  }));

  // Build the prompt with all screenshot paths
  const screenshotInstructions = designFiles
    .map(
      (d) =>
        `- Read "${path.join(SAMPLE_DIR, d.sourceFile)}" → write as "${d.filename}"`
    )
    .join("\n");

  const prompt = `Here are ${files.length} reference screenshots to recreate. For each one, read the image, then write the .design file.

${screenshotInstructions}

Start by calling get_dsl_overview, then work through each screenshot in order.`;

  console.log("Phase 1: Agent generating .design files...\n");
  const genStart = Date.now();

  // Save full agent log
  const agentLog = [];

  try {
    for await (const message of query({
      prompt,
      options: {
        systemPrompt,
        cwd: ROOT,
        mcpServers: { "design-dsl": server },
        allowedTools: ["Read"],
        maxTurns: 80,
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,
      },
    })) {
      agentLog.push(message);

      if ("result" in message) {
        console.log(`\n[Agent] Done.`);
      } else if (message.type === "assistant") {
        // Log assistant text
        const textBlocks = (message.message?.content || []).filter(
          (b) => b.type === "text"
        );
        for (const b of textBlocks) {
          if (b.text) {
            // Truncate long text
            const preview =
              b.text.length > 200
                ? b.text.slice(0, 200) + "..."
                : b.text;
            console.log(`[Agent] ${preview}`);
          }
        }
        // Log tool use calls
        const toolBlocks = (message.message?.content || []).filter(
          (b) => b.type === "tool_use"
        );
        for (const b of toolBlocks) {
          const inputPreview = JSON.stringify(b.input || {}).slice(0, 150);
          console.log(`[Tool] ${b.name}(${inputPreview})`);
        }
      }
    }
  } catch (err) {
    console.error(`Agent error: ${err.message}`);
  }

  // Save agent log
  fs.writeFileSync(
    path.join(OUT_DIR, "agent-log.json"),
    JSON.stringify(agentLog, null, 2)
  );

  const genMs = Date.now() - genStart;
  console.log(`\nPhase 1 complete: ${(genMs / 1000).toFixed(1)}s`);

  // ── Phase 2: Compile .design → Swift views ──────────────────────────
  console.log("\nPhase 2: Compiling .design files to Swift...");
  cleanGeneratedViews();

  const { screens, errors: compileErrors } = compileAllDesignFiles(designFiles);

  if (compileErrors.length > 0) {
    console.log(`  ${compileErrors.length} compile errors:`);
    for (const e of compileErrors) {
      console.log(`    screen-${e.name}: ${e.error}`);
      // Show the problematic line from the .design file
      const match = e.error.match(/line (\d+)/);
      if (match) {
        const lineNum = parseInt(match[1]);
        const designPath = path.join(OUT_DIR, `screen-${e.name}.design`);
        if (fs.existsSync(designPath)) {
          const lines = fs.readFileSync(designPath, "utf-8").split("\n");
          const start = Math.max(0, lineNum - 2);
          const end = Math.min(lines.length, lineNum + 1);
          for (let i = start; i < end; i++) {
            const marker = i === lineNum - 1 ? " >>>" : "    ";
            console.log(`${marker} ${i + 1}: ${lines[i]}`);
          }
        }
      }
    }
  }

  if (screens.length === 0) {
    console.error("No screens compiled successfully. Aborting.");
    process.exit(1);
  }

  console.log(`  ${screens.length} screens compiled successfully`);

  // ── Phase 3: Generate AutoCaptureView + ContentView ─────────────────
  console.log("\nPhase 3: Generating AutoCaptureView + ContentView...");
  generateAutoCaptureView(screens, PORT);
  generateContentView(screens);

  // ── Phase 4: Build ──────────────────────────────────────────────────
  console.log("\nPhase 4: Building...");
  const buildResult = buildApp();
  if (!buildResult.success) {
    console.error(`Build failed:\n${buildResult.error}`);
    process.exit(1);
  }
  console.log("  Build succeeded");

  // ── Phase 5: Start server + launch app + capture screenshots ────────
  console.log("\nPhase 5: Capturing screenshots...");

  const screenshotResults = await new Promise(async (resolve) => {
    const results = [];

    const srv = await startServer({
      outputDir: OUT_DIR,
      simulatorName: SIMULATOR,
      expectedCount: screens.length,
      onScreenshot: (name, screenshotPath) => {
        results.push({ name, screenshotPath, success: true });
      },
      onDone: async () => {
        // Give a moment for last response to finish
        setTimeout(async () => {
          await srv.close();
          resolve(results);
        }, 1000);
      },
    });

    // Launch the app
    const launchResult = launchApp();
    if (!launchResult.success) {
      console.error(`Launch failed: ${launchResult.error}`);
      await srv.close();
      resolve([]);
      return;
    }

    // Timeout safety net
    setTimeout(async () => {
      console.log("\nTimeout — not all screenshots captured");
      await srv.close();
      resolve(results);
    }, screens.length * 5000 + 15000);
  });

  // ── Summary ─────────────────────────────────────────────────────────
  console.log("\n\n=== RESULTS ===");
  console.log(`Generation time: ${(genMs / 1000).toFixed(1)}s`);
  console.log(`Screens generated: ${designFiles.length}`);
  console.log(`Screens compiled: ${screens.length}`);
  console.log(`Screenshots captured: ${screenshotResults.length}`);
  console.log(
    `Compile errors: ${compileErrors.length}`
  );

  console.log("\nScreenshots:");
  for (const s of screens) {
    const captured = screenshotResults.find((r) => r.name === s.name);
    const status = captured ? "OK" : "MISSING";
    console.log(`  screen-${s.name} → ${s.viewName} : ${status}`);
  }

  // Save results
  const summary = {
    generationTimeMs: genMs,
    generationTimeSec: +(genMs / 1000).toFixed(1),
    totalScreens: designFiles.length,
    compiledScreens: screens.length,
    capturedScreenshots: screenshotResults.length,
    compileErrors,
    screens: screens.map((s) => ({
      name: s.name,
      viewName: s.viewName,
      designFile: s.filename,
      captured: screenshotResults.some((r) => r.name === s.name),
    })),
  };

  fs.writeFileSync(
    path.join(OUT_DIR, "results.json"),
    JSON.stringify(summary, null, 2)
  );
  console.log(`\nResults saved to agent-output/results.json`);
  console.log(`Screenshots saved to agent-output/*.png`);
}

main().catch(console.error);
