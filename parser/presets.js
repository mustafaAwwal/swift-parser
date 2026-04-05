// Thin preset registry — maps (tag, preset) to a generation strategy.
// Actual styling lives in Swift (Theme.swift / Components.swift).
//
// Strategy types:
//   struct          — emit a helper struct: CTAButton(label: "...")
//   modifier        — emit base view + .modName(): Button("...", action: {}).btnText()
//   containerModifier — emit container + .modName(): VStack { ... }.card()
//   leafModifier    — emit a different view + .modName(): Text("...").badge()
//   textField       — emit TextField/SecureField with .textFieldStyle

const presets = {
  B: {
    cta:   { type: 'struct', swift: 'CTAButton', argKey: 'label' },
    sec:   { type: 'struct', swift: 'SecButton', argKey: 'label' },
    text:  { type: 'modifier', swift: 'btnText' },
    link:  { type: 'modifier', swift: 'btnLink' },
    ghost: { type: 'modifier', swift: 'btnGhost' },
  },
  V: {
    card:      { type: 'containerModifier', swift: 'card' },
    cardTitle: { type: 'containerModifier', swift: 'cardTitle' },
    cardBody:  { type: 'containerModifier', swift: 'cardBody' },
    badge:     { type: 'leafModifier', swift: 'badge', viewTag: 'Text' },
  },
  Img: {
    placeholder: { type: 'imagePlaceholder' },
  },
  TF: {
    _default:    { type: 'textField', view: 'TextField' },
    secure:      { type: 'textField', view: 'SecureField' },
    search:      { type: 'searchBar' },
    float:       { type: 'floatingField', swift: 'FloatingTextField' },
    floatSecure: { type: 'floatingField', swift: 'FloatingSecureField' },
  },
  Tab: {
    item: { type: 'tabItem' },
  },
};

module.exports = { presets };
