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
  Rect: 'Rectangle',
  Circle: 'Circle',
  Capsule: 'Capsule',
  Color: 'Color',
  LG: 'LinearGradient',
  TC: 'TextConcat',
  Seg: 'Picker',
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

// All known modifier names — anything not here is an error
const KNOWN_MODIFIERS = new Set([
  // Shorthands with args
  'fg', 'bg', 'f', 'font', 'frame', 'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
  'r', 'opacity', 'multiline', 'multilineTextAlignment', 'offset', 'border', 'stroke', 'clipShape',
  'tracking',
  // Block modifiers
  'overlay',
  // With args (misc)
  'lineLimit', 'shadow', 'lineSpacing',
  // No-arg (handled by FONT_STYLES, FONT_WEIGHTS, FOREGROUND_STYLES, or below)
  'underline', 'italic', 'ignoresSafeArea',
  // Also accept these font/weight/foreground sets
  ...FONT_STYLES, ...FONT_WEIGHTS, ...FOREGROUND_STYLES,
]);

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

  generate(ast, viewName = 'ContentView') {
    const body = this.generateElements(ast);
    return this.wrapInStruct(body, viewName);
  }

  wrapInStruct(body, viewName = 'ContentView') {
    return `import SwiftUI

struct ${viewName}: View {
    var body: some View {
${body}
    }
}

#Preview {
    ${viewName}()
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

    // Handle simple elements — no args, no children
    if (tag === 'Spacer') return `${this.pad()}Spacer()`;
    if (tag === 'Div') return `${this.pad()}Divider()`;

    // Shapes with no required args
    if ((tag === 'Rect' || tag === 'Circle' || tag === 'Capsule') && args.length === 0 && children.length === 0) {
      const swiftTag = TAG_MAP[tag] || tag;
      const lines = [`${this.pad()}${swiftTag}()`];
      for (const mod of modifiers) {
        lines.push(`${this.pad()}${this.expandModifier(mod)}`);
      }
      return lines.join('\n');
    }

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

    // Handle TabView container (Tab without preset)
    if (tag === 'Tab' && !preset && children.length > 0) {
      return this.generateTabView(node);
    }

    // Handle TC (Text Concatenation) — joins child T() with +
    if (tag === 'TC' && children.length > 0) {
      return this.generateTextConcat(node);
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
      case 'tabItem':
        return this.generateTabItem(node);
      case 'floatingField':
        return this.generateFloatingField(node, def);
      case 'imagePlaceholder':
        return this.generateImagePlaceholder(node);
      case 'searchBar':
        return this.generateSearchBar(node);
      default:
        return this.generateLeaf(node);
    }
  }

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

  generateModifierPreset(node, def) {
    const { tag, modifiers } = node;
    const lines = [];

    if (tag === 'B') {
      const label = escapeSwift(this.getFirstStringArg(node.args));
      lines.push(`${this.pad()}Button("${label}", action: {})`);
    } else {
      return this.generateLeaf(node);
    }

    lines.push(`${this.pad()}.${def.swift}()`);

    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  generateContainerModifierPreset(node, def) {
    const { modifiers, children } = node;
    const lines = [];

    lines.push(`${this.pad()}VStack {`);
    this.indent++;
    lines.push(this.generateElements(children));
    this.indent--;
    lines.push(`${this.pad()}}`);

    lines.push(`${this.pad()}.${def.swift}()`);

    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  generateLeafModifierPreset(node, def) {
    const { modifiers } = node;
    const label = escapeSwift(this.getFirstStringArg(node.args));
    const lines = [];

    if (def.viewTag === 'Text') {
      lines.push(`${this.pad()}Text("${label}")`);
    } else {
      lines.push(`${this.pad()}${def.viewTag}("${label}")`);
    }

    lines.push(`${this.pad()}.${def.swift}()`);

    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

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

  // Generate TabView with Tab children — native iOS 26 TabView
  // TC { T("plain ") T("bold").bold T(" end") } → Text("plain ") + Text("bold").bold() + Text(" end")
  generateTextConcat(node) {
    const { modifiers, children } = node;
    const lines = [];

    // Generate each child T() as a single-line expression
    const parts = [];
    for (const child of children) {
      if (child.tag !== 'T') continue;
      const text = escapeSwift(this.getFirstStringArg(child.args));
      let expr = `Text("${text}")`;
      for (const mod of child.modifiers) {
        expr += this.expandModifier(mod);
      }
      parts.push(expr);
    }

    if (parts.length === 0) return `${this.pad()}Text("")`;

    const hasContainerMods = modifiers.length > 0;

    if (hasContainerMods && parts.length > 1) {
      // Wrap in Group so modifiers apply to the whole concatenated text
      lines.push(`${this.pad()}Group {`);
      this.indent++;
      lines.push(`${this.pad()}${parts[0]} +`);
      for (let i = 1; i < parts.length; i++) {
        const sep = i < parts.length - 1 ? ' +' : '';
        lines.push(`${this.pad()}${parts[i]}${sep}`);
      }
      this.indent--;
      lines.push(`${this.pad()}}`);
    } else if (parts.length === 1) {
      lines.push(`${this.pad()}${parts[0]}`);
    } else {
      lines.push(`${this.pad()}${parts[0]} +`);
      for (let i = 1; i < parts.length; i++) {
        const sep = i < parts.length - 1 ? ' +' : '';
        lines.push(`${this.pad()}${parts[i]}${sep}`);
      }
    }

    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }

    return lines.join('\n');
  }

  generateTabView(node) {
    const { args, modifiers, children } = node;
    const lines = [];

    // Tab(active:1) → TabView(selection: .constant(1))
    const activeArg = args.find(a => a.type === 'named' && a.key === 'active');
    const hasActive = !!activeArg;
    if (hasActive) {
      lines.push(`${this.pad()}TabView(selection: .constant(${this.argValueToSwift(activeArg.value)})) {`);
    } else {
      lines.push(`${this.pad()}TabView {`);
    }
    this.indent++;

    let tabIndex = 0;
    for (const child of children) {
      if (child.tag === 'Tab' && child.preset === 'item') {
        lines.push(this.generateTabItem(child, hasActive ? tabIndex : -1));
        tabIndex++;
      } else {
        // Non-tab children go inside as-is (shouldn't happen but be safe)
        lines.push(this.generateElement(child));
      }
    }

    this.indent--;
    lines.push(`${this.pad()}}`);

    // Handle tint from container args
    const tintArg = args.find(a => a.type === 'named' && a.key === 'tint');
    if (tintArg) {
      lines.push(`${this.pad()}.tint(${this.argValueToSwift(tintArg.value)})`);
    }

    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }

    return lines.join('\n');
  }

  // Generate a single Tab("label", systemImage: "icon") { content }
  // tabIndex >= 0 means we need value: param for selection binding
  generateTabItem(node, tabIndex = -1) {
    const { args, modifiers, children } = node;
    const label = escapeSwift(this.getFirstStringArg(args));
    const sysArg = args.find(a => a.type === 'named' && a.key === 'sys');
    const icon = sysArg ? escapeSwift(sysArg.value.value) : 'questionmark';

    const valueParam = tabIndex >= 0 ? `, value: ${tabIndex}` : '';
    const lines = [];

    if (children.length > 0) {
      lines.push(`${this.pad()}Tab("${label}", systemImage: "${icon}"${valueParam}) {`);
      this.indent++;
      lines.push(this.generateElements(children));
      this.indent--;
      lines.push(`${this.pad()}}`);
    } else {
      lines.push(`${this.pad()}Tab("${label}", systemImage: "${icon}"${valueParam}) {`);
      this.indent++;
      lines.push(`${this.pad()}Text("")`);
      this.indent--;
      lines.push(`${this.pad()}}`);
    }

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

    // Build the opening line — alignment must precede spacing in SwiftUI
    let opening = swiftTag;
    const paramStrs = [];
    const alParam = initParams.find(p => p.key === 'al');
    const spParam = initParams.find(p => p.key === 'sp');
    if (alParam) {
      paramStrs.push(`alignment: ${this.argValueToSwift(alParam.value)}`);
    }
    if (spParam) {
      paramStrs.push(`spacing: ${this.argValueToSwift(spParam.value)}`);
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
    } else if (tag === 'LG') {
      lines.push(`${this.pad()}${this.generateLinearGradient(args)}`);
    } else if (tag === 'Seg') {
      lines.push(this.generateSegmentedPicker(args));
    } else {
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

  // ── Modifier expansion ──────────────────────────────────────────────

  expandModifier(mod) {
    const { name, args, block } = mod;

    // ── Block modifiers (.overlay { DSL }) ─────────────────────────
    if (block && block.length > 0) {
      if (name === 'overlay') {
        return this.expandOverlayBlock(block);
      }
      // Future: .background { }, etc.
      throw new Error(`Unknown block modifier: .${name} { }`);
    }

    // ── Font styles ───────────────────────────────────────────────
    if (FONT_STYLES.has(name)) {
      return `.font(.${name})`;
    }

    // ── Font weights ──────────────────────────────────────────────
    if (FONT_WEIGHTS.has(name)) {
      return `.fontWeight(.${name})`;
    }

    // ── Foreground styles ─────────────────────────────────────────
    if (FOREGROUND_STYLES.has(name)) {
      return `.foregroundStyle(.${name})`;
    }

    // ── No-arg modifiers ──────────────────────────────────────────
    if (name === 'underline') return `.underline()`;
    if (name === 'italic') return `.italic()`;
    if (name === 'ignoresSafeArea') return `.ignoresSafeArea()`;

    // ── Color: fg, bg ─────────────────────────────────────────────
    if (name === 'fg' && args.length > 0) {
      return `.foregroundStyle(${this.argValueToSwift(args[0])})`;
    }
    if (name === 'bg' && args.length > 0) {
      return `.background(${this.argValueToSwift(args[0])})`;
    }

    // ── Typography ────────────────────────────────────────────────
    if (name === 'f' && args.length > 0) {
      return `.font(.system(size: ${this.argValueToSwift(args[0])}))`;
    }
    if (name === 'font' && args.length > 0) {
      return `.font(${this.argValueToSwift(args[0])})`;
    }
    if (name === 'tracking' && args.length > 0) {
      return `.tracking(${this.argValueToSwift(args[0])})`;
    }

    // ── Frame ─────────────────────────────────────────────────────
    // SwiftUI has two frame overloads that can't be mixed:
    //   frame(width:, height:, alignment:)
    //   frame(minWidth:, maxWidth:, minHeight:, maxHeight:, alignment:)
    // If any min/max param is present, promote w→maxWidth, h→maxHeight
    if (name === 'frame') {
      const keys = args.filter(a => a.type === 'named').map(a => a.key);
      const hasMinMax = keys.some(k => ['minW', 'maxW', 'minH', 'maxH'].includes(k));

      const parts = [];
      for (const a of args) {
        if (a.type === 'named') {
          let key = a.key;
          // Promote w/h to maxWidth/maxHeight when mixing with min/max params
          if (hasMinMax && key === 'w') key = 'maxW';
          if (hasMinMax && key === 'h') key = 'maxH';
          const swiftKey = this.frameKeyMap(key);
          const val = this.argValueToSwift(a.value);
          parts.push(`${swiftKey}: ${val}`);
        }
      }
      return `.frame(${parts.join(', ')})`;
    }

    // ── Padding ───────────────────────────────────────────────────
    if (name === 'p' && args.length > 0) return `.padding(${this.argValueToSwift(args[0])})`;
    if (name === 'px' && args.length > 0) return `.padding(.horizontal, ${this.argValueToSwift(args[0])})`;
    if (name === 'py' && args.length > 0) return `.padding(.vertical, ${this.argValueToSwift(args[0])})`;
    if (name === 'pt' && args.length > 0) return `.padding(.top, ${this.argValueToSwift(args[0])})`;
    if (name === 'pb' && args.length > 0) return `.padding(.bottom, ${this.argValueToSwift(args[0])})`;
    if (name === 'pl' && args.length > 0) return `.padding(.leading, ${this.argValueToSwift(args[0])})`;
    if (name === 'pr' && args.length > 0) return `.padding(.trailing, ${this.argValueToSwift(args[0])})`;

    // ── Corner radius ─────────────────────────────────────────────
    if (name === 'r' && args.length > 0) {
      return `.clipShape(RoundedRectangle(cornerRadius: ${this.argValueToSwift(args[0])}))`;
    }

    // ── Opacity ───────────────────────────────────────────────────
    if (name === 'opacity' && args.length > 0) {
      return `.opacity(${this.argValueToSwift(args[0])})`;
    }

    // ── Multiline text alignment ──────────────────────────────────
    if ((name === 'multiline' || name === 'multilineTextAlignment') && args.length > 0) {
      return `.multilineTextAlignment(${this.argValueToSwift(args[0])})`;
    }

    // ── Offset ────────────────────────────────────────────────────
    if (name === 'offset') {
      const parts = [];
      for (const a of args) {
        if (a.type === 'named') {
          parts.push(`${a.key}: ${this.argValueToSwift(a.value)}`);
        }
      }
      return `.offset(${parts.join(', ')})`;
    }

    // ── Border (new shorthand) ────────────────────────────────────
    // .border(.gray) → .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray))
    // .border(.gray, w:2) → .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray, lineWidth: 2))
    // .border(.gray, r:12) → .overlay(RoundedRectangle(cornerRadius: 12).stroke(.gray))
    // .border(.gray, w:2, r:12) → .overlay(RoundedRectangle(cornerRadius: 12).stroke(.gray, lineWidth: 2))
    if (name === 'border') {
      const color = args.length > 0 ? this.argValueToSwift(args[0]) : '.gray';
      const wArg = args.find(a => a.type === 'named' && a.key === 'w');
      const rArg = args.find(a => a.type === 'named' && a.key === 'r');
      const lineWidth = wArg ? `, lineWidth: ${this.argValueToSwift(wArg.value)}` : '';
      // .border(.white, r:capsule) → Capsule stroke
      const rVal = rArg ? this.argValueToSwift(rArg.value) : null;
      if (rVal === 'Capsule' || rVal === '.capsule') {
        return `.overlay(Capsule().stroke(${color}${lineWidth}))`;
      }
      if (rVal === 'Circle' || rVal === '.circle') {
        return `.overlay(Circle().stroke(${color}${lineWidth}))`;
      }
      const radius = rVal || '8';
      return `.overlay(RoundedRectangle(cornerRadius: ${radius}).stroke(${color}${lineWidth}))`;
    }

    // ── Stroke (for shapes) ───────────────────────────────────────
    // .stroke(.gray) → .stroke(.gray)
    // .stroke(.gray, w:2) → .stroke(.gray, lineWidth: 2)
    if (name === 'stroke') {
      const color = args.length > 0 ? this.argValueToSwift(args[0]) : '.gray';
      const wArg = args.find(a => a.type === 'named' && a.key === 'w');
      if (wArg) {
        return `.stroke(${color}, lineWidth: ${this.argValueToSwift(wArg.value)})`;
      }
      return `.stroke(${color})`;
    }

    // ── ClipShape ─────────────────────────────────────────────────
    // .clipShape(Capsule) → .clipShape(Capsule())
    // .clipShape(Circle) → .clipShape(Circle())
    if (name === 'clipShape' && args.length > 0) {
      const shape = this.argValueToSwift(args[0]);
      // If it's a bare identifier like Capsule or Circle, add ()
      if (/^[A-Z]\w*$/.test(shape)) {
        return `.clipShape(${shape}())`;
      }
      return `.clipShape(${shape})`;
    }

    // ── Line limit ─────────────────────────────────────────────────
    if (name === 'lineLimit' && args.length > 0) {
      return `.lineLimit(${this.argValueToSwift(args[0])})`;
    }

    // ── Line spacing ─────────────────────────────────────────────────
    if (name === 'lineSpacing' && args.length > 0) {
      return `.lineSpacing(${this.argValueToSwift(args[0])})`;
    }

    // ── Shadow ───────────────────────────────────────────────────────
    // .shadow() → .shadow(radius: 4)
    // .shadow(r:4) → .shadow(radius: 4)
    // .shadow(.black, r:8, x:0, y:4) → .shadow(color: .black, radius: 8, x: 0, y: 4)
    if (name === 'shadow') {
      const parts = [];
      const colorArg = args.find(a => a.type !== 'named');
      const rArg = args.find(a => a.type === 'named' && a.key === 'r');
      const xArg = args.find(a => a.type === 'named' && a.key === 'x');
      const yArg = args.find(a => a.type === 'named' && a.key === 'y');
      if (colorArg) parts.push(`color: ${this.argValueToSwift(colorArg)}`);
      parts.push(`radius: ${rArg ? this.argValueToSwift(rArg.value) : '4'}`);
      if (xArg) parts.push(`x: ${this.argValueToSwift(xArg.value)}`);
      if (yArg) parts.push(`y: ${this.argValueToSwift(yArg.value)}`);
      return `.shadow(${parts.join(', ')})`;
    }

    // ── Unknown modifier — error ──────────────────────────────────
    throw new Error(`Unknown modifier: .${name}(${args.map(a => this.argToSwift(a)).join(', ')}). Add it to the generator.`);
  }

  // Generate .overlay() with DSL block content
  expandOverlayBlock(blockChildren) {
    // Single element overlay: .overlay(Element)
    // Multiple elements: .overlay { VStack { ... } }
    if (blockChildren.length === 1) {
      const saved = this.indent;
      this.indent = 0;
      const inner = this.generateElement(blockChildren[0]).trim();
      this.indent = saved;
      return `.overlay(${inner})`;
    }

    // Multiple children — wrap in a container-like overlay
    const lines = [`.overlay {`];
    this.indent++;
    lines.push(this.generateElements(blockChildren));
    this.indent--;
    lines.push(`${this.pad()}}`);
    return lines.join('\n');
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
      al: 'alignment',
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
    if (val.type === 'hex') return `Color(hex: 0x${val.value})`;
    if (val.type === 'gradient') return this.generateLinearGradient(val.args);
    if (val.type === 'enum') {
      if (val.value === '.inf') return '.infinity';
      return val.value;
    }
    if (val.type === 'ident') return val.value;
    if (val.type === 'expr') return val.value;
    return String(val.value || '');
  }

  // Generate LinearGradient from LG(...) args
  // LG(.purple, .black)  → defaults to top→bottom
  // LG(.purple, .black, dir:.down) → top→bottom
  // LG(.purple, .black, dir:.right) → leading→trailing
  // LG(#6B2FA0, #1A0A2E, dir:.down) → with hex colors
  generateLinearGradient(args) {
    const dirMap = {
      '.down':  { start: '.top', end: '.bottom' },
      '.up':    { start: '.bottom', end: '.top' },
      '.right': { start: '.leading', end: '.trailing' },
      '.left':  { start: '.trailing', end: '.leading' },
    };

    // Separate colors from named args
    const colors = [];
    let dir = '.down';
    for (const a of args) {
      if (a.type === 'named' && a.key === 'dir') {
        dir = a.value.value || a.value;
      } else {
        colors.push(this.argValueToSwift(a));
      }
    }

    const d = dirMap[dir] || dirMap['.down'];
    return `LinearGradient(colors: [${colors.join(', ')}], startPoint: ${d.start}, endPoint: ${d.end})`;
  }

  // Seg(["Pickup", "Delivery"], active:0)
  // → Picker("", selection: .constant(0)) { Text("Pickup").tag(0) ... }.pickerStyle(.segmented)
  // TF.float("Email") → FloatingTextField(label: "Email", value: "")
  // TF.float("Email", "john@example.com") → FloatingTextField(label: "Email", value: "john@example.com")
  // Img.placeholder(h:200, color:.orange, icon:"fork.knife")
  // TF.search("Search...") → SearchBar(placeholder: "Search...")
  // TF.search("Search...", "quesarito") → SearchBar(placeholder: "Search...", value: "quesarito")
  generateSearchBar(node) {
    const { args, modifiers } = node;
    const strings = args.filter(a => a.type === 'string').map(a => a.value);
    const placeholder = escapeSwift(strings[0] || 'Search...');
    const value = strings[1] ? escapeSwift(strings[1]) : '';

    const lines = [];
    if (value) {
      lines.push(`${this.pad()}SearchBar(placeholder: "${placeholder}", value: "${value}")`);
    } else {
      lines.push(`${this.pad()}SearchBar(placeholder: "${placeholder}")`);
    }
    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  generateImagePlaceholder(node) {
    const { args, modifiers } = node;
    const parts = [];
    const hArg = args.find(a => a.type === 'named' && a.key === 'h');
    const colorArg = args.find(a => a.type === 'named' && a.key === 'color');
    const iconArg = args.find(a => a.type === 'named' && a.key === 'icon');
    if (hArg) parts.push(`height: ${this.argValueToSwift(hArg.value)}`);
    if (colorArg) parts.push(`color: ${this.argValueToSwift(colorArg.value)}`);
    if (iconArg) parts.push(`icon: ${this.argValueToSwift(iconArg.value)}`);

    const lines = [];
    lines.push(`${this.pad()}ImagePlaceholder(${parts.join(', ')})`);
    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  generateFloatingField(node, def) {
    const { args, modifiers } = node;
    const strings = args.filter(a => a.type === 'string').map(a => a.value);
    const label = escapeSwift(strings[0] || '');
    const value = escapeSwift(strings[1] || '');

    const lines = [];
    lines.push(`${this.pad()}${def.swift}(label: "${label}", value: "${value}")`);
    for (const mod of modifiers) {
      lines.push(`${this.pad()}${this.expandModifier(mod)}`);
    }
    return lines.join('\n');
  }

  generateSegmentedPicker(args) {
    // First arg should be an array of strings, or individual string args
    // Named arg active:N sets the selected index
    const items = [];
    let active = 0;

    for (const a of args) {
      if (a.type === 'named' && a.key === 'active') {
        active = a.value.value || 0;
      } else if (a.type === 'string') {
        items.push(escapeSwift(a.value));
      }
    }

    const lines = [];
    lines.push(`${this.pad()}Picker("", selection: .constant(${active})) {`);
    this.indent++;
    for (let i = 0; i < items.length; i++) {
      lines.push(`${this.pad()}Text("${items[i]}").tag(${i})`);
    }
    this.indent--;
    lines.push(`${this.pad()}}`);
    lines.push(`${this.pad()}.pickerStyle(.segmented)`);
    return lines.join('\n');
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
