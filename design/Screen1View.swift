import SwiftUI

struct Screen1View: View {
    var body: some View {
        ZStack {
            Rectangle()
            .foregroundStyle(.purple)
            .ignoresSafeArea()
            VStack(alignment: .center, spacing: 24) {
                Spacer()
                Image(systemName: "mappin.circle.fill")
                .font(.system(size: 60))
                .foregroundStyle(.white)
                VStack(spacing: 8) {
                    Text("DROP YOUR")
                    .font(.system(size: 32))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    Text("LOCATION")
                    .font(.system(size: 32))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                }
                Text("We'll hook you up with accurate pricing and show you what's available nearby.")
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
                Text("MAKE YOUR CHOICE")
                .fontWeight(.bold)
                .foregroundStyle(.purple)
                .font(.system(size: 16))
                .padding(16)
                .padding(.horizontal, 24)
                .background(.white)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                Spacer()
                Text("Taco Bell will use your location to find nearby restaurants, to update pricing with local restaurant menus and availability, to facilitate mobile orders and checking in to your Loyalty account at restaurants, send local deals, news and rewards, and to personalize and localize your experience as described in our Privacy Statement and US Privacy Notice. Location services are required for some features of this App, but you will be otherwise able to use this App with location services disabled.")
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
    Screen1View()
}
