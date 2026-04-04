const { presets } = require('./presets');

// Maps shorthand tag names to SwiftUI view names
const TAG_MAP = {
  VS: 'VStack',
  HS: 'HStack',
  ZS: 'ZStack',
  T: 'Text',
  B: 'Button',
  Img: 'Image',
  TF: 'TextField',
  SF: 'SecureField',
  Scroll: 'ScrollView',
  Spacer: 'Spacer',
  Div: 'Divider',
  List: 'List',
  Nav: 'NavigationStack',
  Tab: 'TabView',
};

// Modifiers that map to .font(.<name>)
const FONT_STYLES = new Set([
  'largeTitle', 'title', 'title2', 'title3',
  'headline', 'subheadline', 'body', 'callout',
  'caption', 'caption2', 'footnote',
]);

// Modifiers that map to .fontWeight(.<name>)
const FONT_WEIGHTS = new Set([
  'bold', 'semibold', 'medium', 'light', 'heavy',
  'thin', 'ultraLight', 'black', 'regular',
]);

// Modifiers that map to .foregroundStyle(.<name>)
const FOREGROUND_STYLES = new Set([
  'secondary', 'tertiary', 'quaternary',
]);

// Container props that become SwiftUI init parameters (not modifiers)
const INIT_PARAMS = new Set(['sp', 'al']);

// Container props that become SwiftUI modifiers on the container
const CONTAINER_MODIFIERS = new Set(['p', 'px', 'py', 'r']);

