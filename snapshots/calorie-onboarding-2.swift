import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            ZStack {
                Image(systemName: "circle.fill")
                .font(.system(size: 200))
                .foregroundStyle(.orange)
                .opacity(0.12)
                Image(systemName: "circle.fill")
                .font(.system(size: 150))
                .foregroundStyle(.orange)
                .opacity(0.2)
                Image(systemName: "circle.fill")
                .font(.system(size: 90))
                .foregroundStyle(.orange)
                .opacity(0.4)
                Image(systemName: "fork.knife")
                .font(.system(size: 44))
                .foregroundStyle(.white)
            }
            Spacer()
            VStack(spacing: 12) {
                Text("Log Meals")
                .fontWeight(.bold)
                .font(.largeTitle)
                Text("In Seconds")
                .fontWeight(.bold)
                .font(.largeTitle)
                .foregroundStyle(.orange)
                Text("Snap a photo or search from over 1 million foods. AI does the rest.")
                .foregroundStyle(.secondary)
                .font(.body)
                .multilineTextAlignment(.center)
            }
            Spacer()
            VStack(spacing: 20) {
                Button(action: {}) {
                    Text("Continue")
                        .fontWeight(.semibold)
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                HStack(spacing: 6) {
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.gray)
                    .opacity(0.3)
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.orange)
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.gray)
                    .opacity(0.3)
                }
            }
        }
        .padding(32)
    }
}

#Preview {
    ContentView()
}
