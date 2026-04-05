import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            Rectangle()
            .foregroundStyle(Color(hex: 0x0F0F0F))
            .ignoresSafeArea()
            VStack(spacing: 0) {
                HStack {
                    Spacer()
                    Text("Step 9 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.9)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                Spacer()
                VStack(alignment: .center, spacing: 32) {
                    ZStack {
                        Circle()
                        .ringTrack(Color(hex: 0xFF2D55), lineWidth: 8)
                        .frame(width: 160, height: 160)
                        Circle()
                        .ring(0.72, Color(hex: 0xFF2D55), lineWidth: 8)
                        .frame(width: 160, height: 160)
                        VStack(alignment: .center, spacing: 4) {
                            Text("72%")
                            .font(.system(size: 36))
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("Analyzing")
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                    }
                    VStack(alignment: .leading, spacing: 16) {
                        HStack(spacing: 12) {
                            Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 20))
                            .foregroundStyle(Color(hex: 0x00F2EA))
                            Text("Profile scanned")
                            .font(.subheadline)
                            .foregroundStyle(.white)
                        }
                        HStack(spacing: 12) {
                            Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 20))
                            .foregroundStyle(Color(hex: 0x00F2EA))
                            Text("Content style identified")
                            .font(.subheadline)
                            .foregroundStyle(.white)
                        }
                        HStack(spacing: 12) {
                            Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 20))
                            .foregroundStyle(Color(hex: 0x00F2EA))
                            Text("Niche competitors analyzed")
                            .font(.subheadline)
                            .foregroundStyle(.white)
                        }
                        HStack(spacing: 12) {
                            Image(systemName: "ellipsis.circle.fill")
                            .font(.system(size: 20))
                            .foregroundStyle(Color(hex: 0xFF2D55))
                            Text("Building your growth plan...")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.5))
                        }
                        HStack(spacing: 12) {
                            Circle()
                            .stroke(.white.opacity(0.15), lineWidth: 1.5)
                            .frame(width: 20, height: 20)
                            Text("Scheduling content calendar")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.3))
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(.horizontal, 32)
                Spacer()
                VStack(alignment: .center, spacing: 8) {
                    Text("This usually takes about 30 seconds")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.3))
                }
                .padding(.horizontal, 20)
            }
        }
    }
}

#Preview {
    ContentView()
}
