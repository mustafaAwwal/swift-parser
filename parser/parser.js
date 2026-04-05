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
  //   IDENT (.IDENT)? (args)? modifiers* ({children})? (*NUMBER)?
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
      // Distinguish preset from modifier: preset comes before args/children
      // A preset is the first dot after the tag name
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

    // Optional modifiers: .ident or .ident(...)
    const modifiers = [];
    while (this.current().type === TokenType.DOT) {
      // Peek ahead: DOT IDENT — could be a modifier
      if (this.peek(1).type === TokenType.IDENT) {
        this.advance(); // skip dot
        const modName = this.advance().value;
        let modArgs = [];
        if (this.current().type === TokenType.LPAREN) {
          modArgs = this.parseArgs();
        }
        modifiers.push({ name: modName, args: modArgs });
      } else {
        break;
      }
    }

    // Optional children: { ... }
    let children = [];
    if (this.current().type === TokenType.LBRACE) {
      this.advance(); // skip {
      children = this.parseElements();
      this.expect(TokenType.RBRACE);
    }

    // Modifiers AFTER children: HS { ... }.p(20).bg(.red)
    while (this.current().type === TokenType.DOT) {
      if (this.peek(1).type === TokenType.IDENT) {
        this.advance(); // skip dot
        const modName = this.advance().value;
        let modArgs = [];
        if (this.current().type === TokenType.LPAREN) {
          modArgs = this.parseArgs();
        }
        modifiers.push({ name: modName, args: modArgs });
      } else {
        break;
      }
    }

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

  // Check if the current tag supports presets
  isPresetContext(tag) {
    const presetTags = ['B', 'V', 'TF', 'Nav', 'Tab', 'Img'];
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

    // Enum value: .ident — may be followed by chained calls like .white.opacity(0.8)
    if (tok.type === TokenType.DOT && this.peek(1).type === TokenType.IDENT) {
      const raw = this.parseRawExpression();
      // Check if it's a simple enum or a complex expression
      if (raw.match(/^\.[a-zA-Z_]+$/) ) {
        if (raw === '.inf') return { type: 'enum', value: '.infinity' };
        return { type: 'enum', value: raw };
      }
      return { type: 'raw', value: raw };
    }

    // Identifier possibly followed by ( ) — e.g. RoundedRectangle(cornerRadius:12)
    if (tok.type === TokenType.IDENT) {
      // Check if this is a complex expression (ident followed by parens or dots)
      if (this.peek(1).type === TokenType.LPAREN || this.peek(1).type === TokenType.DOT) {
        // Could be a complex expression like RoundedRectangle(cornerRadius:40).stroke(...)
        const raw = this.parseRawExpression();
        return { type: 'raw', value: raw };
      }
      this.advance();
      return { type: 'ident', value: tok.value };
    }

    this.error('Expected argument value');
  }

  // Parse a raw expression — collects tokens as a string, handling balanced parens and dot chains.
  // Stops at COMMA or unbalanced RPAREN (the enclosing arg list boundary).
  parseRawExpression() {
    let raw = '';
    let depth = 0;

    while (this.current().type !== TokenType.EOF) {
      const t = this.current();

      // Stop at comma or closing paren at depth 0 (end of this argument)
      if (depth === 0 && (t.type === TokenType.COMMA || t.type === TokenType.RPAREN)) {
        break;
      }
      // Stop at opening brace at depth 0 (start of children block)
      if (depth === 0 && t.type === TokenType.LBRACE) {
        break;
      }

      if (t.type === TokenType.LPAREN) {
        raw += '(';
        depth++;
        this.advance();
      } else if (t.type === TokenType.RPAREN) {
        if (depth === 0) break;
        raw += ')';
        depth--;
        this.advance();
      } else if (t.type === TokenType.DOT) {
        raw += '.';
        this.advance();
      } else if (t.type === TokenType.COLON) {
        raw += ': ';
        this.advance();
      } else if (t.type === TokenType.COMMA) {
        if (depth === 0) break;
        raw += ', ';
        this.advance();
      } else if (t.type === TokenType.STRING) {
        raw += `"${t.value}"`;
        this.advance();
      } else if (t.type === TokenType.NUMBER) {
        raw += String(t.value);
        this.advance();
      } else if (t.type === TokenType.IDENT) {
        raw += t.value;
        this.advance();
      } else if (t.type === TokenType.STAR) {
        // Stop — this is repetition operator at top level
        if (depth === 0) break;
        raw += '*';
        this.advance();
      } else {
        // Unknown token — stop
        break;
      }
    }

    return raw;
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
