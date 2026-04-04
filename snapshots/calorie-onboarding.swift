import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            ZStack {
                Image(systemName: "circle.fill")
                .font(.system(size: 200))
                .foregroundStyle(.green)
                .opacity(0.12)
                Image(systemName: "circle.fill")
                .font(.system(size: 150))
                .foregroundStyle(.green)
                .opacity(0.2)
                Image(systemName: "circle.fill")
                .font(.system(size: 90))
                .foregroundStyle(.green)
                .opacity(0.4)
                Image(systemName: "flame.fill")
                .font(.system(size: 44))
                .foregroundStyle(.white)
            }
            Spacer()
            VStack(spacing: 12) {
                Text("Track Your")
                .fontWeight(.bold)
                .font(.largeTitle)
                Text("Calories")
                .fontWeight(.bold)
                .font(.largeTitle)
                .foregroundStyle(.green)
                Text("Effortlessly log meals, track macros, and hit your health goals every day.")
                .foregroundStyle(.secondary)
                .font(.body)
                .multilineTextAlignment(.center)
            }
            Spacer()
            VStack(spacing: 20) {
                CTAButton(label: "Get Started")
                HStack(spacing: 6) {
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.green)
                    Image(systemName: "circle.fill")
                    .font(.system(size: 8))
                    .foregroundStyle(.gray)
                    .opacity(0.3)
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
