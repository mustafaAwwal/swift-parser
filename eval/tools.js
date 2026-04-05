const { tool } = require("@anthropic-ai/claude-agent-sdk");
const { z } = require("zod");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { compile } = require("../parser/index.js");

const ROOT = path.resolve(__dirname, "..");
const DESIGN_DIR = path.join(ROOT, "design");
const SIMULATOR = "iPhone 17 Pro";

// ── Tool 1: DSL Overview ───────────────────────────────────────────────
const getDslOverview = tool(
  "get_dsl_overview",
  "Get a quick overview of the Design DSL — core elements, basic syntax, and how containers/modifiers work. Call this FIRST before writing any .design file.",
  { random: z.string().optional().describe("ignored") },
  async () => ({
    content: [
      {
        type: "text",
        text: `# Design DSL — Quick Start

Shorthand that compiles to SwiftUI. One screen per file. All nesting uses { }. Static UI only.

## (MANDATORY) READ BEFORE WRITING
1. **Use presets** — (MANDATORY) check the Presets section below before building ANY component manually. If a preset exists, use it.
2. **Colored headers**: (MANDATORY) Use ZS { Rect.fg(#color).ignoresSafeArea  VS(p:16) { content } }. NEVER .pt(60). NEVER .ignoresSafeArea on the content VS.
3. **Hex colors**: (MANDATORY) Always # prefix. .fg(#FF6600) not .fg(FF6600)
4. **Unknown modifiers**: ONLY use modifiers listed here. Unknown ones cause compile errors.
5. **Images**: No real images. Use Img.placeholder() or Img(sys:"icon") SF Symbols.

## Presets — Use These First!
B.cta("Go") — primary button (full-width, prominent)
B.sec("Go") — secondary button (full-width, bordered)
B.text("Go") / B.link("Go") / B.ghost("Go") — plain/link/borderless
V.card { } — card (material bg, rounded corners)
V.badge("Label") — capsule badge
TF("Placeholder") — text field  |  TF.secure("Password") — password
TF.search("Search...") — empty search bar  |  TF.search("Search...", "query") — with value
TF.float("Label") — floating label field  |  TF.float("Label", "Value") — filled
TF.floatSecure("Password") — floating label secure field
Img.placeholder(h:200, color:.orange, icon:"fork.knife") — image placeholder
Seg("Pickup", "Delivery", active:0) — native segmented control
Tab(tint:#520080, active:1) { Tab.item("Home", sys:"house") { content } Tab.item("Menu", sys:"fork.knife") } — native tab bar

## Core Elements
VS/HS/ZS — VStack/HStack/ZStack. Args: sp:12 al:.leading p:24 px:16 py:16
T("text") — Text  |  Img(sys:"star.fill") — SF Symbol  |  Img("name") — asset
Scroll { } — ScrollView  |  Spacer — flex space  |  Div — divider
Rect/Circle/Capsule — shapes  |  LG(.purple, .black, dir:.down) — gradient

## Modifiers (dot-chained)
Font: .bold .semibold .medium .title .headline .caption .body .f(24) .font(.largeTitle)
Color: .fg(.blue) .bg(.red) .fg(#FF6600) .fg(LG(.red, .blue, dir:.right)) .secondary .tertiary
Padding: .p(16) .px(8) .py(8) .pt(8) .pb(8) .pl(8) .pr(8)
Layout: .frame(w:100,h:50) .frame(maxW:.inf) .opacity(0.3) .offset(x:10,y:-5) .ignoresSafeArea
Shape: .r(12) .clipShape(Capsule) .border(.gray, r:12) .border(.white, w:2, r:Capsule) .stroke(.gray, w:2)
Text: .tracking(2) .lineLimit(2) .lineSpacing(4) .underline .italic .multiline(.center)
Visual: .shadow(.black, r:4, x:0, y:2) .overlay { DSL content }

## Hex Colors & Gradients
.fg(#FF6600) .bg(#1A0A2E) — always # prefix!
LG(.purple, .black) — gradient element (default top→bottom)
LG(#6B2FA0, #1A0A2E, dir:.right) — gradient with hex, left→right
T("Hi").fg(LG(.red, .blue, dir:.right)) — gradient text
dir:.down .up .right .left

## Text Concatenation (inline styled text)
TC { T("Agree to ") T("Terms").fg(.blue).underline T(" and ") T("Privacy").fg(.blue).underline }.caption

## Key Patterns
Colored header: ZS { Rect.fg(#5A2D82).ignoresSafeArea  VS(p:16) { content } }
Full-screen gradient: ZS { LG(#6B2FA0, #1A0A2E).ignoresSafeArea  VS { content } }
Pill border: HS { content }.px(24).py(12).border(.white, w:2, r:Capsule)
Icon with bg: ZS { Circle.fg(.blue).frame(w:44,h:44) Img(sys:"plus").fg(.white) }
Repetition: Img(sys:"star.fill")*5  |  ["A","B"].map(V.badge)

## Custom Components
Need a checkbox, toggle, or custom card? Use edit_theme/edit_components tools to create it.

Call get_dsl_reference for full details on any topic.`,
      },
    ],
  })
);

