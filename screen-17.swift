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
                    Text("Step 2 of 10")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.4))
                    Spacer()
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 8)
                ProgressView(value: 0.2)
                .tint(Color(hex: 0xFF2D55))
                .padding(.horizontal, 20)
                .padding(.top, 4)
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("What do you want\nto achieve?")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("Select all that apply")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.4))
                        }
                        VStack(spacing: 12) {
                            HStack(spacing: 14) {
                                Image(systemName: "person.3.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(Color(hex: 0xFF2D55))
                                Text("Grow my followers")
                                .font(.subheadline)
                                .foregroundStyle(.white)
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
                                Image(systemName: "dollarsign.circle.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(Color(hex: 0x00F2EA))
                                Text("Make money from content")
                                .font(.subheadline)
                                .foregroundStyle(.white)
                                Spacer()
                                Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 22))
                                .foregroundStyle(Color(hex: 0x00F2EA))
                            }
                            .padding(16)
                            .background(Color(hex: 0x00F2EA).opacity(0.15))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: 0x00F2EA), lineWidth: 1))
                            HStack(spacing: 14) {
                                Image(systemName: "bolt.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Go viral")
                                .font(.subheadline)
                                .foregroundStyle(.white)
                                Spacer()
                                Circle()
                                .stroke(.white.opacity(0.2), lineWidth: 1.5)
                                .frame(width: 22, height: 22)
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack(spacing: 14) {
                                Image(systemName: "briefcase.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Get brand deals")
                                .font(.subheadline)
                                .foregroundStyle(.white)
                                Spacer()
                                Circle()
                                .stroke(.white.opacity(0.2), lineWidth: 1.5)
                                .frame(width: 22, height: 22)
                            }
                            .padding(16)
                            .background(Color(hex: 0x1C1C1E))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            HStack(spacing: 14) {
                                Image(systemName: "heart.fill")
                                .font(.system(size: 20))
                                .foregroundStyle(.white.opacity(0.4))
                                Text("Build a community")
                                .font(.subheadline)
                                .foregroundStyle(.white)
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
