# Design DSL — SwiftUI Shorthand

## What This Project Is

An **Emmet/Tailwind-like shorthand DSL** that compiles to SwiftUI. Compact notation → full Swift code via a zero-dependency Node.js parser.

The goal: an agent writes shorthand instead of verbose SwiftUI, massively reducing output tokens without costing reasoning tokens (because the syntax mirrors familiar Emmet + Tailwind patterns).

**Static screenshots only** — no animations, state, or interactivity.

## How We Work (Self-Improvement Loop)

1. Pick a reference screenshot from `sample-images/`
2. Write `.design` DSL to recreate it
3. Parse → compile → build → screenshot
4. Compare output vs reference — identify what's missing or awkward
5. Improve: add modifiers, presets, or patterns to handle gaps
6. Repeat — the modifier/preset library grows organically with each screen

The DSL evolves by building real screens, not by speculating about what might be needed.

## Architecture

```
.design file (shorthand DSL)
        ↓
Parser (Node.js) → expands to .swift
        ↓
User builds in Xcode
        ↓
xcrun simctl screenshot → capture result
```

## File Structure

```
parser/
  index.js         — CLI entry point: node parser/index.js <input.design> [output.swift]
  tokenizer.js     — lexer (hex colors, strings, numbers, identifiers)
  parser.js        — recursive descent → AST
  generator.js     — AST → SwiftUI code
  presets.js       — preset registry (maps preset names to generation strategies)
  test.js          — snapshot tests

design/            — Xcode project
  ContentView.swift  — GENERATED (parser output goes here)
  Theme.swift        — ViewModifier extensions + Color(hex:) init
  Components.swift   — Helper view structs (CTAButton, SecButton, etc.)
  designApp.swift    — app entry point (do not touch)

sample-images/     — reference screenshots to recreate
```

## Pipeline Commands

```bash
# Parse .design → Swift
node parser/index.js <input.design> [output.swift]

# Token stats (DSL vs Swift compression)
node parser/stats.js <input.design>

# Screenshot (after user has built)
xcrun simctl io booted screenshot output.png
```

**IMPORTANT: Never build the Xcode project yourself.** After compiling DSL → Swift, ask the user to build in Xcode. Once they confirm the build succeeded, take the screenshot and review it.

---

# Two Ways to Style: Modifiers vs Presets

## Modifiers (the Tailwind classes)

Dot-chained properties that map 1:1 to SwiftUI modifiers. Pure parser expansion — no Swift-side code needed.

```
T("Hello").bold.f(24).fg(.blue).p(16)
→ Text("Hello").fontWeight(.bold).font(.system(size: 24)).foregroundStyle(.blue).padding(16)
```

To add a new modifier: add to `KNOWN_MODIFIERS` set + `expandModifier()` in `generator.js`.

## Presets (the component library)

Higher-level abstractions that expand into structs or ViewModifier calls. Need **both** a parser entry (presets.js) **and** Swift code (Theme.swift or Components.swift).

```
B.cta("Sign In")  →  CTAButton(label: "Sign In")     // struct in Components.swift
V.card { ... }     →  VStack { ... }.card()            // ViewModifier in Theme.swift
V.badge("Hot")     →  Text("Hot").badge()              // ViewModifier in Theme.swift
```

To add a new preset: add entry to `presets.js` + corresponding Swift in Theme.swift or Components.swift.

### Preset Strategy Types

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

---

# DSL Reference

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
| `Tab(tint:#520080, active:1) { Tab.item(...) }` | `TabView` | Native iOS 26 tab bar |
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

## Modifiers

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

## Gradients

`LG()` works as both an element AND inside `.fg()`/`.bg()` modifiers:
```
ZS { LG(#6B2FA0, #1A0A2E, dir:.down).ignoresSafeArea  T("Hello") }
T("Gradient Text").fg(LG(.purple, .orange, dir:.right))
```
Directions: `dir:.down` (default), `.up`, `.right`, `.left`

## Tab Bar (native iOS 26)

```
Tab(tint:#520080, active:1) {
  Tab.item("Home", sys:"house") { /* active tab content */ }
  Tab.item("Menu", sys:"fork.knife")
  Tab.item("Rewards", sys:"star")
}
```

## Segmented Control

```
Seg("Pickup", "Delivery", active:0)
```

## Text Concatenation

```
TC { T("Agree to ") T("Terms").fg(.blue).underline T(" and ") T("Privacy").fg(.blue).underline }.caption
```

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

# Rules

## Critical
1. **One screen per .design file.** Each file produces one view.
2. **Bracket nesting only.** Every container with children uses `{ }`.
3. **Literal point values.** `p:24` means 24pt. No math, no scales, no multipliers.
4. **Only use documented modifiers.** Unknown modifiers cause parser errors.
5. **Modifier order matters.** `.padding().background()` ≠ `.background().padding()`.
6. **Use presets** over manual styling when they exist.
7. **Colored headers** use ZS + Rect.ignoresSafeArea pattern.
8. **Hex colors** always have `#` prefix.

## Do NOT
- Edit `designApp.swift` or `project.pbxproj`
- Use state, bindings, `@State`, `@Binding`, or any logic — static UI only
- Use string interpolation or computed values
- Add `import` statements — the parser adds `import SwiftUI`
- Use `.pt(60)` or similar hacks to avoid the Dynamic Island

## Extending the System
- **New modifiers** → add to `KNOWN_MODIFIERS` set + `expandModifier()` in `generator.js`
- **New presets** → add entry to `parser/presets.js` + Swift in `Theme.swift` or `Components.swift`
- **New element types** → add to `TAG_MAP` in `generator.js` + handle in `generateLeaf()`/`generateContainer()`
- The parser is zero-dependency Node.js — keep it that way

## Generator Internals (for extending)
- `expandModifier()` — the big switch for all modifier expansion
- `generateContainer()` — handles VS/HS/ZS/Scroll with init params + container modifiers
- `generateTabView()` / `generateTabItem()` — native iOS 26 TabView generation
- `generateTextConcat()` — TC { } → Text + Text concatenation
- `generateLinearGradient()` — LG() expansion (works both as element and arg value)
- `generateSegmentedPicker()` — Seg() → Picker with .segmented style
- `argValueToSwift()` — handles string, number, hex, gradient, enum, ident, expr types
- Frame auto-promotion: when `maxW` or `maxH` present, `w`→`maxWidth`, `h`→`maxHeight`
- Border shape support: `r:Capsule` and `r:Circle` generate Capsule()/Circle() instead of RoundedRectangle
