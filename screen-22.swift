import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            Rectangle()
            .foregroundStyle(Color(hex: 0x0F0F0F))
            .ignoresSafeArea()
            VStack(spacing: 0) {
                HStack {
                    Image(systemName: "chevron.left")
                    .font(.system(size: 18))
                    .foregroundStyle(.white)
                    Spacer()
                    Text("Step 7 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.7)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("What's holding\nyou back?")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("Select all that apply")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                        VStack(spacing: 12) {
                            HStack(spacing: 14) {
                                Image(systemName: "lightbulb.slash.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(Color(hex: 0xFF2D55))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("No content ideas")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Staring at a blank screen")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 22))
                                .foregroundStyle(Color(hex: 0xFF2D55))
                            }
                            .padding(16)
                            .background(Color(hex: 0xFF2D55).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: 0xFF2D55), lineWidth: 1))
                            HStack(spacing: 14) {
                                Image(systemName: "eye.slash.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(Color(hex: 0xFF2D55))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Low views")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Nobody's seeing my content")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 22))
                                .foregroundStyle(Color(hex: 0xFF2D55))
                            }
                            .padding(16)
                            .background(Color(hex: 0xFF2D55).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: 0xFF2D55), lineWidth: 1))
                            HStack(spacing: 14) {
                                Image(systemName: "bubble.left.and.bubble.right")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("No engagement")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Likes and comments are dead")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Circle()
                                .stroke(.white.opacity(0.2), lineWidth: 1.5)
                                .frame(width: 22, height: 22)
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack(spacing: 14) {
                                Image(systemName: "bolt.slash.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Can't go viral")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Stuck at the same level")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Circle()
                                .stroke(.white.opacity(0.2), lineWidth: 1.5)
                                .frame(width: 22, height: 22)
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack(spacing: 14) {
                                Image(systemName: "chart.line.downtrend.xyaxis")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Don't know trends")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Always late to the wave")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Circle()
                                .stroke(.white.opacity(0.2), lineWidth: 1.5)
                                .frame(width: 22, height: 22)
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack(spacing: 14) {
                                Image(systemName: "battery.25percent")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Burnout")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Content creation feels like a chore")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Circle()
                                .stroke(.white.opacity(0.2), lineWidth: 1.5)
                                .frame(width: 22, height: 22)
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                    .padding(.horizontal, 20)
                }
                VStack {
                    Button("Continue", action: {})
                    .cta()
                    .tint(Color(hex: 0xFF2D55))
                }
                .padding(.horizontal, 20)
            }
        }
    }
}

#Preview {
    ContentView()
}
