/**
 * Express server for screenshot capture.
 * The AutoCaptureView in the iOS app calls POST /screenshot for each screen.
 */

const express = require("express");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const PORT = 3456;

function createScreenshotServer({ outputDir, simulatorName = "iPhone 17 Pro", onScreenshot, onDone, expectedCount }) {
  const app = express();
  app.use(express.json());

  let capturedCount = 0;

  app.post("/screenshot", (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "name required" });
    }

    const screenshotPath = path.join(outputDir, `${name}.png`);

    try {
      execSync(
        `xcrun simctl io "${simulatorName}" screenshot "${screenshotPath}"`,
        { timeout: 10000 }
      );

      capturedCount++;
      console.log(`  [${capturedCount}/${expectedCount}] Captured: ${name}`);

      if (onScreenshot) onScreenshot(name, screenshotPath);

      res.json({ success: true, path: screenshotPath });

      // Check if all done
      if (capturedCount >= expectedCount && onDone) {
        setTimeout(() => onDone(), 500);
      }
    } catch (err) {
      console.error(`  Failed to capture ${name}: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  });

  // Health check
  app.get("/health", (req, res) => res.json({ ok: true }));

  return { app, port: PORT };
}

function startServer(opts) {
  const { app, port } = createScreenshotServer(opts);

  return new Promise((resolve) => {
    const srv = app.listen(port, () => {
      console.log(`Screenshot server on http://localhost:${port}`);
      resolve({
        server: srv,
        port,
        close: () => new Promise((r) => srv.close(r)),
      });
    });
  });
}

module.exports = { createScreenshotServer, startServer, PORT };
