# Design DSL — SwiftUI Shorthand Parser

## What This Project Is

A **shorthand DSL and JS parser** that converts compact notation into full SwiftUI code. It dramatically reduces token output from a design agent (Claude via Agent SDK) so screen generation drops from ~5 minutes to under a minute.

**The user never sees code** — they only see the final screenshot. This is image generation to them.

## Architecture

```
Design Agent (Claude) → writes .design shorthand
        ↓
Parser (Node.js) → expands to design/ContentView.swift
        ↓
xcodebuild → compiles Xcode project on iOS Simulator
        ↓
simctl screenshot → returned to user
```

## Pipeline Commands

```bash
# Parse .design → Swift
node parser/index.js <input.design> [output.swift]
# Default output: design/ContentView.swift

# Build
xcodebuild -project design.xcodeproj -scheme design -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build

# Install + launch + screenshot
xcrun simctl terminate "iPhone 17 Pro" com.awwal.design || true
xcrun simctl install "iPhone 17 Pro" <path-to-derived-data>/design.app
xcrun simctl launch "iPhone 17 Pro" com.awwal.design
sleep 2
xcrun simctl io "iPhone 17 Pro" screenshot output.png
```

## File Structure

```
parser/
  index.js         — entry point (CLI + importable via require)
  tokenizer.js     — tokenizes .design files
  parser.js        — recursive descent parser → AST
  generator.js     — AST → SwiftUI code (thin — delegates styling to Swift)
  presets.js       — preset registry (maps preset names to generation strategies)
examples/          — example .design files
design/            — Xcode project
  ContentView.swift  — GENERATED FILE (parser output, never edit manually)
  Theme.swift        — ViewModifier extensions (btnText, btnLink, badge, card, etc.)
  Components.swift   — Helper view structs (CTAButton, SecButton)
  designApp.swift    — app entry point (do not touch)
```

## v2 Architecture: Swift-Side Styling

Styling responsibility lives in **Swift ViewModifiers**, not in the JS parser:

- **`Theme.swift`** — ViewModifier extensions (`.btnText()`, `.btnLink()`, `.btnGhost()`, `.badge()`, `.card()`, `.cardTitle()`, `.cardBody()`)
- **`Components.swift`** — Helper structs for buttons that need inner-label styling (`CTAButton`, `SecButton`)
- **`presets.js`** — Thin registry mapping preset names to strategies (`struct`, `modifier`, `containerModifier`, `leafModifier`, `textField`)

**To add a new preset:**
1. Add one entry to `presets.js` (e.g., `outline: { type: 'modifier', swift: 'btnOutline' }`)
2. Add the Swift extension to `Theme.swift` (or a helper struct to `Components.swift`)
3. Done — the Swift compiler validates it, Xcode previews work

**To customize theme/components:** Edit `Theme.swift` or `Components.swift` directly. These are real Swift files the agent can read and modify.

---

# DSL Rules & Reference

## Nesting: Brackets, Not Indentation

All nesting uses `{ }`. Indentation is cosmetic only.

```
VS(sp:12) {
  T("Hello")
  HS(sp:4) {
    Img(sys:"star.fill")
    T("4.8")
  }
}
```

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
| `B.cta("Label")` | Button | Prominent, full-width, large |
| `B.sec("Label")` | Button | Bordered, full-width, large |
| `B.text("Label")` | Button | Plain style |
| `B.link("Label")` | Button | Plain + caption font |
| `B.ghost("Label")` | Button | Borderless |
| `V.card { }` | VStack | Material bg, rounded corners |
| `V.cardTitle { }` | VStack | Headline font for card titles |
| `V.cardBody { }` | VStack | Body font, secondary color |
| `V.badge("Label")` | Text | Capsule, colored background |
| `Spacer` | `Spacer()` | Flex space |
| `Div` | `Divider()` | Horizontal line |
| `Scroll` | `ScrollView` | Scrollable container |
| `SF("placeholder")` | `SecureField` | Alt secure field syntax |
| `Rect` | `Rectangle()` | Shape (image placeholder, bg) |
| `Circle` | `Circle()` | Circle shape |
| `Capsule` | `Capsule()` | Capsule shape |

