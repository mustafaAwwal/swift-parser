/**
 * Generates AutoCaptureView.swift and ContentView.swift for batch screenshot capture.
 * Adapted from the X1 Demo project's screenshot pipeline.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const DESIGN_DIR = path.join(ROOT, "design");

/**
 * Generate AutoCaptureView.swift that cycles through all screen views
 * and calls back to our Express server for screenshots.
 */
function generateAutoCaptureView(screens, port = 3456) {
  const screenEntries = screens
    .map(
      (s) =>
        `        ScreenEntry(name: "${s.name}", view: AnyView(${s.viewName}()))`
    )
    .join(",\n");

  const swift = `import SwiftUI

struct ScreenEntry: Identifiable {
    let id = UUID()
    let name: String
    let view: AnyView
}

struct AutoCaptureView: View {
    @State private var currentIndex = 0
    @State private var status = "Starting..."
    @State private var isDone = false

    private let screens: [ScreenEntry] = [
${screenEntries}
    ]

    var body: some View {
        ZStack {
            if isDone {
                VStack(spacing: 16) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 64))
                        .foregroundStyle(.green)
                    Text("All \\(screens.count) screenshots captured!")
                        .font(.title2)
                        .fontWeight(.semibold)
                    Text(status)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .accessibilityIdentifier("auto-capture-done")
            } else if screens.indices.contains(currentIndex) {
                screens[currentIndex].view
                    .id(currentIndex)
            }
        }
        .task {
            await captureAll()
        }
    }

    private func captureAll() async {
        for i in screens.indices {
            currentIndex = i
            status = "Capturing \\(screens[i].name) (\\(i + 1)/\\(screens.count))..."

            // Wait for view to render
            try? await Task.sleep(nanoseconds: 800_000_000)
            await takeScreenshot(name: screens[i].name)
        }

        isDone = true
        status = "Done"
    }

    private func takeScreenshot(name: String) async {
        guard let url = URL(string: "http://localhost:${port}/screenshot") else {
            status = "Error: invalid URL"
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["name": name]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode != 200 {
                status = "Error capturing \\(name): HTTP \\(httpResponse.statusCode)"
            }
        } catch {
            status = "Error capturing \\(name): \\(error.localizedDescription)"
        }
    }
}

#Preview {
    AutoCaptureView()
}
`;

  fs.writeFileSync(path.join(DESIGN_DIR, "AutoCaptureView.swift"), swift);
}

/**
 * Generate ContentView.swift that auto-navigates to AutoCaptureView on launch.
 */
function generateContentView(screens) {
  const swift = `import SwiftUI

struct ContentView: View {
    var body: some View {
        AutoCaptureView()
    }
}

#Preview {
    ContentView()
}
`;

  fs.writeFileSync(path.join(DESIGN_DIR, "ContentView.swift"), swift);
}

module.exports = { generateAutoCaptureView, generateContentView };
