const { tool } = require("@anthropic-ai/claude-agent-sdk");
const { z } = require("zod");
const fs = require("fs");
const path = require("path");
const { compile } = require("../index.js");

const ROOT = path.resolve(__dirname, "../..");

// ── Tool 1: DSL Overview (the "getting started" page) ──────────────────
const getDslOverview = tool(
  "get_dsl_overview",
  "Get a quick overview of the Design DSL — core elements, basic syntax, and how containers/modifiers work. Start here before writing any .design file.",
  { random: z.string().optional().describe("ignored") },
  async () => ({
    content: [
      {
        type: "text",
        text: `# Design DSL — Quick Start

You write .design files using a shorthand that compiles to SwiftUI.

## Core Syntax
- Containers: VS (VStack), HS (HStack), ZS (ZStack), Scroll (ScrollView)
- Text: T("Hello")
- Images: Img(sys:"star.fill") for SF Symbols, Img("name") for assets
- Buttons: B.cta("Label"), B.sec("Label"), B.text("Label"), B.link("Label"), B.ghost("Label")
- Text Fields: TF("Placeholder"), TF.secure("Password")
- Layout: Spacer, Div (Divider)

## Container Args (in parentheses)
sp:12 → spacing, al:.leading → alignment, p:24 → padding, px:16 → horizontal padding, py:16 → vertical padding

## Modifiers (dot-chained)
.bold .semibold .title .headline .caption .body — font styles/weights
.fg(.blue) .bg(.red) — colors (supports chaining: .fg(.white.opacity(0.8)))
.f(24) — font size
.frame(w:100,h:50) .frame(maxW:.inf) — sizing
.p(16) .px(8) .py(8) .pt(8) .pb(8) .pl(8) .pr(8) — padding
.opacity(0.3) .r(12) — opacity, corner radius
.secondary .tertiary — foreground style shortcuts
.underline .italic — text decoration
.offset(x:10, y:-5) — position offset
.tracking(2) — letter spacing
.ignoresSafeArea — extend to screen edges

## Shapes
Rect → Rectangle(), Circle → Circle(), Capsule → Capsule()
Use with modifiers: Rect.fg(.purple).ignoresSafeArea
Shape borders: Rect.stroke(.gray) or Rect.stroke(.gray, w:2)
Clip to shape: T("hi").clipShape(Capsule) or .clipShape(Circle)

## Borders (container outline)
.border(.gray) — 8pt corner radius, 1pt gray border
.border(.gray, r:12) — custom corner radius
.border(.gray, w:2, r:12) — custom width and radius

## Overlay (layer DSL on top of element)
Use braces with DSL content inside:
Circle.fg(.blue).overlay { Img(sys:"plus").f(14).fg(.white) }
Modifiers after containers work: HS { ... }.bg(.red).p(16)

## IMPORTANT: Only use DSL syntax
Do NOT write raw SwiftUI code in modifiers. Every modifier must be a known DSL modifier.
If you need something not listed here, call get_dsl_reference for the full modifier list.

## Nesting
All nesting uses { }. Indentation is cosmetic only.

## Presets (component shortcuts)
V.card { } — card container
V.badge("Label") — capsule badge
V.cardTitle { } / V.cardBody { } — card sub-sections

## Repetition
Img(sys:"star.fill")*5 — repeat element
["A","B","C"].map(V.badge) — map array to preset

## Key Rules
- One screen per file
- Literal point values (p:24 = 24pt)
- Use SwiftUI color/font names directly
- Only use known DSL modifiers — unknown modifiers will cause errors
- This is STATIC UI only — no state, no bindings, no logic

Use get_dsl_reference for detailed docs on specific topics.`,
      },
    ],
  })
);