// Escape a string for use inside Swift double-quoted string literals
function escapeSwift(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

class Generator {
  constructor() {
    // Start at indent level 2 (inside struct > body)
    this.indent = 2;
  }

  generate(ast) {
    const body = this.generateElements(ast);
    return this.wrapInStruct(body);
  }

  wrapInStruct(body) {
    return `import SwiftUI

struct ContentView: View {
    var body: some View {
${body}
    }
}

#Preview {
    ContentView()
}
`;
  }

  pad() {
    return '    '.repeat(this.indent);
  }

  generateElements(elements) {
    return elements.map(el => this.generateElement(el)).join('\n');
  }

  generateElement(node) {
    if (node.type === 'map') {
      return this.generateMap(node);
    }

    const results = [];
    const single = this.generateSingleElement(node);

    for (let i = 0; i < node.repeat; i++) {
      results.push(single);
    }
    return results.join('\n');
  }

  generateSingleElement(node) {
    const { tag, preset, args, modifiers, children } = node;

    // Handle Spacer and Divider — no args, no children
    if (tag === 'Spacer') return `${this.pad()}Spacer()`;
    if (tag === 'Div') return `${this.pad()}Divider()`;

    // Handle presets via registry
    const presetDef = this.lookupPreset(tag, preset);
    if (presetDef) {
      return this.generateFromPreset(node, presetDef);
    }

    // Handle default TF (no preset) — uses _default entry
    if (tag === 'TF' && !preset) {
      const def = presets.TF && presets.TF._default;
      if (def) return this.generateTextField(node, def);
    }

    // Handle containers (have children)
    if (children.length > 0) {
      return this.generateContainer(node);
    }

    // Handle leaves
    return this.generateLeaf(node);
  }

  // Look up a preset in the registry
  lookupPreset(tag, preset) {
    if (!preset) return null;
    return presets[tag] && presets[tag][preset] || null;
  }

  // Dispatch to the right generation strategy based on preset type
  generateFromPreset(node, def) {
    switch (def.type) {
      case 'struct':
        return this.generateStructPreset(node, def);
      case 'modifier':
        return this.generateModifierPreset(node, def);
      case 'containerModifier':
        return this.generateContainerModifierPreset(node, def);
      case 'leafModifier':
        return this.generateLeafModifierPreset(node, def);
      case 'textField':
        return this.generateTextField(node, def);
      default:
        return this.generateLeaf(node);
    }
  }

  // struct preset: emit helper struct call — CTAButton(label: "Sign In")
  generateStructPreset(node, def) {
    const { modifiers } = node;
    const label = escapeSwift(this.getFirstStringArg(node.args));
    const lines = [];
    lines.push(`${this.pad()}${def.swift}(${def.argKey}: "${label}")`);
    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  // modifier preset: emit base view + .modifier() — Button("X", action: {}).btnText()
  generateModifierPreset(node, def) {
    const { tag, modifiers } = node;
    const lines = [];

    // Emit the base view (e.g. Button)
    if (tag === 'B') {
      const label = escapeSwift(this.getFirstStringArg(node.args));
      lines.push(`${this.pad()}Button("${label}", action: {})`);
    } else {
      // Fallback: generate as a regular leaf then append
      return this.generateLeaf(node);
    }

    // Append the preset modifier
    lines.push(`${this.pad()}.${def.swift}()`);

    // Append user modifiers
    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  // containerModifier preset: emit VStack { children }.card()
  generateContainerModifierPreset(node, def) {
    const { modifiers, children } = node;
    const lines = [];

    lines.push(`${this.pad()}VStack {`);
    this.indent++;
    lines.push(this.generateElements(children));
    this.indent--;
    lines.push(`${this.pad()}}`);

    // Append the preset modifier
    lines.push(`${this.pad()}.${def.swift}()`);

    // Append user modifiers
    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  // leafModifier preset: emit a different view + .modifier() — Text("X").badge()
  generateLeafModifierPreset(node, def) {
    const { modifiers } = node;
    const label = escapeSwift(this.getFirstStringArg(node.args));
    const lines = [];

    // Emit the view specified by the preset
    if (def.viewTag === 'Text') {
      lines.push(`${this.pad()}Text("${label}")`);
    } else {
      lines.push(`${this.pad()}${def.viewTag}("${label}")`);
    }

    // Append the preset modifier
    lines.push(`${this.pad()}.${def.swift}()`);

    // Append user modifiers
    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  // TextField/SecureField preset
  generateTextField(node, def) {
    const { modifiers } = node;
    const placeholder = escapeSwift(this.getFirstStringArg(node.args));
    const lines = [];

    lines.push(`${this.pad()}${def.view}("${placeholder}", text: .constant(""))`);
    lines.push(`${this.pad()}.textFieldStyle(.roundedBorder)`);

    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  generateContainer(node) {
    const { tag, args, modifiers, children } = node;
    const swiftTag = TAG_MAP[tag] || tag;

    // Separate init params from container modifiers
    const initParams = [];
    const containerMods = [];

    for (const arg of args) {
      if (arg.type === 'named') {
        if (INIT_PARAMS.has(arg.key)) {
          initParams.push(arg);
        } else if (CONTAINER_MODIFIERS.has(arg.key)) {
          containerMods.push(arg);
        }
      }
    }

    // Build the opening line
    let opening = swiftTag;
    const paramStrs = [];
    for (const p of initParams) {
      if (p.key === 'sp') {
        paramStrs.push(`spacing: ${this.argValueToSwift(p.value)}`);
      } else if (p.key === 'al') {
        paramStrs.push(`alignment: ${this.argValueToSwift(p.value)}`);
      }
    }
    if (paramStrs.length > 0) {
      opening += `(${paramStrs.join(', ')})`;
    }

    const lines = [];
    lines.push(`${this.pad()}${opening} {`);

    this.indent++;
    lines.push(this.generateElements(children));
    this.indent--;

    lines.push(`${this.pad()}}`);

    // Add container modifiers (padding, radius)
    for (const cm of containerMods) {
      lines.push(`${this.pad()}${this.expandContainerModifier(cm)}`);
    }

    // Add regular modifiers
    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }

    return lines.join('\n');
  }

  generateLeaf(node) {
    const { tag, args, modifiers } = node;
    const lines = [];

    if (tag === 'T') {
      const text = escapeSwift(this.getFirstStringArg(args));
      lines.push(`${this.pad()}Text("${text}")`);
    } else if (tag === 'Img') {
      const sysArg = args.find(a => a.type === 'named' && a.key === 'sys');
      if (sysArg) {
        lines.push(`${this.pad()}Image(systemName: "${escapeSwift(sysArg.value.value)}")`);
      } else {
        const name = escapeSwift(this.getFirstStringArg(args));
        lines.push(`${this.pad()}Image("${name}")`);
      }
    } else if (tag === 'B') {
      const label = escapeSwift(this.getFirstStringArg(args));
      lines.push(`${this.pad()}Button("${label}", action: {})`);
    } else if (tag === 'SF') {
      const placeholder = escapeSwift(this.getFirstStringArg(args));
      lines.push(`${this.pad()}SecureField("${placeholder}", text: .constant(""))`);
      lines.push(`${this.pad()}.textFieldStyle(.roundedBorder)`);
    } else {
      // Fallback: use tag map
      const swiftTag = TAG_MAP[tag] || tag;
      if (args.length > 0) {
        const argStr = args.map(a => this.argToSwift(a)).join(', ');
        lines.push(`${this.pad()}${swiftTag}(${argStr})`);
      } else {
        lines.push(`${this.pad()}${swiftTag}()`);
      }
    }

    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }

    return lines.join('\n');
  }

  generateMap(node) {
    const { items, tag, preset } = node;
    const lines = [];

    for (const item of items) {
      const fakeNode = {
        type: 'element',
        tag,
        preset,
        args: [{ type: 'string', value: String(item) }],
        modifiers: [],
        children: [],
        repeat: 1,
      };
      lines.push(this.generateSingleElement(fakeNode));
    }

    return lines.join('\n');
  }

  // Expand a modifier to SwiftUI
  expandModifier(mod) {
    const { name, args } = mod;

    // Font styles
    if (FONT_STYLES.has(name)) {
      return `.font(.${name})`;
    }

    // Font weights
    if (FONT_WEIGHTS.has(name)) {
      return `.fontWeight(.${name})`;
    }

    // Foreground styles
    if (FOREGROUND_STYLES.has(name)) {
      return `.foregroundStyle(.${name})`;
    }

    // Explicit modifiers with args
    if (name === 'fg' && args.length > 0) {
      return `.foregroundStyle(${this.argValueToSwift(args[0])})`;
    }
    if (name === 'bg' && args.length > 0) {
      return `.background(${this.argValueToSwift(args[0])})`;
    }
    if (name === 'f' && args.length > 0) {
      return `.font(.system(size: ${this.argValueToSwift(args[0])}))`;
    }
    if (name === 'font' && args.length > 0) {
      return `.font(${this.argValueToSwift(args[0])})`;
    }

    // Frame
    if (name === 'frame') {
      const parts = [];
      for (const a of args) {
        if (a.type === 'named') {
          const key = this.frameKeyMap(a.key);
          const val = this.argValueToSwift(a.value);
          parts.push(`${key}: ${val}`);
        }
      }
      return `.frame(${parts.join(', ')})`;
    }

    // Padding shorthand as modifier
    if (name === 'p' && args.length > 0) {
      return `.padding(${this.argValueToSwift(args[0])})`;
    }
    if (name === 'px' && args.length > 0) {
      return `.padding(.horizontal, ${this.argValueToSwift(args[0])})`;
    }
    if (name === 'py' && args.length > 0) {
      return `.padding(.vertical, ${this.argValueToSwift(args[0])})`;
    }

    // Corner radius
    if (name === 'r' && args.length > 0) {
      return `.clipShape(RoundedRectangle(cornerRadius: ${this.argValueToSwift(args[0])}))`;
    }

    // Multiline text alignment
    if (name === 'multiline' && args.length > 0) {
      return `.multilineTextAlignment(${this.argValueToSwift(args[0])})`;
    }

    // Opacity
    if (name === 'opacity' && args.length > 0) {
      return `.opacity(${this.argValueToSwift(args[0])})`;
    }

    // Generic — pass through as-is
    if (args.length > 0) {
      const argStr = args.map(a => this.argToSwift(a)).join(', ');
      return `.${name}(${argStr})`;
    }

    // No-arg modifier
    return `.${name}()`;
  }

  expandContainerModifier(arg) {
    const { key, value } = arg;
    const val = this.argValueToSwift(value);

    if (key === 'p') return `.padding(${val})`;
    if (key === 'px') return `.padding(.horizontal, ${val})`;
    if (key === 'py') return `.padding(.vertical, ${val})`;
    if (key === 'r') return `.clipShape(RoundedRectangle(cornerRadius: ${val}))`;
    return '';
  }

  frameKeyMap(key) {
    const map = {
      w: 'width',
      h: 'height',
      minW: 'minWidth',
      maxW: 'maxWidth',
      minH: 'minHeight',
      maxH: 'maxHeight',
    };
    return map[key] || key;
  }

  argToSwift(arg) {
    if (arg.type === 'named') {
      return `${arg.key}: ${this.argValueToSwift(arg.value)}`;
    }
    return this.argValueToSwift(arg);
  }

  argValueToSwift(val) {
    if (!val) return '';
    if (val.type === 'string') return `"${escapeSwift(val.value)}"`;
    if (val.type === 'number') return String(val.value);
    if (val.type === 'enum') {
      if (val.value === '.inf') return '.infinity';
      return val.value;
    }
    if (val.type === 'ident') return val.value;
    return String(val.value || '');
  }

  getFirstStringArg(args) {
    for (const a of args) {
      if (a.type === 'string') return a.value;
      if (a.type === 'named' && a.value.type === 'string') return a.value.value;
    }
    return '';
  }
}

module.exports = { Generator };