## Container Arguments

Arguments in `()` on containers. Named with `:`.

| Arg | SwiftUI | Example |
|-----|---------|---------|
| `sp:12` | `spacing: 12` | Init parameter |
| `al:.leading` | `alignment: .leading` | Init parameter |
| `p:24` | `.padding(24)` | Becomes modifier |
| `px:16` | `.padding(.horizontal, 16)` | Becomes modifier |
| `py:16` | `.padding(.vertical, 16)` | Becomes modifier |
| `r:12` | `.clipShape(RoundedRectangle(cornerRadius: 12))` | Becomes modifier |

**All spacing/padding values are literal points.** `p:16` = 16pt. No multipliers, no mapping. The number IS the value.

## Modifiers (dot-chained after element)

### Font Styles (SwiftUI names, no args)
`.largeTitle` `.title` `.title2` `.title3` `.headline` `.subheadline` `.body` `.callout` `.caption` `.caption2` `.footnote`

### Font Weights (no args)
`.bold` `.semibold` `.medium` `.light` `.heavy` `.thin` `.black` `.regular`

### Foreground Styles (no args)
`.secondary` `.tertiary` `.quaternary`

### Text Decoration (no args)
`.underline` `.italic`

### Layout (no args)
`.ignoresSafeArea`

### With Arguments
| Modifier | SwiftUI | Example |
|----------|---------|---------|
| `.fg(.color)` | `.foregroundStyle(.color)` | `.fg(.blue)` |
| `.bg(.color)` | `.background(.color)` | `.bg(.red)` |
| `.f(size)` | `.font(.system(size:))` | `.f(24)` |
| `.font(.style)` | `.font(.style)` | `.font(.largeTitle)` |
| `.tracking(val)` | `.tracking(val)` | `.tracking(2)` |
| `.frame(w:,h:)` | `.frame(width:,height:)` | `.frame(w:100,h:50)` |
| `.frame(maxW:.inf)` | `.frame(maxWidth:.infinity)` | |
| `.opacity(val)` | `.opacity(val)` | `.opacity(0.3)` |
| `.multiline(.center)` | `.multilineTextAlignment(.center)` | |
| `.p(val)` | `.padding(val)` | `.p(16)` |
| `.px(val)` | `.padding(.horizontal,val)` | `.px(8)` |
| `.py(val)` | `.padding(.vertical,val)` | `.py(8)` |
| `.pt(val)` | `.padding(.top,val)` | `.pt(8)` |
| `.pb(val)` | `.padding(.bottom,val)` | `.pb(8)` |
| `.pl(val)` | `.padding(.leading,val)` | `.pl(8)` |
| `.pr(val)` | `.padding(.trailing,val)` | `.pr(8)` |
| `.r(val)` | `.clipShape(RoundedRectangle(...))` | `.r(12)` |
| `.offset(x:,y:)` | `.offset(x:,y:)` | `.offset(x:10, y:-5)` |

### Shapes & Borders
| Modifier | What it does | Example |
|----------|-------------|---------|
| `.stroke(.color)` | Shape outline | `Rect.stroke(.gray)` |
| `.stroke(.color, w:2)` | Shape outline with width | `Rect.stroke(.purple, w:2)` |
| `.border(.color)` | Container border (8pt radius) | `.border(.gray)` |
| `.border(.color, r:12)` | Border with custom radius | `.border(.blue, r:12)` |
| `.border(.color, w:2, r:12)` | Border with width + radius | `.border(.gray, w:2, r:12)` |
| `.clipShape(Capsule)` | Clip to capsule | `.clipShape(Capsule)` |
| `.clipShape(Circle)` | Clip to circle | `.clipShape(Circle)` |