// ── Tool 2: DSL Reference (drill-down docs by topic) ───────────────────
const getDslReference = tool(
  "get_dsl_reference",
  "Get detailed DSL reference for a specific topic: 'elements', 'modifiers', 'presets', 'layout_patterns', 'colors', or 'theme'. Use this when you need specifics beyond the overview.",
  {
    topic: z
      .enum([
        "elements",
        "modifiers",
        "presets",
        "layout_patterns",
        "colors",
        "theme",
      ])
      .describe("Which topic to look up"),
  },
  async ({ topic }) => {
    const docs = {
      elements: `# DSL Elements — Full Reference

| Shorthand | SwiftUI | Notes |
|-----------|---------|-------|
| VS | VStack | Vertical stack |
| HS | HStack | Horizontal stack |
| ZS | ZStack | Overlay stack |
| T("text") | Text("text") | Text view |
| Img(sys:"name") | Image(systemName:) | SF Symbol |
| Img("name") | Image("name") | Asset image |
| TF("placeholder") | TextField | Auto .textFieldStyle(.roundedBorder) |
| TF.secure("placeholder") | SecureField | Password field |
| SF("placeholder") | SecureField | Alt secure field syntax |
| B.cta("Label") | Button | Prominent, full-width, large (borderedProminent) |
| B.sec("Label") | Button | Bordered, full-width, large |
| B.text("Label") | Button | Plain style |
| B.link("Label") | Button | Plain + caption font |
| B.ghost("Label") | Button | Borderless |
| V.card { } | VStack | Material bg, rounded corners |
| V.cardTitle { } | VStack | Headline font section |
| V.cardBody { } | VStack | Body font, secondary color |
| V.badge("Label") | Text | Capsule, colored background |
| Spacer | Spacer() | Flex space |
| Div | Divider() | Horizontal line |
| Scroll | ScrollView | Scrollable container |

## Container Arguments
| Arg | SwiftUI | Example |
|-----|---------|---------|
| sp:12 | spacing: 12 | Init parameter |
| al:.leading | alignment: .leading | Init parameter |
| p:24 | .padding(24) | Modifier |
| px:16 | .padding(.horizontal, 16) | Modifier |
| py:16 | .padding(.vertical, 16) | Modifier |
| r:12 | .clipShape(RoundedRectangle(cornerRadius: 12)) | Modifier |`,

      modifiers: `# DSL Modifiers — Full Reference

IMPORTANT: Only use modifiers listed here. Unknown modifiers will cause errors.

## Font Styles (no args)
.largeTitle .title .title2 .title3 .headline .subheadline .body .callout .caption .caption2 .footnote

## Font Weights (no args)
.bold .semibold .medium .light .heavy .thin .black .regular

## Foreground Styles (no args)
.secondary .tertiary .quaternary

## Text Decoration (no args)
.underline .italic

## Layout (no args)
.ignoresSafeArea

## Color
| Modifier | SwiftUI | Example |
|----------|---------|---------|
| .fg(.color) | .foregroundStyle(.color) | .fg(.blue) |
| .bg(.color) | .background(.color) | .bg(.red) |
Colors support chaining: .fg(.white.opacity(0.8)), .bg(.gray.opacity(0.3))

## Typography
| .f(size) | .font(.system(size:)) | .f(24) |
| .font(.style) | .font(.style) | .font(.largeTitle) |
| .tracking(val) | .tracking(val) | .tracking(2) |

## Sizing
| .frame(w:,h:) | .frame(width:,height:) | .frame(w:100,h:50) |
| .frame(maxW:.inf) | .frame(maxWidth:.infinity) | full width |
| .frame(al:.leading) | .frame(alignment:.leading) | alignment in frame |

## Padding
| .p(val) | all sides | .p(16) |
| .px(val) | horizontal | .px(8) |
| .py(val) | vertical | .py(8) |
| .pt(val) | top | .pt(8) |
| .pb(val) | bottom | .pb(8) |
| .pl(val) | leading | .pl(8) |
| .pr(val) | trailing | .pr(8) |

## Shape & Clipping
| .r(val) | rounded corners | .r(12) |
| .clipShape(Capsule) | clip to capsule | .clipShape(Capsule) |
| .clipShape(Circle) | clip to circle | .clipShape(Circle) |

## Borders
| .border(.color) | outlined container (8pt radius) | .border(.gray) |
| .border(.color, r:12) | custom radius | .border(.blue, r:12) |
| .border(.color, w:2, r:12) | custom width + radius | .border(.gray, w:2, r:12) |
| .stroke(.color) | shape border (use on Rect/Circle) | .stroke(.gray) |
| .stroke(.color, w:2) | shape border with width | .stroke(.purple, w:2) |

## Overlay (layer DSL content on top)
Use braces — DSL inside gets parsed:
  Circle.fg(.blue).overlay { Img(sys:"plus").f(14).fg(.white) }
  Rect.frame(w:40,h:40).overlay { T("!").bold.fg(.white) }

## Other
| .opacity(val) | transparency | .opacity(0.3) |
| .offset(x:,y:) | position offset | .offset(x:10, y:-5) |
| .multiline(.center) | text alignment | .multiline(.center) |`,

      presets: `# DSL Presets — Full Reference

Presets are component shortcuts that map to Swift ViewModifiers in Theme.swift or helper structs in Components.swift.

## Button Presets
| Preset | What it generates | Style |
|--------|-------------------|-------|
| B.cta("Label") | CTAButton(label: "Label") | borderedProminent, full-width, large, semibold |
| B.sec("Label") | SecButton(label: "Label") | bordered, full-width, large, medium weight |
| B.text("Label") | Button("Label", action: {}).btnText() | plain style |
| B.link("Label") | Button("Label", action: {}).btnLink() | plain + caption font |
| B.ghost("Label") | Button("Label", action: {}).btnGhost() | borderless |

## Card Presets
| Preset | What it generates | Style |
|--------|-------------------|-------|
| V.card { } | VStack { ... }.card() | material bg, 12pt rounded corners |
| V.cardTitle { } | VStack { ... }.cardTitle() | headline font |
| V.cardBody { } | VStack { ... }.cardBody() | body font, secondary color |

## Badge Preset
| Preset | What it generates | Style |
|--------|-------------------|-------|
| V.badge("Label") | Text("Label").badge() | caption2, medium weight, capsule, blue bg, white text |

## TextField Presets
| Preset | What it generates |
|--------|-------------------|
| TF("Placeholder") | TextField("Placeholder", text: .constant("")).textFieldStyle(.roundedBorder) |
| TF.secure("Placeholder") | SecureField("Placeholder", text: .constant("")).textFieldStyle(.roundedBorder) |`,

      layout_patterns: `# Layout Patterns — Proven Recipes

## Hero with layered circles
ZS {
  Img(sys:"circle.fill").f(200).fg(.green).opacity(0.12)
  Img(sys:"circle.fill").f(150).fg(.green).opacity(0.2)
  Img(sys:"circle.fill").f(90).fg(.green).opacity(0.4)
  Img(sys:"flame.fill").f(44).fg(.white)
}

## Page indicator dots
HS(sp:6) {
  Img(sys:"circle.fill").f(8).fg(.blue)
  Img(sys:"circle.fill").f(8).fg(.gray).opacity(0.3)
}

## Form field with label
VS(sp:6) {
  T("Label").bold.caption
  TF("Placeholder")
}

## Two-tone headline
VS(sp:8) {
  T("Track Your").bold.font(.largeTitle)
  T("Calories").bold.font(.largeTitle).fg(.green)
}

## Full-screen onboarding layout
VS(p:32, sp:0) {
  Spacer
  // hero content (icon/illustration)
  Spacer
  // text content (headline + subtitle)
  Spacer
  // CTA buttons + page dots
}

## Card with stats row
HS(sp:12) {
  V.card {
    VS(al:.leading, sp:8, p:16) {
      Img(sys:"flame.fill").f(24).fg(.orange)
      T("1,847").bold.title2
      T("Calories").secondary.caption
    }
  }
}

## List item with icon
HS(sp:12) {
  ZS {
    Img(sys:"circle.fill").f(44).fg(.green).opacity(0.15)
    Img(sys:"leaf.fill").f(20).fg(.green)
  }
  VS(al:.leading, sp:2) {
    T("Title").semibold
    T("Subtitle").secondary.caption
  }
  Spacer
  T("Detail").secondary.caption
}`,

      colors: `# Colors

Use SwiftUI color names directly. No aliases, no mapping.

## Standard Colors
.blue .red .green .orange .purple .pink .yellow .gray .white .black .mint .teal .cyan .indigo .brown

## Semantic Colors
.primary .secondary

## Usage
.fg(.blue) — foreground color
.bg(.red) — background color
Img(sys:"star.fill").fg(.yellow) — icon color

## Tips
- Use .opacity(0.15) on circle.fill to create soft colored backgrounds for icons
- .secondary on text gives it a muted gray appearance
- SwiftUI's .primary automatically adapts to light/dark mode`,

      theme: `# Theme & Components — Customization

The styling system lives in two Swift files you can read and edit:

## Theme.swift (ViewModifier extensions)
Current modifiers:
- .btnText() — plain button style
- .btnLink() — plain + caption font
- .btnGhost() — borderless
- .badge(color) — capsule badge (caption2, medium weight, colored bg, white text)
- .card() — material bg, 12pt rounded corners
- .cardTitle() — headline font
- .cardBody() — body + secondary color

## Components.swift (Helper structs)
- CTAButton(label:) — borderedProminent, full-width, large, semibold
- SecButton(label:) — bordered, full-width, large, medium weight

## How to Add a New Preset
1. Add Swift ViewModifier extension to Theme.swift (or struct to Components.swift)
2. Add one entry to parser/presets.js mapping the DSL name to the Swift modifier
3. Done — the parser picks it up automatically

## How to Customize Existing Styles
Edit Theme.swift directly. For example, to change card corner radius:
  .clipShape(RoundedRectangle(cornerRadius: 16)) // was 12

## When to Edit Theme vs Use Modifiers
- Edit Theme.swift when you need a REUSABLE styled component (like a custom button variant)
- Use inline modifiers when it's a one-off style (.fg(.purple).bold)

Use read_theme and edit_theme tools to view/modify these files.`,
    };

    return {
      content: [{ type: "text", text: docs[topic] || "Unknown topic" }],
    };
  }
);

