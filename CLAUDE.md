# Design DSL — SwiftUI Shorthand Parser

## What This Project Is

A **shorthand DSL and JS parser** that converts compact notation into full SwiftUI code. It dramatically reduces token output from a design agent (Claude via Agent SDK) so screen generation drops from ~5 minutes to under a minute.

**The user never sees code** — they only see the final screenshot. This is image generation to them. Static screenshots only — no animations, state, or interactivity matter.

## Architecture

```
Design Agent (Claude) → writes .design shorthand
        ↓
Parser (Node.js) → expands to SwiftUI .swift files
        ↓
swiftc -typecheck → validates per-screen (catches errors before build)
        ↓
xcodebuild → compiles Xcode project on iOS Simulator
        ↓
AutoCaptureView + Express server → screenshots returned to user
```

## File Structure

```
parser/
  index.js         — entry point (CLI + importable via require)
  tokenizer.js     — tokenizes .design files (supports #hex, strings, numbers, etc.)
  parser.js        — recursive descent parser → AST (handles LG() as arg values, gradient types)
  generator.js     — AST → SwiftUI code (600+ lines — handles all elements, modifiers, presets)
  presets.js       — preset registry (maps preset names to generation strategies)
  test.js          — snapshot tests (5 cases)
  agent/
    run.js         — original batch agent runner (20 screens at once)
    tools.js       — MCP tools for the design agent (10 tools)
    server.js      — Express server for screenshot capture via simctl
    swift-gen.js   — generates AutoCaptureView.swift + ContentView.swift for batch capture

eval/                — NEW: Single-screen evaluation system
  run.js           — CLI: node eval/run.js <screen-numbers> (single, range, or batch)
  tools.js         — MCP tools for eval agent (overview, reference, write, review, theme/component editing)
  report.js        — generates report.json + report.md per screen
  runs/            — output per screen (gitignored)
    screen-N/
      input.png, output.design, compiled.swift, output.png,
      review.json, report.json, report.md, agent-log.json

examples/          — example .design files (5 reference screens)
sample-images/     — 100 Taco Bell reference screenshots (gitignored)
agent-output/      — old batch agent output (gitignored)

design/            — Xcode project
  ContentView.swift  — GENERATED FILE (parser output, never edit manually)
  Theme.swift        — ViewModifier extensions + Color(hex:) init
  Components.swift   — Helper view structs (CTAButton, SecButton, FloatingTextField, SearchBar, ImagePlaceholder)
  designApp.swift    — app entry point (do not touch)
```

## Pipeline Commands

```bash
# Parse .design → Swift
node parser/index.js <input.design> [output.swift]

# Run eval on a single screen
node eval/run.js 5

# Run eval on a range
node eval/run.js 0-10

# Run tests
cd parser && node --test test.js

# Build
xcodebuild -project design.xcodeproj -scheme design -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build

# Validate a single Swift file
swiftc -typecheck -sdk "$(xcrun --show-sdk-path --sdk iphonesimulator)" -target arm64-apple-ios18.0-simulator design/Theme.swift design/Components.swift <file.swift>
```

## Eval System

The eval runner (`eval/run.js`) evaluates the DSL system by having an agent recreate reference screenshots:

**Pipeline per screen:**
1. Agent reads reference screenshot → writes .design DSL (one-shot)
2. Runner compiles DSL → Swift, validates with `swiftc -typecheck`
3. Builds Xcode project, captures screenshot via AutoCaptureView + Express server
4. Agent reviews its own output vs reference, submits structured self-assessment
5. Report generated with timing, tokens, compression ratio, agent feedback

**Batch mode:** Screens run in 3 phases:
- Phase 1 (parallel): All agents write DSL concurrently
- Phase 2 (sequential): Compile all → build once → screenshot all via Express server
- Phase 3 (parallel): All agents review concurrently

**Build safety:** 3 layers of defense against failed builds:
1. `write_design` tool runs `swiftc -typecheck` — agent gets immediate error feedback
2. Pre-build validation removes bad screens before batch build
3. Build isolation retry — parse xcodebuild errors, remove offending file, retry

