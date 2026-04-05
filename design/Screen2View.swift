import SwiftUI

struct Screen2View: View {
    var body: some View {
        ZStack {
            Rectangle()
            .foregroundStyle(.purple)
            .ignoresSafeArea()
            VStack(alignment: .center, spacing: 24) {
                Spacer()
                ZStack {
                    Image(systemName: "iphone.badge.play")
                    .font(.system(size: 56))
                    .foregroundStyle(.white)
                }
                VStack(alignment: .center, spacing: 8) {
                    Text("HUNGRY FOR")
                    .font(.system(size: 32))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    Text("UPDATES?")
                    .font(.system(size: 32))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                }
                Text("Turn on notifications to stay informed about exclusive Taco Bell offers, events, and new menu items.")
                .foregroundStyle(.white.opacity(0.9))
                .multilineTextAlignment(.center)
                .font(.system(size: 16))
                VStack(spacing: 12) {
                    Text("OK, LET'S GO")
                    .font(.system(size: 14))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(.black.opacity(0.3))
                    .clipShape(RoundedRectangle(cornerRadius: 28))
                    Text("NOT NOW")
                    .font(.system(size: 14))
                    .fontWeight(.bold)
                    .foregroundStyle(.purple)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 28))
                }
                .frame(maxWidth: .infinity)
                Spacer()
                Text("Taco Bell will use notifications to facilitate mobile orders and to send you local deals, rewards, and news as described in our Privacy Statement and US Privacy Notice.")
                .font(.system(size: 11))
                .foregroundStyle(.white.opacity(0.7))
                .multilineTextAlignment(.center)
                .padding(16)
            }
            .padding(.horizontal, 32)
        }
    }
}

#Preview {
    Screen2View()
}
