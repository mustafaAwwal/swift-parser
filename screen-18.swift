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
                    Text("Step 3 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.3)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("How many followers\ndo you have?")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("This helps us personalize your plan")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                        VStack(spacing: 12) {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Just starting")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("0 – 1,000 followers")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "seedling")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Growing")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("1K – 10K followers")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "leaf.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(Color(hex: 0xFF2D55))
                            }
                            .padding(16)
                            .background(Color(hex: 0xFF2D55).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: 0xFF2D55), lineWidth: 1))
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Established")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("10K – 100K followers")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "tree.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Influencer")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("100K – 1M followers")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "star.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Celebrity")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("1M+ followers")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                                Spacer()
                                Image(systemName: "crown.fill")
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
