import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            Rectangle()
            .foregroundStyle(Color(hex: 0x7B2FBE))
            .ignoresSafeArea()
            VStack(alignment: .center) {
                Spacer()
                VStack(alignment: .center, spacing: 16) {
                    Image(systemName: "bell.badge.fill")
                    .font(.system(size: 48))
                    .foregroundStyle(.white)
                    Text("HUNGRY FOR\nUPDATES?")
                    .font(.system(size: 34))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .multilineTextAlignment(.center)
                    Text("Turn on notifications to stay informed about exclusive Taco Bell offers, events, and new menu items.")
                    .foregroundStyle(.white.opacity(0.9))
                    .multilineTextAlignment(.center)
                    .font(.callout)
                }
                VStack(spacing: 12) {
                    Button("OK, LET'S GO", action: {})
                    .btnText()
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .font(.system(size: 15))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color(hex: 0x520080))
                    Button("NOT NOW", action: {})
                    .btnText()
                    .fontWeight(.bold)
                    .foregroundStyle(.black)
                    .font(.system(size: 15))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(.white)
                }
                .padding(.horizontal, 24)
                .padding(.top, 24)
                Spacer()
                Text("Taco Bell will use notifications to facilitate mobile orders and to send you local deals, rewards, and news as described in our Privacy Statement and US Privacy Notice.")
                .foregroundStyle(Color(hex: 0x520080))
                .font(.caption)
                .multilineTextAlignment(.center)
            }
            .padding(24)
        }
    }
}

#Preview {
    ContentView()
}
