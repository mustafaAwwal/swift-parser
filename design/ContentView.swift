import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView(selection: .constant(0)) {
            Tab("Home", systemImage: "house.fill", value: 0) {
                VStack(spacing: 0) {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 0) {
                            VStack(alignment: .center, spacing: 4) {
                                Picker("", selection: .constant(0)) {
                                    Text("PICKUP").tag(0)
                                    Text("DELIVERY").tag(1)
                                }
                                .pickerStyle(.segmented)
                                Text("LOCATION")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundStyle(.secondary)
                                Text("941 W Randolph St, Chicago, IL, 60607")
                                .font(.caption)
                                .foregroundStyle(.purple)
                                .underline()
                                .multilineTextAlignment(.center)
                            }
                            .padding(12)
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Hey there")
                                .font(.title)
                                .fontWeight(.bold)
                                HStack(spacing: 8) {
                                    HStack(spacing: 4) {
                                        Image(systemName: "envelope.fill")
                                        .font(.system(size: 14))
                                        Text("INBOX")
                                        .fontWeight(.bold)
                                        .font(.caption)
                                    }
                                    Divider()
                                    Text("Log In or Sign Up to get your cravings.")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            ZStack(alignment: .bottomLeading) {
                                Rectangle()
                                .foregroundStyle(.brown.opacity(0.8))
                                .frame(height: 200)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("YOUR PICK.\nIT'S FREE.")
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .foregroundStyle(.white)
                                    Text("Join Taco Bell® Rewards and choose a\nfree welcome reward from this\ncraveable lineup.")
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.9))
                                    Button("JOIN REWARDS", action: {})
                                    .btnText()
                                    .fontWeight(.bold)
                                    .font(.caption)
                                    .foregroundStyle(.white)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(.black)
                                    .clipShape(RoundedRectangle(cornerRadius: 4))
                                }
                                .padding(16)
                            }
                            .padding(.horizontal, 16)
                            VStack(alignment: .center, spacing: 12) {
                                ZStack {
                                    Circle()
                                    .stroke(.orange, lineWidth: 6)
                                    .frame(width: 150, height: 150)
                                    VStack(alignment: .center, spacing: 2) {
                                        Text("$1")
                                        .font(.system(size: 32))
                                        .fontWeight(.bold)
                                        Text("= 10 points*")
                                        .font(.system(size: 14))
                                        .fontWeight(.bold)
                                    }
                                }
                                Text("1. EARN POINTS FOR FREE FOOD")
                                .fontWeight(.bold)
                                .font(.system(size: 15))
                                Text("Rack up points with every qualifying order on the app, drive-thru, or kiosk. Celebrate every 250 points with a free reward.")
                                .multilineTextAlignment(.center)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            }
                            .padding(24)
                        }
                    }
                    Button("START ORDER", action: {})
                    .btnText()
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .font(.system(size: 16))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color(hex: 0x520080))
                    .clipShape(RoundedRectangle(cornerRadius: 28))
                    .padding(.horizontal, 16)
                    .padding(.bottom, 8)
                }
            }
            Tab("Menu", systemImage: "menucard", value: 1) {
                Text("")
            }
            Tab("Rewards", systemImage: "star", value: 2) {
                Text("")
            }
            Tab("Check In", systemImage: "mappin.and.ellipse", value: 3) {
                Text("")
            }
            Tab("Profile", systemImage: "person", value: 4) {
                Text("")
            }
        }
        .tint(Color(hex: 0x520080))
    }
}

#Preview {
    ContentView()
}
