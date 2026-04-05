import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(hex: 0x1A0A1E), Color(hex: 0x0F0F0F)], startPoint: .top, endPoint: .bottom)
            .ignoresSafeArea()
            VStack(spacing: 0) {
                HStack {
                    Spacer()
                    Text("Step 1 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.1)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                Spacer()
                VStack(alignment: .center, spacing: 24) {
                    ZStack {
                        Circle()
                        .foregroundStyle(Color(hex: 0xFF2D55).opacity(0.15))
                        .frame(width: 120, height: 120)
                        Circle()
                        .foregroundStyle(Color(hex: 0xFF2D55).opacity(0.3))
                        .frame(width: 90, height: 90)
                        Image(systemName: "flame.fill")
                        .font(.system(size: 44))
                        .foregroundStyle(Color(hex: 0xFF2D55))
                    }
                    VStack(alignment: .center, spacing: 8) {
                        Text("CreatorLab")
                        .font(.system(size: 34))
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                        Text("Your AI-powered path to\nTikTok stardom")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.5))
                        .multilineTextAlignment(.center)
                    }
                    VStack(alignment: .center, spacing: 6) {
                        HStack(spacing: 8) {
                            Image(systemName: "chart.line.uptrend.xyaxis")
                            .font(.system(size: 14))
                            .foregroundStyle(Color(hex: 0x00F2EA))
                            Text("Grow your audience with AI insights")
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.6))
                        }
                        HStack(spacing: 8) {
                            Image(systemName: "dollarsign.circle")
                            .font(.system(size: 14))
                            .foregroundStyle(Color(hex: 0x00F2EA))
                            Text("Monetize your content faster")
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.6))
                        }
                        HStack(spacing: 8) {
                            Image(systemName: "sparkles")
                            .font(.system(size: 14))
                            .foregroundStyle(Color(hex: 0x00F2EA))
                            Text("Go viral with data-driven strategy")
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.6))
                        }
                    }
                    .padding(.top, 8)
                }
                .padding(.horizontal, 32)
                Spacer()
                VStack(spacing: 12) {
                    Button("Get Started", action: {})
                    .cta()
                    .tint(Color(hex: 0xFF2D55))
                    Text("Already have an account? Log in")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    .multilineTextAlignment(.center)
                }
                .padding(.horizontal, 20)
            }
        }
    }
}

#Preview {
    ContentView()
}
