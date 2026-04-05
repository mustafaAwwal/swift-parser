// Preset registry — maps (tag, preset) to generation strategies.
// Architecture: presets emit base view + Swift modifier call.
// Modifier styling lives in Theme.swift as ViewModifier extensions.
// Generator validates and emits — Swift compiler does the rest.
//
// Strategy types:
//   modifier          — base view + .modName(): Button("Go", action: {}).cta()
//   containerModifier — container + .modName(): VStack { ... }.card()
//   leafModifier      — different base view + .modName(): Text("Label").badge()
//   textField         — TextField/SecureField + .textFieldStyle
//   tabItem           — Tab("...", systemImage:) — special container

const presets = {
  B: {
    cta:   { type: 'modifier', swift: 'cta' },
    sec:   { type: 'modifier', swift: 'sec' },
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
  TF: {
    _default: { type: 'textField', view: 'TextField' },
    secure:   { type: 'textField', view: 'SecureField' },
    search:   { type: 'searchInline' },
    float:    { type: 'floatInline', secure: false },
    floatSecure: { type: 'floatInline', secure: true },
  },
  Img: {
    placeholder: { type: 'placeholderInline' },
  },
  ProgressView: {
    circular: { type: 'progressCircular' },
  },
  Tab: {
    item: { type: 'tabItem' },
  },
};

module.exports = { presets };