// ── Tool 2: DSL Reference ──────────────────────────────────────────────
const getDslReference = tool(
  "get_dsl_reference",
  "Get detailed DSL reference for a specific topic. Use when you need specifics beyond the overview.",
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
| B.cta("Label") | Button | borderedProminent, full-width, large |
| B.sec("Label") | Button | bordered, full-width, large |
| B.text("Label") | Button | Plain style |
| B.link("Label") | Button | Plain + caption font |
| B.ghost("Label") | Button | Borderless |
| V.card { } | VStack | Material bg, rounded corners |
| V.cardTitle { } | VStack | Headline font |
| V.cardBody { } | VStack | Body font, secondary color |
| V.badge("Label") | Text | Capsule, colored bg |
| Spacer | Spacer() | Flex space |
| Div | Divider() | Horizontal line |
| Scroll | ScrollView | Scrollable container |
| Rect | Rectangle() | Shape |
| Circle | Circle() | Shape |
| Capsule | Capsule() | Shape |

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

IMPORTANT: ONLY use modifiers listed here. Unknown modifiers WILL cause compile errors.

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
.fg(.color) → .foregroundStyle(.color)
.bg(.color) → .background(.color)
Colors support chaining: .fg(.white.opacity(0.8))
Hex colors: .fg(#FF6600) .bg(#1A0A2E)

## Typography
.f(size) → .font(.system(size:))
.font(.style) → .font(.style)
.tracking(val) → .tracking(val)

## Sizing
.frame(w:100,h:50) → .frame(width:100,height:50)
.frame(maxW:.inf) → .frame(maxWidth:.infinity)
.frame(al:.leading) → .frame(alignment:.leading)

## Padding
.p(val) .px(val) .py(val) .pt(val) .pb(val) .pl(val) .pr(val)

## Shape & Clipping
.r(val) → rounded corners
.clipShape(Capsule) .clipShape(Circle)

## Borders
.border(.color) — 8pt radius, 1pt border
.border(.color, r:12) — custom radius
.border(.color, w:2, r:12) — custom width + radius
.border(.color, r:Capsule) — pill-shaped border
.border(.color, w:2, r:Capsule) — pill border with width
.stroke(.color) — shape border
.stroke(.color, w:2) — shape border with width

## Overlay
.overlay { DSL content here }

## Other
.opacity(val) .offset(x:val, y:val) .multiline(.center)
.lineLimit(N) — max lines for text
.lineSpacing(N) — space between text lines
.shadow(.color, r:N, x:N, y:N) — drop shadow (color optional, r defaults to 4)

THAT'S IT. Do not use any modifier not listed above.`,

      presets: `# DSL Presets

## Buttons
B.cta("Label") → CTAButton(label:) — borderedProminent, full-width, large, semibold
B.sec("Label") → SecButton(label:) — bordered, full-width, large, medium
B.text("Label") → Button + .btnText() — plain
B.link("Label") → Button + .btnLink() — plain + caption
B.ghost("Label") → Button + .btnGhost() — borderless

## Cards
V.card { } → VStack + .card() — material bg, 12pt corners
V.cardTitle { } → VStack + .cardTitle() — headline font
V.cardBody { } → VStack + .cardBody() — body + secondary

## Badge
V.badge("Label") → Text + .badge() — capsule, blue bg, white text, caption2

## TextField
TF("Placeholder") → TextField + .textFieldStyle(.roundedBorder)
TF.secure("Placeholder") → SecureField + .textFieldStyle(.roundedBorder)`,

      layout_patterns: `# Layout Patterns

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

## Full-screen layout
VS(p:32, sp:0) {
  Spacer
  // hero
  Spacer
  // text
  Spacer
  // CTA + dots
}

## Card with stats
V.card {
  VS(al:.leading, sp:8, p:16) {
    Img(sys:"flame.fill").f(24).fg(.orange)
    T("1,847").bold.title2
    T("Calories").secondary.caption
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
}

## Colored rectangle as image placeholder
ZS {
  Rect.fg(.orange.opacity(0.3)).frame(h:200)
  Img(sys:"photo").f(40).fg(.gray)
}

## Tab bar (approximate)
HS {
  Spacer
  VS(sp:4) { Img(sys:"house.fill").f(20) T("Home").caption2 }.fg(.purple)
  Spacer
  VS(sp:4) { Img(sys:"magnifyingglass").f(20) T("Search").caption2 }.fg(.gray)
  Spacer
  VS(sp:4) { Img(sys:"person").f(20) T("Profile").caption2 }.fg(.gray)
  Spacer
}`,

      colors: `# Colors

SwiftUI color names directly:
.blue .red .green .orange .purple .pink .yellow .gray .white .black .mint .teal .cyan .indigo .brown

Semantic: .primary .secondary

Hex colors: ALWAYS use # prefix! #RRGGBB or #RRGGBBAA
Examples: .fg(#FF6600) .bg(#1A0A2E) LG(#6B2FA0, #1A0A2E)
WRONG: .fg(FF6600) — this will fail! Always use .fg(#FF6600)

Usage: .fg(.blue) .bg(.red)
With opacity: .fg(.white.opacity(0.8)) .bg(.gray.opacity(0.3))`,

      theme: `# Theme & Components

## Theme.swift (ViewModifier extensions)
- .btnText() — plain button style
- .btnLink() — plain + caption font
- .btnGhost() — borderless
- .badge(color) — capsule badge (caption2, medium, colored bg, white text)
- .card() — material bg, 12pt rounded corners
- .cardTitle() — headline font
- .cardBody() — body + secondary color

## Components.swift (Helper structs)
- CTAButton(label:) — borderedProminent, full-width, large, semibold
- SecButton(label:) — bordered, full-width, large, medium

## To add new presets:
1. Add Swift extension to Theme.swift (or struct to Components.swift)
2. Add entry to parser/presets.js
3. Done

Use read_theme / read_components to view current implementations.`,
    };

    return {
      content: [{ type: "text", text: docs[topic] || "Unknown topic" }],
    };
  }
);

