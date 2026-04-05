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
                    Text("Step 4 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.4)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("How much do you want\nto earn monthly?")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("We'll build a roadmap to hit your target")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                        VStack(spacing: 12) {
                            HStack {
                                Text("$500")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                                Text("/mo")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                Spacer()
                                Text("Side hustle")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(.white.opacity(0.06))
                                .clipShape(RoundedRectangle(cornerRadius: 20))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                Text("$1,000")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                                Text("/mo")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                Spacer()
                                Text("Part-time")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(.white.opacity(0.06))
                                .clipShape(RoundedRectangle(cornerRadius: 20))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                Text("$5,000")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundStyle(Color(hex: 0xFF2D55))
                                Text("/mo")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                Spacer()
                                Text("Full-time")
                                .font(.caption)
                                .foregroundStyle(Color(hex: 0xFF2D55))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(Color(hex: 0xFF2D55).opacity(0.15))
                                .clipShape(RoundedRectangle(cornerRadius: 20))
                            }
                            .padding(16)
                            .background(Color(hex: 0xFF2D55).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: 0xFF2D55), lineWidth: 1))
                            HStack {
                                Text("$10,000")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                                Text("/mo")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                Spacer()
                                Text("Pro creator")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(.white.opacity(0.06))
                                .clipShape(RoundedRectangle(cornerRadius: 20))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                Text("$25,000+")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                                Text("/mo")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                Spacer()
                                Text("Top earner")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.4))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(.white.opacity(0.06))
                                .clipShape(RoundedRectangle(cornerRadius: 20))
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
