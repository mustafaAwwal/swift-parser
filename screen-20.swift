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
                    Text("Step 5 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.5)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("What do you\npost about?")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("Pick your main niches")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "face.smiling.inverse")
                                .font(.system(size: 28))
                                .foregroundStyle(Color(hex: 0xFFD700))
                                Text("Comedy")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0xFFD700).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: 0xFFD700), lineWidth: 1))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "figure.dance")
                                .font(.system(size: 28))
                                .foregroundStyle(Color(hex: 0xFF2D55))
                                Text("Dance")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0xFF2D55).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: 0xFF2D55), lineWidth: 1))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "book.fill")
                                .font(.system(size: 28))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Education")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "fork.knife")
                                .font(.system(size: 28))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Food")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "tshirt.fill")
                                .font(.system(size: 28))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Fashion")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "figure.run")
                                .font(.system(size: 28))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Fitness")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "desktopcomputer")
                                .font(.system(size: 28))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Tech")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "sparkles")
                                .font(.system(size: 28))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Beauty")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "airplane")
                                .font(.system(size: 28))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Travel")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 8) {
                                Image(systemName: "gamecontroller.fill")
                                .font(.system(size: 28))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Gaming")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            .padding(.vertical, 20)
                            .frame(maxWidth: .infinity)
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