// ── Tool 3: Write .design file ─────────────────────────────────────────
function createWriteDesignTool(runDir) {
  return tool(
    "write_design",
    "Write the .design DSL file for this screen. This will be compiled to SwiftUI and screenshotted.",
    {
      content: z.string().describe("The DSL content for this screen"),
    },
    async ({ content }) => {
      const filePath = path.join(runDir, "output.design");
      fs.writeFileSync(filePath, content);

      // Step 1: DSL compile
      let swift;
      try {
        swift = compile(content);
        fs.writeFileSync(path.join(runDir, "compiled.swift"), swift);
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Written but COMPILE ERROR: ${err.message}\n\nFix your DSL and call write_design again.`,
            },
          ],
        };
      }

      // Step 2: Swift validation (swiftc -typecheck)
      try {
        const tmpSwift = path.join(runDir, "_validate.swift");
        fs.writeFileSync(tmpSwift, swift);
        const sdk = execSync("xcrun --show-sdk-path --sdk iphonesimulator", {
          encoding: "utf-8",
        }).trim();
        execSync(
          `swiftc -typecheck -sdk "${sdk}" -target arm64-apple-ios18.0-simulator "${path.join(DESIGN_DIR, "Theme.swift")}" "${path.join(DESIGN_DIR, "Components.swift")}" "${tmpSwift}" 2>&1`,
          { timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
        );
        fs.unlinkSync(tmpSwift);
        return {
          content: [
            {
              type: "text",
              text: `Written and validated (${content.length} chars DSL → ${swift.length} chars Swift). Swift compilation check passed.`,
            },
          ],
        };
      } catch (err) {
        const output = err.stdout ? err.stdout.toString() : err.message;
        const errorLines = output
          .split("\n")
          .filter((l) => l.includes("error:"))
          .slice(0, 5)
          .join("\n");
        // Clean up
        const tmpSwift = path.join(runDir, "_validate.swift");
        if (fs.existsSync(tmpSwift)) fs.unlinkSync(tmpSwift);
        return {
          content: [
            {
              type: "text",
              text: `Written and DSL compiled, but SWIFT VALIDATION FAILED:\n${errorLines}\n\nThe generated Swift code has type errors. Fix your DSL and call write_design again.`,
            },
          ],
        };
      }
    }
  );
}

// ── Tool 4: Submit review ──────────────────────────────────────────────
function createSubmitReviewTool(runDir) {
  return tool(
    "submit_review",
    "Submit your self-assessment after comparing your screenshot to the reference. Be honest about what matched and what didn't.",
    {
      overallScore: z
        .number()
        .min(1)
        .max(10)
        .describe("1-10 score for how closely the output matches the reference"),
      strengths: z
        .array(z.string())
        .describe("What matched well (layout, colors, hierarchy, etc.)"),
      shortcomings: z
        .array(z.string())
        .describe(
          "What didn't match and WHY — was it a DSL limitation or a mistake?"
        ),
      missingModifiers: z
        .array(z.string())
        .describe(
          "Modifiers you wished existed but don't (e.g., '.shadow()', '.gradient()')"
        ),
      missingComponents: z
        .array(z.string())
        .describe(
          "Components/presets that would have helped (e.g., 'TabBar', 'SearchBar', 'Checkbox')"
        ),
      suggestedTools: z
        .array(z.string())
        .describe(
          "Tool calls that would have helped you do a better job (e.g., 'preview without full build', 'SF Symbol search')"
        ),
      dslPainPoints: z
        .array(z.string())
        .describe(
          "Specific DSL syntax issues that slowed you down or caused confusion"
        ),
    },
    async ({
      overallScore,
      strengths,
      shortcomings,
      missingModifiers,
      missingComponents,
      suggestedTools,
      dslPainPoints,
    }) => {
      const review = {
        overallScore,
        strengths,
        shortcomings,
        missingModifiers,
        missingComponents,
        suggestedTools,
        dslPainPoints,
      };
      fs.writeFileSync(
        path.join(runDir, "review.json"),
        JSON.stringify(review, null, 2)
      );
      return {
        content: [
          { type: "text", text: "Review submitted. Evaluation complete." },
        ],
      };
    }
  );
}

// ── Tool 5: Read Theme ─────────────────────────────────────────────────
const readTheme = tool(
  "read_theme",
  "Read Theme.swift to see available ViewModifier extensions.",
  { random: z.string().optional().describe("ignored") },
  async () => {
    const content = fs.readFileSync(
      path.join(DESIGN_DIR, "Theme.swift"),
      "utf-8"
    );
    return { content: [{ type: "text", text: content }] };
  }
);

// ── Tool 6: Read Components ────────────────────────────────────────────
const readComponents = tool(
  "read_components",
  "Read Components.swift to see helper view structs.",
  { random: z.string().optional().describe("ignored") },
  async () => {
    const content = fs.readFileSync(
      path.join(DESIGN_DIR, "Components.swift"),
      "utf-8"
    );
    return { content: [{ type: "text", text: content }] };
  }
);

// ── Tool 7: Edit Theme ─────────────────────────────────────────────────
const editTheme = tool(
  "edit_theme",
  "Replace Theme.swift contents. Use this to add new ViewModifier extensions (e.g., checkbox styles, custom badges). Read it first with read_theme.",
  {
    content: z.string().describe("The full new content of Theme.swift"),
  },
  async ({ content }) => {
    fs.writeFileSync(path.join(DESIGN_DIR, "Theme.swift"), content);
    return {
      content: [
        { type: "text", text: `Theme.swift updated (${content.length} chars)` },
      ],
    };
  }
);

// ── Tool 8: Edit Components ────────────────────────────────────────────
const editComponents = tool(
  "edit_components",
  "Replace Components.swift contents. Use this to add new helper view structs. Read it first with read_components.",
  {
    content: z.string().describe("The full new content of Components.swift"),
  },
  async ({ content }) => {
    fs.writeFileSync(path.join(DESIGN_DIR, "Components.swift"), content);
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

// ── Tool 9: Edit Presets ───────────────────────────────────────────────
const editPresets = tool(
  "edit_presets",
  "Replace presets.js contents. Use this to register new DSL presets after adding their Swift counterparts. Read current presets with get_dsl_reference topic 'presets'.",
  {
    content: z.string().describe("The full new content of presets.js"),
  },
  async ({ content }) => {
    const presetsPath = path.join(ROOT, "parser", "presets.js");
    fs.writeFileSync(presetsPath, content);
    delete require.cache[require.resolve("../parser/presets.js")];
    return {
      content: [
        { type: "text", text: `presets.js updated (${content.length} chars)` },
      ],
    };
  }
);

module.exports = {
  getDslOverview,
  getDslReference,
  createWriteDesignTool,
  createSubmitReviewTool,
  readTheme,
  readComponents,
  editTheme,
  editComponents,
  editPresets,
};