**⚠ Parallel caveat:** When agents run in parallel and have `edit_theme`/`edit_components` tools, they can stomp on each other's edits. For batch runs with component editing, run screens sequentially or accept that Theme.swift may be inconsistent.

**Reports include:** timing breakdown, token usage, DSL→Swift compression ratio, agent self-review (score 1-10, strengths, shortcomings, missing modifiers, missing components, suggested tools, DSL pain points). Batch runs aggregate feedback across all screens.

---

# DSL Rules & Reference

## Core Elements

| Shorthand | SwiftUI | Notes |
|-----------|---------|-------|
| `VS` | `VStack` | Vertical stack |
| `HS` | `HStack` | Horizontal stack |
| `ZS` | `ZStack` | Overlay stack |
| `T("text")` | `Text("text")` | Text view |
| `Img(sys:"name")` | `Image(systemName:)` | SF Symbol |
| `Img("name")` | `Image("name")` | Asset image |
| `TF("placeholder")` | `TextField` | Auto `.textFieldStyle(.roundedBorder)` |
| `TF.secure("placeholder")` | `SecureField` | Password field |
| `TF.search("Search...")` | `SearchBar` | Search bar with icon |
| `TF.search("Search...", "query")` | `SearchBar` | Search bar with value |
| `TF.float("Label")` | `FloatingTextField` | Floating label (empty) |
| `TF.float("Label", "Value")` | `FloatingTextField` | Floating label (filled) |
| `TF.floatSecure("Password")` | `FloatingSecureField` | Secure floating label |
| `B.cta("Label")` | `CTAButton` | Prominent, full-width, large |
| `B.sec("Label")` | `SecButton` | Bordered, full-width, large |
| `B.text("Label")` | Button | Plain style |
| `B.link("Label")` | Button | Plain + caption font |
| `B.ghost("Label")` | Button | Borderless |
| `V.card { }` | VStack | Material bg, rounded corners |
| `V.cardTitle { }` | VStack | Headline font for card titles |
| `V.cardBody { }` | VStack | Body font, secondary color |
| `V.badge("Label")` | Text | Capsule, colored background |
| `Img.placeholder(h:200, color:.orange, icon:"fork.knife")` | `ImagePlaceholder` | Colored rect with icon |
| `Seg("A", "B", active:0)` | `Picker` | Native segmented control |
| `Tab(tint:#520080, active:1) { Tab.item(...) }` | `TabView` | Native iOS 26 tab bar (liquid glass) |
| `TC { T("plain ") T("bold").bold }` | Text + | Concatenated inline text |
| `LG(.purple, .black, dir:.down)` | `LinearGradient` | Gradient (element or value) |
| `Spacer` | `Spacer()` | Flex space |
| `Div` | `Divider()` | Horizontal line |
| `Scroll` | `ScrollView` | Scrollable container |
| `Rect` | `Rectangle()` | Shape |
| `Circle` | `Circle()` | Circle shape |
| `Capsule` | `Capsule()` | Capsule shape |

## Container Arguments

| Arg | SwiftUI | Example |
|-----|---------|---------|
| `sp:12` | `spacing: 12` | Init parameter |
| `al:.leading` | `alignment: .leading` | Init parameter |
| `p:24` | `.padding(24)` | Becomes modifier |
| `px:16` | `.padding(.horizontal, 16)` | Becomes modifier |
| `py:16` | `.padding(.vertical, 16)` | Becomes modifier |
| `r:12` | `.clipShape(RoundedRectangle(cornerRadius: 12))` | Becomes modifier |

## Modifiers (dot-chained after element)

### Font Styles (no args)
`.largeTitle` `.title` `.title2` `.title3` `.headline` `.subheadline` `.body` `.callout` `.caption` `.caption2` `.footnote`

### Font Weights (no args)
`.bold` `.semibold` `.medium` `.light` `.heavy` `.thin` `.black` `.regular`

### Foreground Styles (no args)
`.secondary` `.tertiary` `.quaternary`

### Text
`.underline` `.italic` `.tracking(2)` `.lineLimit(2)` `.lineSpacing(4)` `.multiline(.center)`

