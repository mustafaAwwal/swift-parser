/**
 * Evaluation runner — single or batch.
 *
 * Usage:
 *   node eval/run.js 0           # single screen
 *   node eval/run.js 0-10        # range
 *   node eval/run.js 0 3 5 7     # specific screens
 *
 * Pipeline:
 *   Phase 1 (parallel): All agents write .design DSL concurrently
 *   Phase 2 (sequential): Compile all → build once → AutoCaptureView + express server screenshots
 *   Phase 3 (parallel): All review agents run concurrently
 *   Phase 4: Generate reports
 *
 * Output: eval/runs/screen-<N>/ per screen
 */

const { query, createSdkMcpServer } = require("@anthropic-ai/claude-agent-sdk");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { compile } = require("../parser/index.js");
const { generateReport } = require("./report.js");
const { startServer, PORT } = require("../parser/agent/server.js");
const {
  generateAutoCaptureView,
  generateContentView,
} = require("../parser/agent/swift-gen.js");

const {
  getDslOverview,
  getDslReference,
  createWriteDesignTool,
  createSubmitReviewTool,
  readTheme,
  readComponents,
  editTheme,
  editComponents,
  editPresets,
} = require("./tools.js");

// Suppress MaxListenersExceededWarning when running many agents in parallel
process.setMaxListeners(50);

const ROOT = path.resolve(__dirname, "..");
const SAMPLE_DIR = path.join(ROOT, "sample-images");
const DESIGN_DIR = path.join(ROOT, "design");
const SIMULATOR = "iPhone 17 Pro";

// ── CLI Parsing ────────────────────────────────────────────────────────

function parseScreenArgs(args) {
  const screens = new Set();
  for (const arg of args) {
    if (arg.includes("-")) {
      const [start, end] = arg.split("-").map(Number);
      for (let i = start; i <= end; i++) screens.add(i);
    } else {
      screens.add(parseInt(arg, 10));
    }
  }
  return [...screens].sort((a, b) => a - b);
}

// ── Helpers ────────────────────────────────────────────────────────────

function getSortedScreenshots() {
  return fs
    .readdirSync(SAMPLE_DIR)
    .filter((f) => f.endsWith(".png"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/(\d+)/)?.[1] || "0");
      const numB = parseInt(b.match(/(\d+)/)?.[1] || "0");
      return numA - numB;
    });
}