// ── Tool 3: Write .design file ──────────────────────────────────────────
const writeDesign = tool(
  "write_design",
  "Write a .design file. This is the DSL shorthand that will be compiled to SwiftUI.",
  {
    filename: z.string().describe("Filename like 'screen-1.design'"),
    content: z.string().describe("The DSL content"),
  },
  async ({ filename, content }) => {
    const outDir = path.join(ROOT, "agent-output");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, filename);
    fs.writeFileSync(filePath, content);
    return {
      content: [
        { type: "text", text: `Written ${filePath} (${content.length} chars)` },
      ],
    };
  }
);

// ── Tool 4: Compile .design → Swift + build + screenshot ────────────────
const compileAndScreenshot = tool(
  "compile_and_screenshot",
  "Compile a .design file to SwiftUI, build the Xcode project, install on simulator, and take a screenshot. Returns the path to the screenshot PNG.",
  {
    filename: z
      .string()
      .describe("The .design filename in agent-output/ to compile"),
  },
  async ({ filename }) => {
    const { execSync } = require("child_process");
    const outDir = path.join(ROOT, "agent-output");
    const designPath = path.join(outDir, filename);

    if (!fs.existsSync(designPath)) {
      return {
        content: [{ type: "text", text: `Error: ${designPath} not found` }],
      };
    }

    // 1. Compile .design → ContentView.swift
    const input = fs.readFileSync(designPath, "utf-8");
    let swift;
    try {
      swift = compile(input);
    } catch (err) {
      return {
        content: [
          { type: "text", text: `DSL compile error: ${err.message}` },
        ],
      };
    }

    const swiftPath = path.join(ROOT, "design", "ContentView.swift");
    fs.writeFileSync(swiftPath, swift);

    // 2. Build
    try {
      execSync(
        `xcodebuild -project design.xcodeproj -scheme design -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build 2>&1`,
        { cwd: ROOT, timeout: 120000 }
      );
    } catch (err) {
      // Extract useful error lines
      const output = err.stdout ? err.stdout.toString() : err.message;
      const errorLines = output
        .split("\n")
        .filter((l) => l.includes("error:"))
        .slice(0, 10)
        .join("\n");
      return {
        content: [
          {
            type: "text",
            text: `Build failed:\n${errorLines || output.slice(-1000)}`,
          },
        ],
      };
    }

    // 3. Find the .app
    let appPath;
    try {
      appPath = execSync(
        `find ~/Library/Developer/Xcode/DerivedData -name "design.app" -path "*/Build/Products/Debug-iphonesimulator/*" -not -path "*/Index.noindex/*" | head -1`,
        { encoding: "utf-8" }
      ).trim();
    } catch {
      return {
        content: [{ type: "text", text: "Could not find built .app" }],
      };
    }

    // 4. Install + launch + screenshot
    const screenshotPath = path.join(
      outDir,
      filename.replace(".design", ".png")
    );
    try {
      execSync(
        `xcrun simctl terminate "iPhone 17 Pro" com.awwal.design 2>/dev/null || true`,
        { cwd: ROOT }
      );
      execSync(`xcrun simctl install "iPhone 17 Pro" "${appPath}"`, {
        cwd: ROOT,
      });
      execSync(`xcrun simctl launch "iPhone 17 Pro" com.awwal.design`, {
        cwd: ROOT,
      });
      execSync("sleep 2");
      execSync(
        `xcrun simctl io "iPhone 17 Pro" screenshot "${screenshotPath}"`,
        { cwd: ROOT }
      );
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Simulator error: ${err.message}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Screenshot saved to ${screenshotPath}`,
        },
      ],
    };
  }
);

// ── Tool 5: Read current Theme.swift ────────────────────────────────────
const readTheme = tool(
  "read_theme",
  "Read the current Theme.swift file to see all available ViewModifier extensions. Read this before deciding to add/edit modifiers.",
  { random: z.string().optional().describe("ignored") },
  async () => {
    const content = fs.readFileSync(
      path.join(ROOT, "design", "Theme.swift"),
      "utf-8"
    );
    return { content: [{ type: "text", text: content }] };
  }
);

// ── Tool 6: Read current Components.swift ───────────────────────────────
const readComponents = tool(
  "read_components",
  "Read the current Components.swift file to see helper view structs (CTAButton, SecButton, etc).",
  { random: z.string().optional().describe("ignored") },
  async () => {
    const content = fs.readFileSync(
      path.join(ROOT, "design", "Components.swift"),
      "utf-8"
    );
    return { content: [{ type: "text", text: content }] };
  }
);

// ── Tool 7: Edit Theme.swift ────────────────────────────────────────────
const editTheme = tool(
  "edit_theme",
  "Replace the entire contents of Theme.swift with new content. Use this to add new ViewModifier extensions or customize existing ones.",
  {
    content: z.string().describe("The full new content of Theme.swift"),
  },
  async ({ content }) => {
    const themePath = path.join(ROOT, "design", "Theme.swift");
    fs.writeFileSync(themePath, content);
    return {
      content: [{ type: "text", text: `Theme.swift updated (${content.length} chars)` }],
    };
  }
);

// ── Tool 8: Edit Components.swift ───────────────────────────────────────
const editComponents = tool(
  "edit_components",
  "Replace the entire contents of Components.swift with new content. Use this to add new helper view structs.",
  {
    content: z.string().describe("The full new content of Components.swift"),
  },
  async ({ content }) => {
    const componentsPath = path.join(ROOT, "design", "Components.swift");
    fs.writeFileSync(componentsPath, content);
    return {
      content: [
        {
          type: "text",
          text: `Components.swift updated (${content.length} chars)`,
        },
      ],
    };
  }
);

// ── Tool 9: Edit presets.js ─────────────────────────────────────────────
const editPresets = tool(
  "edit_presets",
  "Replace the entire contents of presets.js with new content. Use this to register new DSL presets after adding their Swift counterparts.",
  {
    content: z.string().describe("The full new content of presets.js"),
  },
  async ({ content }) => {
    const presetsPath = path.join(ROOT, "parser", "presets.js");
    fs.writeFileSync(presetsPath, content);
    // Clear require cache so compile picks up changes
    delete require.cache[require.resolve("../presets.js")];
    return {
      content: [
        { type: "text", text: `presets.js updated (${content.length} chars)` },
      ],
    };
  }
);

// ── Tool 10: List available reference screenshots ───────────────────────
const listScreenshots = tool(
  "list_reference_screenshots",
  "List available reference screenshot filenames from sample-images/. Returns the filenames you can pass to the agent to analyze.",
  { random: z.string().optional().describe("ignored") },
  async () => {
    const dir = path.join(ROOT, "sample-images");
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
    return {
      content: [
        {
          type: "text",
          text: `${files.length} screenshots available:\n${files.slice(0, 20).join("\n")}\n...`,
        },
      ],
    };
  }
);

module.exports = {
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
};
