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

**After every screen**, identify what slowed you down or what you worked around. Don't just use what's available — propose what's missing. If you manually composed something that a modifier or element could handle, say so and add it. The DSL should get better with every screen built.

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
  BarChart.swift     — BarChart component (data visualization)
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

## Components (data-driven views)

For views with **logic** (loops, computed values, conditional rendering), use a Swift component file. The parser passes args through — the component handles the logic. Use sparingly, only when the alternative wastes reasoning tokens.

Current components: `BarChart.swift`

To add: create the Swift struct + add tag to `TAG_MAP` + add `generateXxx()` in generator that passes args.

## Presets (grouped modifiers)

Tailwind-style grouped styles. Presets emit a base SwiftUI view + a ViewModifier call defined in Theme.swift. The agent sees a familiar view + modifier chain — no custom structs to look up.

```
B.cta("Sign In")  →  Button("Sign In", action: {}).cta()
V.card { ... }     →  VStack { ... }.card()
V.badge("Hot")     →  Text("Hot").badge()
```

To add a new preset: add entry to `presets.js` + ViewModifier extension in `Theme.swift`.

### Preset Strategy Types

| Type | What it generates | Example |
|------|-------------------|---------|
| `modifier` | Base view + modifier | `Button("Go", action: {}).cta()` |
| `containerModifier` | Container + modifier | `VStack { ... }.card()` |
| `leafModifier` | View + modifier | `Text("Label").badge()` |
| `textField` | TextField/SecureField | `TextField("...", text: .constant(""))` |
| `floatInline` | Composed floating label | `TF.float("Email", "value")` |
| `searchInline` | Composed search bar | `TF.search("Search...")` |
| `placeholderInline` | Composed placeholder | `Img.placeholder(h:200, color:.orange)` |
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
| `B.cta("Label")` | `Button.cta()` | Prominent, full-width, large |
| `B.sec("Label")` | `Button.sec()` | Bordered, full-width, large |
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
| `LG(.purple, .black, dir:.down)` | `LinearGradient` | Gradient (element or value), 2+ color stops |
| `Circle.ring(0.84, #E5625E, w:6)` | `.ring()` modifier | Progress arc (ViewModifier in Theme.swift) |
| `Circle.ringTrack(#E5625E, w:6)` | `.ringTrack()` modifier | Ring background track |
| `Grid(cols:3, sp:8) { ... }` | `LazyVGrid` | Grid layout with flexible columns |
| `Label(sys:"heart", "Likes")` | `Label` | Native icon + text pair |
| `Toggle("Dark Mode", on:true)` | `Toggle` | Native switch (constant binding) |
| `DatePicker("Birthday")` | `DatePicker` | Native date picker (constant binding) |
| `Slider(val:0.6, min:0, max:1)` | `Slider` | Native slider (constant binding) |
| `Stepper("Qty", val:3, min:1, max:10)` | `Stepper` | Native stepper (constant binding) |
| `ProgressView(0.75)` | `ProgressView` | Linear progress bar |
| `ProgressView.circular(0.5)` | `ProgressView` | Circular progress indicator |
| `Menu("Actions", sys:"ellipsis") { B("Edit") }` | `Menu` | Native dropdown menu |
| `Bar(60, 85, 110, color:#E5625E, labels:"M,T,W")` | `BarChart` | Bar chart (component in BarChart.swift) |
| `Spacer` | `Spacer()` | Flex space |
| `Div` | `Divider()` | Horizontal line |
| `Scroll` | `ScrollView` | Vertical scroll (default) |
| `Scroll(.horizontal)` | `ScrollView(.horizontal)` | Horizontal scroll, hides indicators |
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
| `.aspectRatio(N)` | `.aspectRatio(N, contentMode: .fit)` | `.aspectRatio(1)` for square |
| `.ico(#color, size:N)` | `.ico()` ViewModifier | Colored circle behind icon (Theme.swift) |
| `.blur(N)` | `.blur(radius: N)` | `.blur(3)` |
| `.scaleEffect(N)` | `.scaleEffect(N)` | `.scaleEffect(1.2)` |
| `.tint(.color)` | `.tint(.color)` | `.tint(#4ECDC4)` — colors Slider, Toggle, ProgressView |

### Shapes & Borders
| Modifier | Example |
|----------|---------|
| `.stroke(.color)` | `Rect.stroke(.gray)` |
| `.stroke(.color, w:2)` | `Rect.stroke(.purple, w:2)` |
| `.stroke(.color, w:2, cap:.round)` | Stroke with line cap style |
| `.trim(from:0, to:0.84)` | Trim shape to range |
| `.rotate(-90)` | `.rotationEffect(.degrees(-90))` |
| `.ring(0.84, .blue, w:6)` | Progress arc (trim+stroke+rotate) |
| `.ringTrack(.blue, w:6)` | Ring background track (20% opacity stroke) |
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