### Overlay (layer DSL content on top)
```
Circle.fg(.blue).overlay { Img(sys:"plus").f(14).fg(.white) }
```
Use `{ }` braces — DSL elements inside get parsed and expanded.

### Color chaining
Colors support method chaining: `.fg(.white.opacity(0.8))`, `.bg(.gray.opacity(0.3))`

### No passthrough
**Only use modifiers listed above.** Unknown modifiers will cause parser errors. If you need something not listed, add it to the generator.

## Repetition

```
Img(sys:"star.fill")*5           // 5 identical elements
["News","Sports","Fun"].map(V.badge)  // 3 badges with different labels
```

## Colors

**Use SwiftUI color names directly.** No aliases, no mapping.
`.blue` `.red` `.green` `.orange` `.purple` `.pink` `.yellow` `.gray` `.white` `.black` `.primary` `.secondary` `.mint` `.teal` `.cyan` `.indigo` `.brown`

## Comments

```
// This is a comment (single-line only)
```

---

# Rules for the Design Agent

## String Safety
- The parser auto-escapes quotes, backslashes, and newlines in strings for Swift output.
- You can safely use apostrophes and special characters: `T("It's 5'10\"")` works.
- Avoid unnecessary complexity in strings — keep text simple and readable.

## DSL Writing Rules
1. **One screen per .design file.** Each file produces one ContentView.
2. **Bracket nesting only.** Every container with children uses `{ }`.
3. **Literal point values.** `p:24` means 24pt. No math, no scales, no multipliers.
4. **Use SwiftUI's own names** for fonts, colors, weights. Don't invent abbreviations the parser doesn't know.
5. **Modifier order matters.** `.padding().background()` ≠ `.background().padding()` — same in the DSL.
6. **Prefer presets** over manual styling. `B.cta("Go")` over building a button from scratch.

## Layout Patterns (Proven)

### Hero with layered circles
```
ZS {
  Img(sys:"circle.fill").f(200).fg(.green).opacity(0.12)
  Img(sys:"circle.fill").f(150).fg(.green).opacity(0.2)
  Img(sys:"circle.fill").f(90).fg(.green).opacity(0.4)
  Img(sys:"flame.fill").f(44).fg(.white)
}
```

### Page indicator dots
```
HS(sp:6) {
  Img(sys:"circle.fill").f(8).fg(.blue)           // active
  Img(sys:"circle.fill").f(8).fg(.gray).opacity(0.3)  // inactive
}
```

### Form field with label
```
VS(sp:6) {
  T("Label").bold.caption
  TF("Placeholder")
}
```

### Two-tone headline
```
VS(sp:8) {
  T("Track Your").bold.font(.largeTitle)
  T("Calories").bold.font(.largeTitle).fg(.green)
}
```

### Full-screen onboarding layout
```
VS(p:32, sp:0) {
  Spacer
  // hero content
  Spacer
  // text content
  Spacer
  // CTA + page dots
}
```

## Do NOT
- Edit `ContentView.swift` manually — it is generated
- Edit `designApp.swift` or `project.pbxproj`
- Use state, bindings, `@State`, `@Binding`, or any logic — this is static UI only
- Use string interpolation or computed values in the DSL
- Add `import` statements — the parser adds `import SwiftUI` automatically
- Use indentation for nesting — always use `{ }`

## Extending the System
- **New presets** → add one line to `parser/presets.js` + one Swift extension in `design/Theme.swift` (or struct in `Components.swift`)
- **New modifiers** → add to `parser/generator.js` (check `expandModifier()`)
- **New element types** → add to `TAG_MAP` in `generator.js` and handle in `generateLeaf()`/`generateContainer()`
- **Theme changes** → edit `design/Theme.swift` directly (agent-editable)
- The parser is zero-dependency Node.js — keep it that way

### Component Patterns (Emmet/Tailwind-style)
Cards support sub-component presets for structured layouts:
```
V.card {
  V.cardTitle { T("Section Title") }
  V.cardBody { T("Body content here") }
}
```
