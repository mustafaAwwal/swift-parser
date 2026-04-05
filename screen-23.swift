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
                    Text("Step 8 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.8)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Upload a TikTok\nfor AI analysis")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("We'll analyze your style and give tips")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                        ZStack {
                            Rectangle()
                            .foregroundStyle(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            Rectangle()
                            .stroke(.white.opacity(0.1), lineWidth: 1)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            VStack(alignment: .center, spacing: 16) {
                                ZStack {
                                    Circle()
                                    .foregroundStyle(Color(hex: 0xFF2D55).opacity(0.15))
                                    .frame(width: 72, height: 72)
                                    Image(systemName: "arrow.up.circle.fill")
                                    .font(.system(size: 36))
                                    .foregroundStyle(Color(hex: 0xFF2D55))
                                }
                                VStack(alignment: .center, spacing: 4) {
                                    Text("Tap to upload")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("MP4, MOV up to 3 min")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.4))
                                }
                            }
                            .padding(.vertical, 40)
                        }
                        VStack(alignment: .leading, spacing: 12) {
                            Text("What we'll analyze")
                            .font(.caption)
                            .fontWeight(.bold)
                            .foregroundStyle(.white.opacity(0.4))
                            HStack(spacing: 12) {
                                Image(systemName: "waveform")
                                .font(.system(size: 16))
                                .foregroundStyle(Color(hex: 0x00F2EA))
                                Text("Hook strength (first 3 sec)")
                                .font(.subheadline)
                                .foregroundStyle(.white)
                            }
                            HStack(spacing: 12) {
                                Image(systemName: "text.alignleft")
                                .font(.system(size: 16))
                                .foregroundStyle(Color(hex: 0x00F2EA))
                                Text("Caption & hashtag quality")
                                .font(.subheadline)
                                .foregroundStyle(.white)
                            }
                            HStack(spacing: 12) {
                                Image(systemName: "music.note")
                                .font(.system(size: 16))
                                .foregroundStyle(Color(hex: 0x00F2EA))
                                Text("Sound & trend alignment")
                                .font(.subheadline)
                                .foregroundStyle(.white)
                            }
                            HStack(spacing: 12) {
                                Image(systemName: "clock")
                                .font(.system(size: 16))
                                .foregroundStyle(Color(hex: 0x00F2EA))
                                Text("Posting time optimization")
                                .font(.subheadline)
                                .foregroundStyle(.white)
                            }
                        }
                        Text("Skip for now")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.4))
                        .frame(maxWidth: .infinity, alignment: .center)
                    }
                    .padding(.horizontal, 20)
                }
                VStack {
                    Button("Upload Video", action: {})
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
