const TokenType = {
  IDENT: 'IDENT',
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  HEX_COLOR: 'HEX_COLOR',
  DOT: 'DOT',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  LBRACE: 'LBRACE',
  RBRACE: 'RBRACE',
  LBRACKET: 'LBRACKET',
  RBRACKET: 'RBRACKET',
  COLON: 'COLON',
  COMMA: 'COMMA',
  STAR: 'STAR',
  EOF: 'EOF',
};

class Tokenizer {
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
  }

  error(msg) {
    throw new Error(`Tokenizer error at line ${this.line}, col ${this.col}: ${msg}`);
  }

  peek() {
    return this.pos < this.input.length ? this.input[this.pos] : null;
  }

  advance() {
    const ch = this.input[this.pos];
    this.pos++;
    if (ch === '\n') {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    return ch;
  }

  skipWhitespace() {
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (/\s/.test(ch)) {
        this.advance();
      } else if (ch === '/' && this.input[this.pos + 1] === '/') {
        while (this.pos < this.input.length && this.input[this.pos] !== '\n') {
          this.advance();
        }
      } else {
        break;
      }
    }
  }

  readString() {
    const quote = this.advance(); // skip opening quote
    let str = '';
    while (this.pos < this.input.length && this.input[this.pos] !== quote) {
      if (this.input[this.pos] === '\\') {
        this.advance();
        const esc = this.advance();
        if (esc === 'n') str += '\n';
        else if (esc === 't') str += '\t';
        else str += esc;
      } else {
        str += this.advance();
      }
    }
    if (this.pos >= this.input.length) this.error('Unterminated string');
    this.advance(); // skip closing quote
    return { type: TokenType.STRING, value: str, line: this.line, col: this.col };
  }

  readNumber() {
    const startLine = this.line;
    const startCol = this.col;
    let num = '';
    if (this.input[this.pos] === '-') num += this.advance();
    while (this.pos < this.input.length && /[0-9]/.test(this.input[this.pos])) {
      num += this.advance();
    }
    if (this.pos < this.input.length && this.input[this.pos] === '.') {
      // Check it's a decimal, not a dot modifier
      if (this.pos + 1 < this.input.length && /[0-9]/.test(this.input[this.pos + 1])) {
        num += this.advance(); // the dot
        while (this.pos < this.input.length && /[0-9]/.test(this.input[this.pos])) {
          num += this.advance();
        }
      }
    }
    return { type: TokenType.NUMBER, value: parseFloat(num), line: startLine, col: startCol };
  }

  readIdent() {
    const startLine = this.line;
    const startCol = this.col;
    let ident = '';
    while (this.pos < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.pos])) {
      ident += this.advance();
    }
    return { type: TokenType.IDENT, value: ident, line: startLine, col: startCol };
  }

  readHexColor() {
    const startLine = this.line;
    const startCol = this.col;
    this.advance(); // skip #
    let hex = '';
    while (this.pos < this.input.length && /[0-9a-fA-F]/.test(this.input[this.pos])) {
      hex += this.advance();
    }
    if (hex.length !== 6 && hex.length !== 8) {
      throw new Error(`Invalid hex color at line ${startLine}, col ${startCol}: #${hex} (expected 6 or 8 hex digits)`);
    }
    return { type: TokenType.HEX_COLOR, value: hex, line: startLine, col: startCol };
  }

  tokenize() {
    const tokens = [];

    while (true) {
      this.skipWhitespace();
      if (this.pos >= this.input.length) break;

      const ch = this.input[this.pos];
      const line = this.line;
      const col = this.col;

      if (ch === '#') {
        tokens.push(this.readHexColor());
      } else if (ch === '"' || ch === "'") {
        tokens.push(this.readString());
      } else if (/[0-9]/.test(ch) || (ch === '-' && this.pos + 1 < this.input.length && /[0-9]/.test(this.input[this.pos + 1]))) {
        tokens.push(this.readNumber());
      } else if (/[a-zA-Z_]/.test(ch)) {
        tokens.push(this.readIdent());
      } else {
        this.advance();
        const simple = {
          '.': TokenType.DOT,
          '(': TokenType.LPAREN,
          ')': TokenType.RPAREN,
          '{': TokenType.LBRACE,
          '}': TokenType.RBRACE,
          '[': TokenType.LBRACKET,
          ']': TokenType.RBRACKET,
          ':': TokenType.COLON,
          ',': TokenType.COMMA,
          '*': TokenType.STAR,
        };
        if (simple[ch]) {
          tokens.push({ type: simple[ch], line, col });
        } else {
          this.error(`Unexpected character: '${ch}'`);
        }
      }
    }

    tokens.push({ type: TokenType.EOF, line: this.line, col: this.col });
    return tokens;
  }
}

module.exports = { Tokenizer, TokenType };
