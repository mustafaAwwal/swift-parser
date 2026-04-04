import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 24) {
            VStack(spacing: 8) {
                Text("About You")
                .fontWeight(.bold)
                .font(.largeTitle)
                Text("Help us personalize your experience.")
                .foregroundStyle(.secondary)
            }
            VStack(spacing: 16) {
                VStack(spacing: 6) {
                    Text("Age")
                    .fontWeight(.bold)
                    .font(.caption)
                    TextField("25", text: .constant(""))
                    .textFieldStyle(.roundedBorder)
                }
                VStack(spacing: 6) {
                    Text("Height")
                    .fontWeight(.bold)
                    .font(.caption)
                    TextField("5 ft 10 in", text: .constant(""))
                    .textFieldStyle(.roundedBorder)
                }
                VStack(spacing: 6) {
                    Text("Current Weight")
                    .fontWeight(.bold)
                    .font(.caption)
                    TextField("165 lbs", text: .constant(""))
                    .textFieldStyle(.roundedBorder)
                }
                VStack(spacing: 6) {
                    Text("Goal Weight")
                    .fontWeight(.bold)
                    .font(.caption)
                    TextField("150 lbs", text: .constant(""))
                    .textFieldStyle(.roundedBorder)
                }
            }
            Spacer()
            VStack(spacing: 20) {
                CTAButton(label: "Continue")
                HStack(spacing: 6) {
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.gray)
                    .opacity(0.3)
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.gray)
                    .opacity(0.3)
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.gray)
                    .opacity(0.3)
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.blue)
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.gray)
                    .opacity(0.3)
                }
            }
        }
        .padding(24)
    }
}

#Preview {
    ContentView()
}
