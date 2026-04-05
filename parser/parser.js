const { TokenType } = require('./tokenizer');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  error(msg) {
    const tok = this.current();
    throw new Error(`Parse error at line ${tok.line}, col ${tok.col}: ${msg} (got ${tok.type}${tok.value !== undefined ? ` "${tok.value}"` : ''})`);
  }

  current() {
    return this.tokens[this.pos];
  }

  peek(offset = 0) {
    return this.tokens[this.pos + offset];
  }

  advance() {
    const tok = this.tokens[this.pos];
    this.pos++;
    return tok;
  }

  expect(type) {
    const tok = this.current();
    if (tok.type !== type) {
      this.error(`Expected ${type}`);
    }
    return this.advance();
  }

  match(type) {
    if (this.current().type === type) {
      return this.advance();
    }
    return null;
  }

  // Parse the full file — a list of top-level elements
  parse() {
    const elements = this.parseElements();
    this.expect(TokenType.EOF);
    return elements;
  }

  // Parse elements until we hit a closing brace or EOF
  parseElements() {
    const elements = [];
    while (
      this.current().type !== TokenType.RBRACE &&
      this.current().type !== TokenType.EOF
    ) {
      elements.push(this.parseElement());
    }
    return elements;
  }

  // Parse a single element:
  //   IDENT (.IDENT)? (args)? modifiers* ({children})? modifiers* (*NUMBER)?
  parseElement() {
    // Check for array literal: ["a","b"].map(V.badge)
    if (this.current().type === TokenType.LBRACKET) {
      return this.parseArrayMap();
    }

    const tag = this.expect(TokenType.IDENT).value;

    // Optional preset: .IDENT (only before args)
    let preset = null;
    if (
      this.current().type === TokenType.DOT &&
      this.peek(1).type === TokenType.IDENT &&
      this.isPresetContext(tag)
    ) {
      this.advance(); // skip dot
      preset = this.advance().value;
    }

    // Optional args: (...)
    let args = [];
    if (this.current().type === TokenType.LPAREN) {
      args = this.parseArgs();
    }

    // Optional modifiers: .ident, .ident(...), or .ident { ... }
    const modifiers = this.parseModifiers();

    // Optional children: { ... }
    let children = [];
    if (this.current().type === TokenType.LBRACE) {
      this.advance(); // skip {
      children = this.parseElements();
      this.expect(TokenType.RBRACE);
    }

    // Modifiers AFTER children: HS { ... }.p(20).bg(.red)
    this.parseModifiers(modifiers);

    // Optional repetition: * NUMBER
    let repeat = 1;
    if (this.current().type === TokenType.STAR) {
      this.advance();
      repeat = this.expect(TokenType.NUMBER).value;
    }

    return {
      type: 'element',
      tag,
      preset,
      args,
      modifiers,
      children,
      repeat,
    };
  }

  // Parse a chain of modifiers, appending to existing array or creating new one
  parseModifiers(existing) {
    const modifiers = existing || [];
    while (this.current().type === TokenType.DOT) {
      if (this.peek(1).type === TokenType.IDENT) {
        this.advance(); // skip dot
        const modName = this.advance().value;

        // Modifier with brace block: .overlay { DSL content }
        if (this.current().type === TokenType.LBRACE) {
          this.advance(); // skip {
          const blockChildren = this.parseElements();
          this.expect(TokenType.RBRACE);
          modifiers.push({ name: modName, args: [], block: blockChildren });
        }
        // Modifier with args: .fg(.blue)
        else if (this.current().type === TokenType.LPAREN) {
          const modArgs = this.parseArgs();
          modifiers.push({ name: modName, args: modArgs });
        }
        // No-arg modifier: .bold
        else {
          modifiers.push({ name: modName, args: [] });
        }
      } else {
        break;
      }
    }
    return modifiers;
  }

  // Check if the current tag supports presets
  isPresetContext(tag) {
    const presetTags = ['B', 'V', 'TF', 'Nav', 'Tab', 'Img', 'ProgressView', 'Bar'];
    return presetTags.includes(tag);
  }

  // Parse (...) argument list
  parseArgs() {
    this.expect(TokenType.LPAREN);
    const args = [];

    while (this.current().type !== TokenType.RPAREN) {
      if (args.length > 0) {
        this.expect(TokenType.COMMA);
      }
      args.push(this.parseArg());
    }

    this.expect(TokenType.RPAREN);
    return args;
  }

  // Parse a single argument — could be:
  //   "string"        → { type: 'string', value: "..." }
  //   42              → { type: 'number', value: 42 }
  //   key: value      → { type: 'named', key: "...", value: ... }
  //   .ident          → { type: 'enum', value: ".ident" }
  //   .ident.method(x) → { type: 'expr', value: ".ident.method(x)" }  (chained)
  parseArg() {
    // Named argument: IDENT COLON value
    if (
      this.current().type === TokenType.IDENT &&
      this.peek(1).type === TokenType.COLON
    ) {
      const key = this.advance().value;
      this.advance(); // skip colon
      const value = this.parseArgValue();
      return { type: 'named', key, value };
    }

    return this.parseArgValue();
  }

  parseArgValue() {
    const tok = this.current();

    if (tok.type === TokenType.STRING) {
      this.advance();
      return { type: 'string', value: tok.value };
    }

    if (tok.type === TokenType.NUMBER) {
      this.advance();
      return { type: 'number', value: tok.value };
    }

    // Hex color: #FF6600 or with chaining: #FF6600.opacity(0.8)
    if (tok.type === TokenType.HEX_COLOR) {
      this.advance();
      const hex = tok.value;

      // Check for chained calls: #FF6600.opacity(0.8)
      if (this.current().type === TokenType.DOT && this.peek(1).type === TokenType.IDENT) {
        let chain = this.parseChainedCalls();
        return { type: 'hexExpr', hex, chain };
      }

      return { type: 'hex', value: hex };
    }

    // Enum or chained expression starting with dot: .blue, .white.opacity(0.8)
    if (tok.type === TokenType.DOT && this.peek(1).type === TokenType.IDENT) {
      this.advance(); // skip dot
      const ident = this.advance().value;

      // Check for chained calls: .white.opacity(0.8) or .gray.opacity(0.3)
      if (this.current().type === TokenType.DOT || this.current().type === TokenType.LPAREN) {
        let expr = `.${ident}`;
        expr += this.parseChainedCalls();
        return { type: 'expr', value: expr };
      }

      // Simple enum
      if (`.${ident}` === '.inf') return { type: 'enum', value: '.infinity' };
      return { type: 'enum', value: `.${ident}` };
    }

    // LG(...) as an inline value — e.g. .fg(LG(.purple, .black, dir:.down))
    if (tok.type === TokenType.IDENT && tok.value === 'LG' && this.peek(1).type === TokenType.LPAREN) {
      this.advance(); // skip LG
      const lgArgs = this.parseArgs();
      return { type: 'gradient', args: lgArgs };
    }

    // Plain identifier — could be followed by chained calls: Capsule(), Circle()
    if (tok.type === TokenType.IDENT) {
      this.advance();

      // Identifier with parens or dots: Capsule(), RoundedRectangle(cornerRadius:8)
      if (this.current().type === TokenType.LPAREN || this.current().type === TokenType.DOT) {
        let expr = tok.value;
        expr += this.parseChainedCalls();
        return { type: 'expr', value: expr };
      }

      return { type: 'ident', value: tok.value };
    }

    this.error('Expected argument value');
  }

  // Parse chained method calls and property accesses: .opacity(0.8).something
  // Returns the string representation of the chain
  parseChainedCalls() {
    let chain = '';

    while (true) {
      // (args) — function call
      if (this.current().type === TokenType.LPAREN) {
        chain += '(';
        this.advance(); // skip (
        const innerArgs = [];
        while (this.current().type !== TokenType.RPAREN) {
          if (innerArgs.length > 0) {
            this.expect(TokenType.COMMA);
            chain += ', ';
          }
          // Parse inner arg and serialize
          const arg = this.parseArg();
          chain += this.serializeArg(arg);
          innerArgs.push(arg);
        }
        this.expect(TokenType.RPAREN);
        chain += ')';
      }
      // .name — property access or method call
      else if (this.current().type === TokenType.DOT && this.peek(1).type === TokenType.IDENT) {
        this.advance(); // skip dot
        const name = this.advance().value;
        chain += `.${name}`;
      }
      else {
        break;
      }
    }

    return chain;
  }

  // Serialize a parsed arg back to Swift string (for chained expressions)
  serializeArg(arg) {
    if (arg.type === 'string') return `"${arg.value}"`;
    if (arg.type === 'number') return String(arg.value);
    if (arg.type === 'enum') return arg.value;
    if (arg.type === 'ident') return arg.value;
    if (arg.type === 'expr') return arg.value;
    if (arg.type === 'hexExpr') return `Color(hex: 0x${arg.hex})${arg.chain}`;
    if (arg.type === 'named') return `${arg.key}: ${this.serializeArg(arg.value)}`;
    return String(arg.value || '');
  }

  // Parse: ["a","b","c"].map(V.badge)
  parseArrayMap() {
    this.expect(TokenType.LBRACKET);
    const items = [];
    while (this.current().type !== TokenType.RBRACKET) {
      if (items.length > 0) this.expect(TokenType.COMMA);
      const tok = this.current();
      if (tok.type === TokenType.STRING) {
        items.push(this.advance().value);
      } else if (tok.type === TokenType.NUMBER) {
        items.push(this.advance().value);
      } else {
        this.error('Expected string or number in array');
      }
    }
    this.expect(TokenType.RBRACKET);

    // Expect .map(Element.preset)
    this.expect(TokenType.DOT);
    const mapIdent = this.expect(TokenType.IDENT);
    if (mapIdent.value !== 'map') {
      this.error('Expected .map after array');
    }

    this.expect(TokenType.LPAREN);
    const tag = this.expect(TokenType.IDENT).value;
    let preset = null;
    if (this.match(TokenType.DOT)) {
      preset = this.expect(TokenType.IDENT).value;
    }
    this.expect(TokenType.RPAREN);

    return {
      type: 'map',
      items,
      tag,
      preset,
    };
  }
}

module.exports = { Parser };