**Opacity on hex colors:** Both formats work:
- Chaining: `#FF6B35.opacity(0.2)` → `Color(hex: 0xFF6B35).opacity(0.2)`
- Inline alpha: `#FF6B3533` → `Color(hex: 0xFF6B3533)` (alpha baked into hex)

## Gradients

`LG()` works as both an element AND inside `.fg()`/`.bg()` modifiers. Supports **2+ color stops**.
```
LG(#6B2FA0, #1A0A2E, dir:.down)                    // 2 stops
LG(#6B2FA0, #2D1B69, #0F4C3A, dir:.down)           // 3 stops
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

## Progress Ring

Composed from Circle + modifiers. `.ring()` and `.ringTrack()` are ViewModifier extensions in Theme.swift.
```
ZS {
  Circle.ringTrack(#E5625E, w:6).frame(w:140,h:140)         // background track
  Circle.ring(0.84, #E5625E, w:6).frame(w:140,h:140)        // fill arc (84%)
}
```
`.ring(value, color, w:N)` — trims, strokes with round cap, rotates to start from top
`.ringTrack(color, w:N)` — strokes at 20% opacity

For full control, use primitives directly: `.trim(from:0, to:0.84).stroke(color, w:6, cap:.round).rotate(-90)`

## Grid Layout

Grid with flexible equal-width columns. Uses `LazyVGrid` under the hood.
```
Grid(cols:2, sp:12) {
  T("A") T("B")
  T("C") T("D")
}
Grid(cols:3, sp:8, px:16) {    // with container modifiers
  VS { ... } VS { ... } VS { ... }
}
```
Args: `cols` (number of columns), `sp` (spacing). Supports container modifiers (`p`, `px`, `py`, `r`).

## Native Form Controls

All use `.constant()` bindings for static screenshots — no state needed.

```
Label(sys:"heart.fill", "Favorites")           // icon + text pair
Toggle("Notifications", on:true)                // switch ON
Toggle("Dark Mode", on:false)                   // switch OFF
DatePicker("Date of Birth")                     // date only (default)
DatePicker("Date", style:.compact)              // compact style
DatePicker("Time", components:.hourAndMinute)   // time only
Slider(val:0.6, min:0, max:1)                   // slider at 60%
Slider(val:50, min:0, max:100).tint(#4ECDC4)   // colored track
Stepper("Guests", val:3, min:1, max:10)         // stepper at 3
ProgressView(0.75)                              // 75% linear bar
ProgressView.circular(0.5)                      // 50% circular
```

## Menu

Native dropdown with button items. Children become `Button` entries, `Div` becomes `Divider`.
```
Menu("Options", sys:"ellipsis.circle") {
  B("Edit", sys:"pencil")
  B("Share", sys:"square.and.arrow.up")
  Div
  B("Delete", sys:"trash")
}
```

## Bar Chart

Data visualization component. Logic lives in `BarChart.swift` — the parser just passes args through.
```
Bar(60, 85, 110, 75, 95, 120, 80, color:#E5625E, labels:"M,T,W,T,F,S,S", h:120, active:6)
```
Args:
- Positional numbers = data values (auto-scaled to max)
- `color` = bar color (opacity auto-calculated from value ratio)
- `labels` = comma-separated labels below each bar
- `h` = max bar height in points (default 120)
- `active` = highlighted bar index (0-based, bold label + full opacity)

## Icon Circle Modifier

`.ico(color, size:N)` wraps any view (typically `Img`) in a colored circle background. ViewModifier in Theme.swift.
```
Img(sys:"car.fill").ico(#4ECDC4, size:40)       // 40pt teal circle
Img(sys:"heart.fill").ico(#E5625E, size:32)     // 32pt red circle
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

### Pixel-precise grid (game boards, tile layouts)
`Grid(cols:N)` uses `LazyVGrid` which does NOT fill vertical space — cells collapse. For fixed grids, use `VS(sp:0)` of `HS(sp:0)` rows with explicit `frame(w:N,h:N)`:
```
VS(sp:0) {
  HS(sp:0) { Rect.fg(#161633).frame(w:28,h:28).border(#0D0D24, w:1)*10 }
  HS(sp:0) { Rect.fg(#161633).frame(w:28,h:28).border(#0D0D24, w:1)*10 }
}
```
Use `*N` to fill empty rows, then edit specific cells for content. Beveled block effect: use `.border(darkerHue, w:1)`.

### Horizontal carousel
Use `Scroll(.horizontal)` with fixed-width items. **Never** put an `HS` with fixed-width children inside a vertical `Scroll` — it will overflow horizontally.
```
Scroll(.horizontal) {
  HS(sp:12, al:.top) {
    VS(sp:8) { Rect.fg(.gray).frame(w:140,h:140).r(8) T("Title").lineLimit(1) }.frame(w:140)
    VS(sp:8) { Rect.fg(.gray).frame(w:140,h:140).r(8) T("Title").lineLimit(1) }.frame(w:140)
  }
}
```

### Carousel alignment rules
Cards in horizontal carousels misalign when text wraps differently per card.
- **Always use `al:.top`** on the `HS` container so cards anchor to the top, not center
- **Always use `.lineLimit(1)` or `.lineLimit(2)`** on titles and descriptions to force consistent height
- **Always use `.frame(w:N)`** on each card to constrain width

Without these, a card with a 2-line title pushes all other cards down to center-align.

### Stepper with visible count
`Stepper` hides its value by default. Use an empty label + manual count display:
```
HS { T("Adults").subheadline Spacer T("2").bold Stepper("", val:2, min:1, max:9).frame(w:100) }
```

### Colored header inside TabView
**DO NOT** use `ZS { Rect.ignoresSafeArea }` for headers inside a Tab — the ZStack expands to fill available space, pushing content down. Instead, use a plain `HS` with no background expansion:
```
// BAD — header takes half the screen
ZS { Rect.fg(#1A1A2E).ignoresSafeArea  HS(px:20) { content } }

// GOOD — header sizes to content
HS(px:20, py:12) { content }
```
The `ZS + Rect.ignoresSafeArea` pattern is ONLY for full-screen backgrounds or standalone screens, NOT inside Tab content.

---

# Contrast & Readability

## Light backgrounds
- **Primary text**: use `.primary` or no color (system default) — never `.fg(.gray)`
- **Secondary text**: use `.secondary` or `.fg(.secondary)` — system-managed, adapts to dark mode
- **Card backgrounds**: use `#F5F5F7` or `.bg(.gray.opacity(0.12))` — NOT `.bg(.white.opacity(0.06))` which is invisible on white
- **Placeholder images**: use `#E8E8ED` bg with `#C7C7CC` icon — enough contrast to read as a placeholder
- **Metadata** (view counts, timestamps): `.caption.bold.fg(.secondary)` — bold at small sizes helps readability

## Dark backgrounds
- **Primary text**: `.fg(.white)` — full white for headlines and key numbers
- **Secondary text**: `.fg(.white.opacity(0.5))` minimum — anything below 0.4 is unreadable
- **Card backgrounds**: `.bg(.white.opacity(0.06))` works on dark — gives subtle lift
- **Avoid** `.fg(.white.opacity(0.3))` for anything the user needs to read

## General rules
- **Bold small text** (`.caption.bold`) reads better than regular weight at caption size
- **Colored text on white bg**: ensure the color is dark enough — `#4ECDC4` works, `#FFD700` on white does not
- **Badge text**: always white (`.fg(.white)`) on colored backgrounds
- **Test both themes**: `.primary`, `.secondary` adapt automatically — hardcoded colors don't

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
- **New presets** → add entry to `parser/presets.js` + ViewModifier extension in `Theme.swift`
- **New element types** → add to `TAG_MAP` in `generator.js` + handle in `generateLeaf()`/`generateContainer()`
- **New components** → create Swift struct file + add tag to `TAG_MAP` + add `generateXxx()` that passes args through. Use only when the view has **logic** (loops, computed values) that would waste reasoning tokens.
- The parser is zero-dependency Node.js — keep it that way

## Generator Internals (for extending)
- `expandModifier()` — the big switch for all modifier expansion
- `generateContainer()` — handles VS/HS/ZS/Scroll (with horizontal direction support) + init params + container modifiers
- `generateTabView()` / `generateTabItem()` — native iOS 26 TabView generation
- `generateTextConcat()` — TC { } → Text + Text concatenation
- `generateGrid()` — Grid(cols:N) → LazyVGrid with N flexible GridItems
- `generateMenu()` — Menu with Button children + Divider support
- `generateBarChart()` — Bar() → BarChart struct passthrough
- `generateProgressCircular()` — ProgressView.circular → ProgressView + .circular style
- `generateSearchInline()` — TF.search() → inline HStack composition
- `generateFloatInline()` — TF.float() → inline ZStack composition
- `generatePlaceholderInline()` — Img.placeholder() → inline ZStack composition
- `generateLinearGradient()` — LG() expansion (works both as element and arg value)
- `generateSegmentedPicker()` — Seg() → Picker with .segmented style
- `argValueToSwift()` — handles string, number, hex, hexExpr, gradient, enum, ident, expr types
- Frame auto-promotion: when `maxW` or `maxH` present, `w`→`maxWidth`, `h`→`maxHeight`
- Border shape support: `r:Capsule` and `r:Circle` generate Capsule()/Circle() instead of RoundedRectangle
