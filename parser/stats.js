const fs = require('fs');
const path = require('path');
const { compile } = require('./index');

function approxTokens(text) {
  return Math.ceil(text.length / 4);
}

function stats(designPath) {
  const dsl = fs.readFileSync(designPath, 'utf-8');
  const swift = compile(dsl);

  const dslTokens = approxTokens(dsl);
  const swiftTokens = approxTokens(swift);
  const ratio = ((1 - dslTokens / swiftTokens) * 100).toFixed(1);

  console.log(`DSL:    ${dslTokens} tokens  (${dsl.length} chars, ${dsl.split('\n').length} lines)`);
  console.log(`Swift:  ${swiftTokens} tokens  (${swift.length} chars, ${swift.split('\n').length} lines)`);
  console.log(`Saved:  ${ratio}% fewer tokens`);

  return { dslTokens, swiftTokens, ratio: parseFloat(ratio) };
}

if (require.main === module) {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node parser/stats.js <input.design>');
    process.exit(1);
  }
  stats(inputPath);
}

module.exports = { stats };
