// Preset definitions for component shorthands
// Each preset returns an object with:
//   - swiftView: the SwiftUI view constructor
//   - modifiers: array of SwiftUI modifier strings

function esc(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

const presets = {
  B: {
    cta(label) {
      return {
        swift: `Button(action: {}) {\n    Text("${esc(label)}")\n        .fontWeight(.semibold)\n        .frame(maxWidth: .infinity)\n}`,
        modifiers: [
          '.buttonStyle(.borderedProminent)',
          '.controlSize(.large)',
        ],
      };
    },
    sec(label) {
      return {
        swift: `Button(action: {}) {\n    Text("${esc(label)}")\n        .fontWeight(.medium)\n        .frame(maxWidth: .infinity)\n}`,
        modifiers: [
          '.buttonStyle(.bordered)',
          '.controlSize(.large)',
        ],
      };
    },
    text(label) {
      return {
        swift: `Button("${esc(label)}", action: {})`,
        modifiers: ['.buttonStyle(.plain)'],
      };
    },
    link(label) {
      return {
        swift: `Button("${esc(label)}", action: {})`,
        modifiers: ['.buttonStyle(.plain)', '.font(.caption)'],
      };
    },
    ghost(label) {
      return {
        swift: `Button("${esc(label)}", action: {})`,
        modifiers: ['.buttonStyle(.borderless)'],
      };
    },
  },

  V: {
    card(children) {
      return {
        isContainer: true,
        modifiers: [
          '.background(.regularMaterial)',
          '.clipShape(RoundedRectangle(cornerRadius: 12))',
        ],
      };
    },
    badge(label) {
      return {
        swift: `Text("${esc(label)}")`,
        modifiers: [
          '.font(.caption2)',
          '.fontWeight(.medium)',
          '.padding(.horizontal, 8)',
          '.padding(.vertical, 4)',
          '.background(.blue)',
          '.foregroundStyle(.white)',
          '.clipShape(Capsule())',
        ],
      };
    },
  },

  TF: {
    _default(placeholder) {
      return {
        swift: `TextField("${esc(placeholder)}", text: .constant(""))`,
        modifiers: ['.textFieldStyle(.roundedBorder)'],
      };
    },
    secure(placeholder) {
      return {
        swift: `SecureField("${esc(placeholder)}", text: .constant(""))`,
        modifiers: ['.textFieldStyle(.roundedBorder)'],
      };
    },
  },
};

module.exports = { presets };
