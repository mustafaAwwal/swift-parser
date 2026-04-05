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
                    Text("Step 6 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.6)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("How often do\nyou post?")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("Be honest — we won't judge")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                        VStack(spacing: 12) {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Every day")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Consistent machine")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "flame.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(Color(hex: 0xFF2D55))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("3–5 times a week")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Solid rhythm")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "checkmark.seal.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(Color(hex: 0x00F2EA))
                            }
                            .padding(16)
                            .background(Color(hex: 0x00F2EA).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: 0x00F2EA), lineWidth: 1))
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("1–2 times a week")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Getting there")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "hand.thumbsup.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("A few times a month")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Room to grow")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "tortoise.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Rarely")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("We'll fix that")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "moon.zzz.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
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
