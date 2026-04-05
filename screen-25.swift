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
                    Text("Step 10 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 1)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Your Personalized Plan")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("Based on your goals and niche")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                        HStack(spacing: 12) {
                            VStack(alignment: .center, spacing: 4) {
                                Text("30 days")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundStyle(Color(hex: 0xFF2D55))
                                Text("to 10K")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.5))
                            }
                            .padding(16)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 4) {
                                Text("$1.2K")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundStyle(Color(hex: 0x00F2EA))
                                Text("est. revenue")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.5))
                            }
                            .padding(16)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .center, spacing: 4) {
                                Text("5x")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundStyle(Color(hex: 0xFFD700))
                                Text("more views")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.5))
                            }
                            .padding(16)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Daily Check-In")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            ZStack {
                                Rectangle()
                                .foregroundStyle(Color(hex: 0x1C1C1E))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                VStack(spacing: 12) {
                                    HStack(spacing: 12) {
                                        Image(systemName: "sun.max.fill")
                                        .font(.system(size: 20))
                                        .foregroundStyle(Color(hex: 0xFFD700))
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("Today's Focus")
                                            .font(.subheadline)
                                            .fontWeight(.bold)
                                            .foregroundStyle(.white)
                                            Text("Film 2 trending sounds with your twist")
                                            .font(.caption)
                                            .foregroundStyle(.white.opacity(0.5))
                                        }
                                    }
                                    Divider()
                                    HStack(spacing: 12) {
                                        Image(systemName: "clock")
                                        .font(.system(size: 16))
                                        .foregroundStyle(Color(hex: 0xFF2D55))
                                        Text("Best time to post: 7:00 PM")
                                        .font(.caption)
                                        .foregroundStyle(.white.opacity(0.5))
                                    }
                                    HStack(spacing: 12) {
                                        Image(systemName: "music.note")
                                        .font(.system(size: 16))
                                        .foregroundStyle(Color(hex: 0x00F2EA))
                                        Text("Trending sound: \"Espresso\" remix")
                                        .font(.caption)
                                        .foregroundStyle(.white.opacity(0.5))
                                    }
                                }
                                .padding(16)
                            }
                        }
                        VStack(alignment: .leading, spacing: 12) {
                            Text("This Week")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            VStack(spacing: 8) {
                                HStack(spacing: 12) {
                                    Text("M")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    .frame(width: 28, height: 28)
                                    .background(Color(hex: 0xFF2D55))
                                    .clipShape(Circle())
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Hook mastery")
                                        .font(.subheadline)
                                        .fontWeight(.bold)
                                        .foregroundStyle(.white)
                                        Text("Nail the first 3 seconds")
                                        .font(.caption)
                                        .foregroundStyle(.white.opacity(0.4))
                                    }
                                    Spacer()
                                    Image(systemName: "checkmark")
                                    .font(.system(size: 14))
                                    .foregroundStyle(Color(hex: 0x00F2EA))
                                }
                                .padding(14)
                                .background(Color(hex: 0x1C1C1E))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                HStack(spacing: 12) {
                                    Text("T")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    .frame(width: 28, height: 28)
                                    .background(Color(hex: 0xFF2D55))
                                    .clipShape(Circle())
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Trending sounds")
                                        .font(.subheadline)
                                        .fontWeight(.bold)
                                        .foregroundStyle(.white)
                                        Text("Ride the algorithm wave")
                                        .font(.caption)
                                        .foregroundStyle(.white.opacity(0.4))
                                    }
                                    Spacer()
                                    Image(systemName: "play.fill")
                                    .font(.system(size: 12))
                                    .foregroundStyle(.white.opacity(0.3))
                                }
                                .padding(14)
                                .background(Color(hex: 0x1C1C1E))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                HStack(spacing: 12) {
                                    Text("W")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white.opacity(0.4))
                                    .frame(width: 28, height: 28)
                                    .background(.white.opacity(0.1))
                                    .clipShape(Circle())
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Hashtag strategy")
                                        .font(.subheadline)
                                        .foregroundStyle(.white.opacity(0.4))
                                        Text("Reach the right audience")
                                        .font(.caption)
                                        .foregroundStyle(.white.opacity(0.3))
                                    }
                                    Spacer()
                                    Image(systemName: "lock.fill")
                                    .font(.system(size: 12))
                                    .foregroundStyle(.white.opacity(0.2))
                                }
                                .padding(14)
                                .background(Color(hex: 0x1C1C1E))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                }
                VStack {
                    Button("Start My Journey", action: {})
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
