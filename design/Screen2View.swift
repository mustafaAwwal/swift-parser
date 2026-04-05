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
                    Image(systemName: "iphone")
                    .font(.system(size: 50))
                    .foregroundStyle(.white)
                    Text("2")
                    .font(.system(size: 14))
                    .fontWeight(.bold)
                    .foregroundStyle(.purple)
                    .padding(6)
                    .background(.white)
                    .clipShape(Circle())
                    .offset(x: 20, y: -20)
                }
                VStack(spacing: 8) {
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
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
                VStack(spacing: 16) {
                    Text("OK, LET'S GO")
                    .fontWeight(.bold)
                    .foregroundStyle(.purple)
                    .font(.system(size: 16))
                    .frame(maxWidth: .infinity)
                    .padding(16)
                    .background(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    Text("NOT NOW")
                    .fontWeight(.bold)
                    .foregroundStyle(.purple)
                    .font(.system(size: 16))
                    .frame(maxWidth: .infinity)
                    .padding(16)
                    .background(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                .padding(.horizontal, 48)
                Spacer()
                Text("Taco Bell will use notifications to facilitate mobile orders and to send you local deals, rewards, and news as described in our Privacy Statement and US Privacy Notice.")
                .font(.system(size: 12))
                .foregroundStyle(.white.opacity(0.8))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
            }
            .padding(16)
        }
    }
}

#Preview {
    Screen2View()
}