function cleanGeneratedViews() {
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

// Validate a single Swift file against Theme.swift + Components.swift
function validateSwift(swiftFilePath) {
  try {
    const sdk = execSync("xcrun --show-sdk-path --sdk iphonesimulator", {
      encoding: "utf-8",
    }).trim();
    execSync(
      `swiftc -typecheck -sdk "${sdk}" -target arm64-apple-ios18.0-simulator "${path.join(DESIGN_DIR, "Theme.swift")}" "${path.join(DESIGN_DIR, "Components.swift")}" "${swiftFilePath}" 2>&1`,
      { timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
    );
    return { success: true };
  } catch (err) {
    const output = err.stdout ? err.stdout.toString() : err.message;
    const errorLines = output
      .split("\n")
      .filter((l) => l.includes("error:"))
      .slice(0, 5)
      .join("\n");
    return { success: false, error: errorLines || output.slice(-500) };
  }
}

function buildApp() {
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
  try {
    execSync(
      `xcrun simctl terminate "${SIMULATOR}" com.awwal.design 2>/dev/null || true`,
      { cwd: ROOT }
    );
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

// ── Agent runner ───────────────────────────────────────────────────────

async function runAgent(prompt, systemPrompt, mcpServer, logPath, label) {
  const agentLog = [];
  let totalInput = 0;
  let totalOutput = 0;

  for await (const message of query({
    prompt,
    options: {
      systemPrompt,
      cwd: ROOT,
      mcpServers: { "design-dsl": mcpServer },
      allowedTools: ["Read"],
      maxTurns: 15,
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
    },
  })) {
    agentLog.push(message);

    if (message.usage) {
      totalInput += message.usage.input_tokens || 0;
      totalOutput += message.usage.output_tokens || 0;
    }

    if (message.type === "assistant") {
      const toolBlocks = (message.message?.content || []).filter(
        (b) => b.type === "tool_use"
      );
      for (const b of toolBlocks) {
        console.log(`  [${label}] ${b.name}`);
      }
      if (message.message?.usage) {
        totalInput += message.message.usage.input_tokens || 0;
        totalOutput += message.message.usage.output_tokens || 0;
      }
    }

    if ("result" in message) {
      if (message.result?.usage) {
        totalInput += message.result.usage.input_tokens || 0;
        totalOutput += message.result.usage.output_tokens || 0;
      }
    }
  }

  if (logPath) {
    fs.writeFileSync(logPath, JSON.stringify(agentLog, null, 2));
  }

  return { agentLog, tokens: { input: totalInput, output: totalOutput } };
}

// ── Prompts ────────────────────────────────────────────────────────────

const WRITE_SYSTEM = `You are a Design Agent that recreates mobile app screens using a compact DSL.
Your output compiles to SwiftUI and gets screenshotted on an iOS Simulator.
The user only sees the screenshot — they never see code. Speed and accuracy matter.
Focus on matching the reference layout, hierarchy, and feel — not pixel-perfect branding.

KEY RULES:
- For colored headers: ZS { Rect.fg(.color).ignoresSafeArea  VS(p:16) { content } } — Rect extends behind status bar, content stays in safe area. NEVER .pt(60) and NEVER .ignoresSafeArea on the content VS.
- Use presets (Tab, Seg, TF.search, Img.placeholder, B.cta, etc.) instead of building from scratch
- Hex colors MUST have # prefix: #FF6600, never bare FF6600
- Only use documented modifiers — unknown ones cause compile errors`;

const REVIEW_SYSTEM = `You are reviewing your own work — a Design DSL screen you just wrote.
Be brutally honest. The goal is to find gaps in the DSL system so we can improve it.
Score fairly: 7+ means the layout/hierarchy is close, 5-6 means recognizable but off, <5 means major gaps.`;

function writePrompt(referencePath) {
  return `You have ONE reference screenshot to recreate using the Design DSL.

Reference screenshot: ${referencePath}

Steps:
1. Call get_dsl_overview to learn the syntax
2. Read the reference screenshot using the Read tool
3. Analyze: layout structure, typography, colors, spacing, icons, buttons, sections
4. Write ONE .design file using write_design that recreates the screen

Rules:
- One-shot — make it count. Study the reference carefully before writing.
- Match layout hierarchy, visual weight, spacing, and component types
- Use SF Symbols for icons (pick the closest match)
- Keep it concise — that's the whole point of the DSL
- ONLY use known DSL modifiers — unknown ones cause compile errors
- If write_design returns a compile error, fix it and call write_design again
- If you need a reusable component (checkbox, toggle, custom card, etc.) that doesn't exist, create it yourself using edit_theme/edit_components/edit_presets tools

(MANDATORY) Use presets instead of building from scratch:
- Tab bar? → Tab(tint:, active:N) { Tab.item("Label", sys:"icon") { content } }
- Search bar? → TF.search("Search...") or TF.search("Search...", "query text")
- Image placeholder? → Img.placeholder(h:200, color:.orange, icon:"fork.knife")
- Segmented control? → Seg("A", "B", active:0)
- Form fields? → TF.float("Label") or TF.float("Label", "Value")
- Buttons? → B.cta("Go"), B.sec("Go"), B.text("Go"), B.link("Go")
- Inline styled text? → TC { T("plain ") T("bold").bold }
- Colored header? → ZS { Rect.fg(#color).ignoresSafeArea VS(p:16) { content } }`;
}

function reviewPrompt(referencePath, screenshotPath, dslContent, error) {
  if (error) {
    return `Your DSL failed to compile or build.

Error: ${error}

The DSL you wrote:
\`\`\`
${dslContent}
\`\`\`

Reference screenshot: ${referencePath}

Read the reference image, then call submit_review. Score should be low since it failed.
Focus on: what went wrong, what modifiers/syntax you tried that didn't exist, and what would have prevented this.`;
  }

  return `You just generated a screen using the Design DSL. Now compare your output to the reference.

Reference screenshot: ${referencePath}
Your output screenshot: ${screenshotPath}

The DSL you wrote:
\`\`\`
${dslContent}
\`\`\`

Read BOTH images using the Read tool, then call submit_review with your honest assessment.

Think about:
- What parts of the layout/hierarchy matched well?
- What parts didn't match? Was it because of a DSL limitation or a mistake you made?
- What modifiers would have helped? (e.g., shadow, gradient, lineLimit)
- What components/presets would have saved time? (e.g., TabBar, SearchBar, Checkbox, NumPad)
- What tools would have helped? (e.g., SF Symbol search, color picker, preview without full build)
- What about the DSL syntax was confusing or slowed you down?`;
}

// ── Main ───────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node eval/run.js <screen-numbers>");
    console.error("  node eval/run.js 0         # single");
    console.error("  node eval/run.js 0-10      # range");
    console.error("  node eval/run.js 0 3 5 7   # specific");
    process.exit(1);
  }

  const screenNums = parseScreenArgs(args);
  const allFiles = getSortedScreenshots();

  // Validate
  for (const n of screenNums) {
    if (n >= allFiles.length) {
      console.error(`Screen ${n} not found. Available: 0-${allFiles.length - 1}`);
      process.exit(1);
    }
  }

  // Prepare run directories
  const screens = screenNums.map((n) => {
    const sourceFile = allFiles[n];
    const referencePath = path.join(SAMPLE_DIR, sourceFile);
    const runDir = path.join(__dirname, "runs", `screen-${n}`);
    if (fs.existsSync(runDir)) fs.rmSync(runDir, { recursive: true });
    fs.mkdirSync(runDir, { recursive: true });
    fs.copyFileSync(referencePath, path.join(runDir, "input.png"));
    return { num: n, sourceFile, referencePath, runDir, timing: {} };
  });

  const totalStart = Date.now();
  console.log(`\n=== EVAL: ${screens.length} screens (${screenNums.join(", ")}) ===\n`);

  // ════════════════════════════════════════════════════════════════════
  // PHASE 1: All agents write DSL in parallel
  // ════════════════════════════════════════════════════════════════════

  console.log(`Phase 1: ${screens.length} agents writing DSL in parallel...`);
  const phase1Start = Date.now();

  const writePromises = screens.map((s) => {
    const writeDesign = createWriteDesignTool(s.runDir);
    const server = createSdkMcpServer({
      name: "design-dsl",
      tools: [getDslOverview, getDslReference, writeDesign, readTheme, readComponents, editTheme, editComponents, editPresets],
    });

    const start = Date.now();
    return runAgent(
      writePrompt(s.referencePath),
      WRITE_SYSTEM,
      server,
      path.join(s.runDir, "agent-log.json"),
      `Screen ${s.num}`
    ).then((result) => {
      s.timing.dslWrite = Date.now() - start;
      s.writeResult = result;
      console.log(`  Screen ${s.num}: DSL done (${(s.timing.dslWrite / 1000).toFixed(1)}s)`);
    });
  });

  await Promise.all(writePromises);
  const phase1Ms = Date.now() - phase1Start;
  console.log(`Phase 1 done: ${(phase1Ms / 1000).toFixed(1)}s\n`);

  // ════════════════════════════════════════════════════════════════════
  // PHASE 2: Compile all → build once → screenshot all
  // ════════════════════════════════════════════════════════════════════

  console.log("Phase 2: Compile → Build → Screenshot...");
  const phase2Start = Date.now();

  // 2a: Compile each .design → Screen<N>View.swift
  cleanGeneratedViews();

  const compiled = [];
  for (const s of screens) {
    const designPath = path.join(s.runDir, "output.design");
    if (!fs.existsSync(designPath)) {
      s.compileError = "Agent did not write a .design file";
      console.log(`  Screen ${s.num}: NO DSL FILE`);
      continue;
    }

    s.dslContent = fs.readFileSync(designPath, "utf-8");
    const viewName = `Screen${s.num}View`;

    try {
      const swift = compile(s.dslContent, viewName);
      const swiftPath = path.join(DESIGN_DIR, `${viewName}.swift`);
      fs.writeFileSync(swiftPath, swift);
      fs.writeFileSync(path.join(s.runDir, "compiled.swift"), swift);

      // Validate Swift with swiftc -typecheck
      const validation = validateSwift(swiftPath);
      if (!validation.success) {
        s.buildError = validation.error;
        fs.unlinkSync(swiftPath); // remove bad file before batch build
        console.log(`  Screen ${s.num}: SWIFT ERROR — ${validation.error.split('\n')[0]}`);
        continue;
      }

      compiled.push({ name: String(s.num), viewName, screen: s });
      console.log(`  Screen ${s.num}: compiled + validated`);
    } catch (err) {
      s.compileError = err.message;
      console.log(`  Screen ${s.num}: COMPILE ERROR — ${err.message}`);
    }
  }

  if (compiled.length === 0) {
    console.error("No screens compiled. Aborting.");
    process.exit(1);
  }

  // 2b: Generate AutoCaptureView + ContentView
  generateAutoCaptureView(compiled, PORT);
  generateContentView(compiled);

  // 2c: Build — retry loop: if build fails, remove the offending screen and retry
  console.log(`  Building ${compiled.length} screens...`);
  const buildStart = Date.now();
  let buildResult;
  let buildAttempts = 0;
  const maxAttempts = compiled.length; // worst case: remove one per attempt

  while (buildAttempts < maxAttempts && compiled.length > 0) {
    buildAttempts++;
    buildResult = buildApp();
    if (buildResult.success) break;

    // Find offending file from error
    const match = buildResult.error.match(/design\/(\w+View)\.swift:\d+:\d+: error:/);
    if (!match) break; // can't identify which screen, give up

    const badView = match[1];
    const badIdx = compiled.findIndex((c) => c.viewName === badView);
    if (badIdx === -1) break;

    const bad = compiled[badIdx];
    console.log(`  Screen ${bad.name}: BUILD ERROR — removing and retrying`);
    const badScreen = screens.find((s) => s.num === parseInt(bad.name, 10));
    if (badScreen) badScreen.buildError = buildResult.error;

    // Remove the bad Swift file and re-generate AutoCaptureView without it
    const badPath = path.join(DESIGN_DIR, `${badView}.swift`);
    if (fs.existsSync(badPath)) fs.unlinkSync(badPath);
    compiled.splice(badIdx, 1);

    if (compiled.length === 0) break;
    generateAutoCaptureView(compiled, PORT);
    generateContentView(compiled);
  }

  const buildMs = Date.now() - buildStart;

  if (!buildResult?.success && compiled.length > 0) {
    console.error(`  Build failed after ${buildAttempts} attempts:\n${buildResult.error}`);
    for (const s of screens) {
      if (!s.buildError) s.buildError = buildResult.error;
    }
  } else if (compiled.length === 0) {
    console.error("  All screens failed to build.");
    for (const s of screens) {
      if (!s.buildError) s.buildError = "All screens removed due to build errors";
    }
  } else {
    console.log(`  Build succeeded (${(buildMs / 1000).toFixed(1)}s)`);

    // 2d: Screenshot all via express server + AutoCaptureView
    console.log(`  Launching app & capturing ${compiled.length} screenshots...`);
    const ssStart = Date.now();

    // Temp dir for raw screenshots from express server
    const ssTmpDir = path.join(__dirname, "runs", "_screenshots");
    if (fs.existsSync(ssTmpDir)) fs.rmSync(ssTmpDir, { recursive: true });
    fs.mkdirSync(ssTmpDir, { recursive: true });

    const screenshotResults = await new Promise(async (resolve) => {
      const results = [];

      const srv = await startServer({
        outputDir: ssTmpDir,
        simulatorName: SIMULATOR,
        expectedCount: compiled.length,
        onScreenshot: (name, ssPath) => {
          // Copy screenshot to the right run dir
          const screenNum = parseInt(name, 10);
          const targetPath = path.join(
            __dirname, "runs", `screen-${screenNum}`, "output.png"
          );
          try {
            fs.copyFileSync(ssPath, targetPath);
          } catch (e) { /* ignore */ }
          results.push({ name, success: true });
          console.log(`  Screen ${name}: screenshot captured`);
        },
        onDone: async () => {
          setTimeout(async () => {
            await srv.close();
            resolve(results);
          }, 1000);
        },
      });

      const launchResult = launchApp();
      if (!launchResult.success) {
        console.error(`  Launch failed: ${launchResult.error}`);
        await srv.close();
        resolve([]);
        return;
      }

      // Timeout safety
      setTimeout(async () => {
        console.log("  Screenshot timeout — not all captured");
        await srv.close();
        resolve(results);
      }, compiled.length * 5000 + 20000);
    });

    const ssMs = Date.now() - ssStart;
    console.log(`  Screenshots done (${(ssMs / 1000).toFixed(1)}s)`);

    // Clean up temp screenshot dir
    if (fs.existsSync(ssTmpDir)) fs.rmSync(ssTmpDir, { recursive: true });

    // Mark which screens got screenshots
    for (const r of screenshotResults) {
      const n = parseInt(r.name, 10);
      const s = screens.find((s) => s.num === n);
      if (s) s.screenshotOk = true;
    }

    // Set timing for all screens (shared build + screenshot)
    for (const s of screens) {
      s.timing.build = buildMs;
      s.timing.screenshot = ssMs;
    }
  }

  const phase2Ms = Date.now() - phase2Start;
  console.log(`Phase 2 done: ${(phase2Ms / 1000).toFixed(1)}s\n`);

  // ════════════════════════════════════════════════════════════════════
  // PHASE 3: All review agents in parallel
  // ════════════════════════════════════════════════════════════════════

  console.log(`Phase 3: ${screens.length} agents reviewing in parallel...`);
  const phase3Start = Date.now();

  const reviewPromises = screens.map((s) => {
    const submitReview = createSubmitReviewTool(s.runDir);
    const server = createSdkMcpServer({
      name: "design-dsl",
      tools: [submitReview],
    });

    const error = s.compileError || s.buildError || null;
    const screenshotPath = s.screenshotOk
      ? path.join(s.runDir, "output.png")
      : null;

    const start = Date.now();
    return runAgent(
      reviewPrompt(s.referencePath, screenshotPath, s.dslContent || "", error),
      REVIEW_SYSTEM,
      server,
      path.join(s.runDir, "review-log.json"),
      `Review ${s.num}`
    ).then((result) => {
      s.timing.review = Date.now() - start;
      s.reviewResult = result;
      console.log(`  Screen ${s.num}: review done (${(s.timing.review / 1000).toFixed(1)}s)`);
    });
  });

  await Promise.all(reviewPromises);
  const phase3Ms = Date.now() - phase3Start;
  console.log(`Phase 3 done: ${(phase3Ms / 1000).toFixed(1)}s\n`);

  // ════════════════════════════════════════════════════════════════════
  // PHASE 4: Generate reports
  // ════════════════════════════════════════════════════════════════════

  console.log("Phase 4: Generating reports...");
  const reports = [];

  for (const s of screens) {
    s.timing.total = Date.now() - totalStart;

    const tokens = {
      input:
        (s.writeResult?.tokens.input || 0) +
        (s.reviewResult?.tokens.input || 0),
      output:
        (s.writeResult?.tokens.output || 0) +
        (s.reviewResult?.tokens.output || 0),
    };

    const report = generateReport(s.runDir, {
      screenNumber: s.num,
      referencePath: s.referencePath,
      timing: s.timing,
      tokens,
      compileError: s.compileError || null,
      buildError: s.buildError || null,
      screenshotOk: s.screenshotOk || false,
    });

    reports.push(report);
  }

  // ════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════════

  const totalMs = Date.now() - totalStart;

  console.log("\n" + "═".repeat(60));
  console.log(`  EVAL SUMMARY — ${screens.length} screens in ${(totalMs / 1000).toFixed(1)}s`);
  console.log("═".repeat(60));
  console.log("");
  console.log("  Screen  Compile  Build  Screenshot  Score  DSL→Swift");
  console.log("  ------  -------  -----  ----------  -----  ---------");

  for (const r of reports) {
    const score = r.agentReview?.overallScore
      ? `${r.agentReview.overallScore}/10`
      : "—";
    const compiled = r.compileError ? "FAIL" : "OK";
    const built = r.buildError ? "FAIL" : "OK";
    const ss = r.screenshotCaptured ? "OK" : "FAIL";
    const savings = r.tokenSavings.swiftChars
      ? `${r.tokenSavings.dslChars}→${r.tokenSavings.swiftChars}`
      : "—";
    console.log(
      `  ${String(r.screenNumber).padStart(6)}  ${compiled.padEnd(7)}  ${built.padEnd(5)}  ${ss.padEnd(10)}  ${score.padEnd(5)}  ${savings}`
    );
  }

  // Aggregate stats
  const scores = reports
    .map((r) => r.agentReview?.overallScore)
    .filter(Boolean);
  const avgScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "—";

  const totalTokens = reports.reduce(
    (acc, r) => acc + (r.tokens?.total || 0),
    0
  );

  console.log("");
  console.log(`  Avg score: ${avgScore}`);
  console.log(`  Total tokens: ${totalTokens.toLocaleString()}`);
  console.log(`  Wall time: ${(totalMs / 1000).toFixed(1)}s`);
  console.log(`  Phase 1 (DSL write): ${(phase1Ms / 1000).toFixed(1)}s`);
  console.log(`  Phase 2 (compile+build+screenshot): ${(phase2Ms / 1000).toFixed(1)}s`);
  console.log(`  Phase 3 (review): ${(phase3Ms / 1000).toFixed(1)}s`);
  console.log("");

  // Aggregate missing modifiers/components across all reviews
  const allMissing = { modifiers: {}, components: {}, tools: {}, painPoints: {} };
  for (const r of reports) {
    if (!r.agentReview) continue;
    for (const m of r.agentReview.missingModifiers || [])
      allMissing.modifiers[m] = (allMissing.modifiers[m] || 0) + 1;
    for (const c of r.agentReview.missingComponents || [])
      allMissing.components[c] = (allMissing.components[c] || 0) + 1;
    for (const t of r.agentReview.suggestedTools || [])
      allMissing.tools[t] = (allMissing.tools[t] || 0) + 1;
    for (const p of r.agentReview.dslPainPoints || [])
      allMissing.painPoints[p] = (allMissing.painPoints[p] || 0) + 1;
  }

  const sortByCount = (obj) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

  if (Object.keys(allMissing.modifiers).length > 0) {
    console.log("  Top requested modifiers:");
    for (const [m, c] of sortByCount(allMissing.modifiers))
      console.log(`    ${c}x  ${m}`);
    console.log("");
  }

  if (Object.keys(allMissing.components).length > 0) {
    console.log("  Top requested components:");
    for (const [m, c] of sortByCount(allMissing.components))
      console.log(`    ${c}x  ${m}`);
    console.log("");
  }

  if (Object.keys(allMissing.painPoints).length > 0) {
    console.log("  Top DSL pain points:");
    for (const [m, c] of sortByCount(allMissing.painPoints))
      console.log(`    ${c}x  ${m}`);
    console.log("");
  }

  // Save batch summary
  const summary = {
    screens: screenNums,
    totalTimeMs: totalMs,
    phase1Ms,
    phase2Ms,
    phase3Ms,
    avgScore: parseFloat(avgScore) || null,
    totalTokens,
    reports: reports.map((r) => ({
      screen: r.screenNumber,
      score: r.agentReview?.overallScore || null,
      compiled: !r.compileError,
      built: !r.buildError,
      screenshot: r.screenshotCaptured,
    })),
    aggregateFeedback: allMissing,
  };

  fs.writeFileSync(
    path.join(__dirname, "runs", "batch-summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log(`  Batch summary: eval/runs/batch-summary.json`);
  console.log(`  Individual reports: eval/runs/screen-*/report.md`);
}

main().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
