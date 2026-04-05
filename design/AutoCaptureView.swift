import SwiftUI

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
        ScreenEntry(name: "0", view: AnyView(Screen0View())),
        ScreenEntry(name: "1", view: AnyView(Screen1View())),
        ScreenEntry(name: "2", view: AnyView(Screen2View())),
        ScreenEntry(name: "3", view: AnyView(Screen3View())),
        ScreenEntry(name: "4", view: AnyView(Screen4View())),
        ScreenEntry(name: "5", view: AnyView(Screen5View())),
        ScreenEntry(name: "6", view: AnyView(Screen6View())),
        ScreenEntry(name: "7", view: AnyView(Screen7View())),
        ScreenEntry(name: "8", view: AnyView(Screen8View())),
        ScreenEntry(name: "9", view: AnyView(Screen9View()))
    ]

    var body: some View {
        ZStack {
            if isDone {
                VStack(spacing: 16) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 64))
                        .foregroundStyle(.green)
                    Text("All \(screens.count) screenshots captured!")
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
            status = "Capturing \(screens[i].name) (\(i + 1)/\(screens.count))..."

            // Wait for view to render
            try? await Task.sleep(nanoseconds: 800_000_000)
            await takeScreenshot(name: screens[i].name)
        }

        isDone = true
        status = "Done"
    }

    private func takeScreenshot(name: String) async {
        guard let url = URL(string: "http://localhost:3456/screenshot") else {
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
                status = "Error capturing \(name): HTTP \(httpResponse.statusCode)"
            }
        } catch {
            status = "Error capturing \(name): \(error.localizedDescription)"
        }
    }
}

#Preview {
    AutoCaptureView()
}