### Layout
`.ignoresSafeArea` `.offset(x:10, y:-5)`

### With Arguments
| Modifier | SwiftUI | Example |
|----------|---------|---------|
| `.fg(.color)` | `.foregroundStyle(.color)` | `.fg(.blue)` `.fg(#FF6600)` `.fg(LG(.red,.blue,dir:.right))` |
| `.bg(.color)` | `.background(.color)` | `.bg(.red)` `.bg(#1A0A2E)` `.bg(LG(.purple,.black))` |
| `.f(size)` | `.font(.system(size:))` | `.f(24)` |
| `.font(.style)` | `.font(.style)` | `.font(.largeTitle)` |
| `.frame(w:,h:)` | `.frame(width:,height:)` | `.frame(w:100,h:50)` `.frame(maxW:.inf)` |
| `.opacity(val)` | `.opacity(val)` | `.opacity(0.3)` |
| `.p(val)` `.px` `.py` `.pt` `.pb` `.pl` `.pr` | `.padding(...)` | `.p(16)` `.px(8)` |
| `.r(val)` | `.clipShape(RoundedRectangle(...))` | `.r(12)` |
| `.shadow(.color, r:N, x:N, y:N)` | `.shadow(...)` | `.shadow(.black, r:4, x:0, y:2)` |

### Shapes & Borders
| Modifier | Example |
|----------|---------|
| `.stroke(.color)` | `Rect.stroke(.gray)` |
| `.stroke(.color, w:2)` | `Rect.stroke(.purple, w:2)` |
| `.border(.color)` | `.border(.gray)` (8pt radius default) |
| `.border(.color, r:12)` | `.border(.blue, r:12)` |
| `.border(.color, w:2, r:Capsule)` | Capsule-shaped border |
| `.clipShape(Capsule)` | `.clipShape(Circle)` |

### Overlay
```
Circle.fg(.blue).overlay { Img(sys:"plus").f(14).fg(.white) }
```

## Hex Colors

**Always include `#` prefix.** `#RRGGBB` or `#RRGGBBAA` format.
```
.fg(#FF6600) .bg(#1A0A2E) LG(#6B2FA0, #1A0A2E)
```
Generates `Color(hex: 0xRRGGBB)` — extension defined in Theme.swift.

## Gradients

`LG()` works as both an element AND inside `.fg()`/`.bg()` modifiers:
```
ZS { LG(#6B2FA0, #1A0A2E, dir:.down).ignoresSafeArea  T("Hello") }
T("Gradient Text").fg(LG(.purple, .orange, dir:.right))
```
Directions: `dir:.down` (default), `.up`, `.right`, `.left`

## Tab Bar (native iOS 26 — liquid glass)

```
Tab(tint:#520080, active:1) {
  Tab.item("Home", sys:"house") { /* active tab content */ }
  Tab.item("Menu", sys:"fork.knife")
  Tab.item("Rewards", sys:"star")
}
```
- `active:N` selects the Nth tab (0-indexed)
- `tint:` sets accent color
- Empty tabs get placeholder content automatically

## Segmented Control (native Picker)

```
Seg("Pickup", "Delivery", active:0)
```

## Text Concatenation (inline styled text)

```
TC { T("Agree to ") T("Terms").fg(.blue).underline T(" and ") T("Privacy").fg(.blue).underline }.caption
```
Child `T()` elements joined with `+` into one wrapping paragraph.

## Repetition

```
Img(sys:"star.fill")*5
["News","Sports","Fun"].map(V.badge)
```

## Colors

SwiftUI names: `.blue` `.red` `.green` `.orange` `.purple` `.pink` `.yellow` `.gray` `.white` `.black` `.primary` `.secondary` `.mint` `.teal` `.cyan` `.indigo` `.brown`

Color chaining: `.fg(.white.opacity(0.8))` `.bg(.gray.opacity(0.3))`

---

# Layout Patterns

