import SwiftUI

struct Screen1View: View {
    var body: some View {
        ZStack {
            Rectangle()
            .foregroundStyle(.purple)
            .ignoresSafeArea()
            VStack(alignment: .center, spacing: 24) {
                Spacer()
                ZStack {
                    Image(systemName: "mappin.circle.fill")
                    .font(.system(size: 64))
                    .foregroundStyle(.white)
                }
                VStack(alignment: .center, spacing: 8) {
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
                .foregroundStyle(.white.opacity(0.9))
                .multilineTextAlignment(.center)
                .font(.system(size: 16))
                Text("MAKE YOUR CHOICE")
                .font(.system(size: 14))
                .fontWeight(.bold)
                .foregroundStyle(.white)
                .padding(.horizontal, 32)
                .padding(.vertical, 16)
                .background(.black.opacity(0.3))
                .clipShape(RoundedRectangle(cornerRadius: 28))
                Spacer()
                Text("Taco Bell will use your location to find nearby restaurants, to update pricing with local restaurant menus and availability, to facilitate mobile orders and checking in to your Loyalty account at restaurants, send local deals, news and rewards, and to personalize and localize your experience as described in our Privacy Statement and US Privacy Notice. Location services are required for some features of this App, but you will be otherwise able to use this App with location services disabled.")
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
    Screen1View()
}
