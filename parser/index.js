const fs = require('fs');
const path = require('path');
const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');
const { Generator } = require('./generator');

function compile(input, viewName) {
  const tokenizer = new Tokenizer(input);
  const tokens = tokenizer.tokenize();

  const parser = new Parser(tokens);
  const ast = parser.parse();

  const generator = new Generator();
  return generator.generate(ast, viewName);
}

// CLI usage: node parser/index.js <input.design> [output.swift]
if (require.main === module) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!inputPath) {
    console.error('Usage: node parser/index.js <input.design> [output.swift]');
    console.error('  If no output path given, writes to design/ContentView.swift');
    process.exit(1);
  }

  const input = fs.readFileSync(inputPath, 'utf-8');

  let output;
  try {
    output = compile(input);
  } catch (err) {
    console.error(`Compile error: ${err.message}`);
    process.exit(1);
  }

  const defaultOutput = path.join(__dirname, '..', 'design', 'ContentView.swift');
  const dest = outputPath || defaultOutput;

  fs.writeFileSync(dest, output);
  console.log(`Written to ${dest}`);
}

module.exports = { compile };