### Colored header (safe area correct)
```
ZS {
  Rect.fg(#5A2D82).ignoresSafeArea
  VS(p:16) { /* header content stays in safe area */ }
}
```
**NEVER** use `.pt(60)` to push below notch. **NEVER** put `.ignoresSafeArea` on the content VS.

### Full-screen gradient background
```
ZS { LG(#6B2FA0, #1A0A2E).ignoresSafeArea  VS(p:32) { content } }
```

### Pill/capsule border
```
HS { content }.px(24).py(12).border(.white, w:2, r:Capsule)
```

### Icon with colored background
```
ZS { Circle.fg(.blue).frame(w:44,h:44) Img(sys:"plus").fg(.white) }
```

---

# Rules for the Design Agent

## Critical Rules
1. **One screen per .design file.** Each file produces one view.
2. **Bracket nesting only.** Every container with children uses `{ }`.
3. **Literal point values.** `p:24` means 24pt. No math, no scales, no multipliers.
4. **Only use documented modifiers.** Unknown modifiers cause parser errors.
5. **Modifier order matters.** `.padding().background()` ≠ `.background().padding()`.
6. **(MANDATORY) Use presets** over manual styling. Check the presets list before building anything by hand.
7. **(MANDATORY) Colored headers** use ZS + Rect.ignoresSafeArea pattern.
8. **(MANDATORY) Hex colors** always have `#` prefix.

## Do NOT
- Edit `ContentView.swift` manually — it is generated
- Edit `designApp.swift` or `project.pbxproj`
- Use state, bindings, `@State`, `@Binding`, or any logic — this is static UI only
- Use string interpolation or computed values in the DSL
- Add `import` statements — the parser adds `import SwiftUI` automatically
- Use indentation for nesting — always use `{ }`
- Use `.pt(60)` or similar hacks to avoid the Dynamic Island

## Extending the System
- **New presets** → add entry to `parser/presets.js` + Swift extension in `Theme.swift` (or struct in `Components.swift`)
- **New modifiers** → add to `KNOWN_MODIFIERS` set + `expandModifier()` in `generator.js`
- **New element types** → add to `TAG_MAP` in `generator.js` + handle in `generateLeaf()`/`generateContainer()`
- **Theme changes** → edit `design/Theme.swift` directly (agent-editable via tools)
- The parser is zero-dependency Node.js — keep it that way

## Preset Strategy Types (presets.js)
| Type | What it generates | Example |
|------|-------------------|---------|
| `struct` | Helper struct call | `CTAButton(label: "Go")` |
| `modifier` | Base view + modifier | `Button("Go", action: {}).btnText()` |
| `containerModifier` | Container + modifier | `VStack { ... }.card()` |
| `leafModifier` | View + modifier | `Text("Label").badge()` |
| `textField` | TextField/SecureField | `TextField("...", text: .constant(""))` |
| `floatingField` | FloatingTextField struct | `FloatingTextField(label: "Email", value: "")` |
| `searchBar` | SearchBar struct | `SearchBar(placeholder: "Search...", value: "query")` |
| `imagePlaceholder` | ImagePlaceholder struct | `ImagePlaceholder(height: 200, color: .orange)` |
| `tabItem` | Tab inside TabView | `Tab("Home", systemImage: "house", value: 0) { ... }` |

## Generator Internals (for extending)
- `expandModifier()` — the big switch for all modifier expansion (~200 lines)
- `generateContainer()` — handles VS/HS/ZS/Scroll with init params + container modifiers
- `generateTabView()` / `generateTabItem()` — native iOS 26 TabView generation
- `generateTextConcat()` — TC { } → Text + Text concatenation
- `generateLinearGradient()` — LG() expansion (works both as element and arg value)
- `generateSegmentedPicker()` — Seg() → Picker with .segmented style
- `generateSearchBar()` / `generateFloatingField()` / `generateImagePlaceholder()` — preset struct generation
- `argValueToSwift()` — handles string, number, hex, gradient, enum, ident, expr types
- Frame auto-promotion: when `maxW` or `maxH` present, `w`→`maxWidth`, `h`→`maxHeight`
- Border shape support: `r:Capsule` and `r:Circle` generate Capsule()/Circle() instead of RoundedRectangle
