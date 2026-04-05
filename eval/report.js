const fs = require("fs");
const path = require("path");

/**
 * Generate report.json and report.md from a completed eval run.
 */
function generateReport(runDir, {
  screenNumber,
  referencePath,
  timing,
  tokens,
  compileError,
  buildError,
  screenshotOk,
}) {
  // Read the review if it exists
  const reviewPath = path.join(runDir, "review.json");
  const review = fs.existsSync(reviewPath)
    ? JSON.parse(fs.readFileSync(reviewPath, "utf-8"))
    : null;

  // Read DSL to calculate token savings
  const designPath = path.join(runDir, "output.design");
  const compiledPath = path.join(runDir, "compiled.swift");
  const dslChars = fs.existsSync(designPath)
    ? fs.readFileSync(designPath, "utf-8").length
    : 0;
  const swiftChars = fs.existsSync(compiledPath)
    ? fs.readFileSync(compiledPath, "utf-8").length
    : 0;

  const report = {
    screenNumber,
    referencePath,
    timestamp: new Date().toISOString(),

    timing: {
      dslWriteMs: timing.dslWrite,
      compileMs: timing.compile,
      buildMs: timing.build,
      screenshotMs: timing.screenshot,
      reviewMs: timing.review,
      totalMs: timing.total,
      totalSec: +(timing.total / 1000).toFixed(1),
    },

    tokens: {
      input: tokens.input,
      output: tokens.output,
      total: tokens.input + tokens.output,
    },

    tokenSavings: {
      dslChars,
      swiftChars,
      compressionRatio: swiftChars > 0 ? +(dslChars / swiftChars).toFixed(2) : 0,
      charsSaved: swiftChars - dslChars,
    },

    compileError: compileError || null,
    buildError: buildError || null,
    screenshotCaptured: screenshotOk,

    agentReview: review,
  };

  // Write JSON report
  fs.writeFileSync(
    path.join(runDir, "report.json"),
    JSON.stringify(report, null, 2)
  );

  // Write markdown report
  const md = generateMarkdown(report);
  fs.writeFileSync(path.join(runDir, "report.md"), md);

  return report;
}

function generateMarkdown(r) {
  const lines = [];
  lines.push(`# Eval Report — Screen ${r.screenNumber}`);
  lines.push(`> ${r.timestamp}`);
  lines.push("");

  // Timing
  lines.push("## Timing");
  lines.push(`| Phase | Time |`);
  lines.push(`|-------|------|`);
  lines.push(`| DSL Write | ${fmt(r.timing.dslWriteMs)} |`);
  lines.push(`| Compile | ${fmt(r.timing.compileMs)} |`);
  lines.push(`| Build | ${fmt(r.timing.buildMs)} |`);
  lines.push(`| Screenshot | ${fmt(r.timing.screenshotMs)} |`);
  lines.push(`| Review | ${fmt(r.timing.reviewMs)} |`);
  lines.push(`| **Total** | **${fmt(r.timing.totalMs)}** |`);
  lines.push("");

  // Tokens
  lines.push("## Token Usage");
  lines.push(`- Input: ${r.tokens.input.toLocaleString()}`);
  lines.push(`- Output: ${r.tokens.output.toLocaleString()}`);
  lines.push(`- Total: ${r.tokens.total.toLocaleString()}`);
  lines.push("");

  // Token savings
  lines.push("## Token Savings (DSL vs Raw Swift)");
  lines.push(`- DSL: ${r.tokenSavings.dslChars} chars`);
  lines.push(`- Swift: ${r.tokenSavings.swiftChars} chars`);
  lines.push(`- Compression: ${r.tokenSavings.compressionRatio}x`);
  lines.push(`- Chars saved: ${r.tokenSavings.charsSaved}`);
  lines.push("");

  // Errors
  if (r.compileError) {
    lines.push("## Compile Error");
    lines.push("```");
    lines.push(r.compileError);
    lines.push("```");
    lines.push("");
  }
  if (r.buildError) {
    lines.push("## Build Error");
    lines.push("```");
    lines.push(r.buildError);
    lines.push("```");
    lines.push("");
  }

  // Agent review
  if (r.agentReview) {
    const rev = r.agentReview;
    lines.push(`## Agent Self-Review (Score: ${rev.overallScore}/10)`);
    lines.push("");

    lines.push("### Strengths");
    for (const s of rev.strengths) lines.push(`- ${s}`);
    lines.push("");

    lines.push("### Shortcomings");
    for (const s of rev.shortcomings) lines.push(`- ${s}`);
    lines.push("");

    if (rev.missingModifiers.length > 0) {
      lines.push("### Missing Modifiers");
      for (const s of rev.missingModifiers) lines.push(`- ${s}`);
      lines.push("");
    }

    if (rev.missingComponents.length > 0) {
      lines.push("### Missing Components");
      for (const s of rev.missingComponents) lines.push(`- ${s}`);
      lines.push("");
    }

    if (rev.suggestedTools.length > 0) {
      lines.push("### Suggested Tools");
      for (const s of rev.suggestedTools) lines.push(`- ${s}`);
      lines.push("");
    }

    if (rev.dslPainPoints.length > 0) {
      lines.push("### DSL Pain Points");
      for (const s of rev.dslPainPoints) lines.push(`- ${s}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

function fmt(ms) {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

module.exports = { generateReport };
