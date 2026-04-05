import SwiftUI

struct Screen3View: View {
    var body: some View {
        ZStack {
            Rectangle()
            .foregroundStyle(.purple)
            .ignoresSafeArea()
            VStack(alignment: .center, spacing: 24) {
                Spacer()
                Image(systemName: "flame.fill")
                .font(.system(size: 60))
                .foregroundStyle(.white)
                VStack(spacing: 8) {
                    Text("KEEP US IN")
                    .font(.system(size: 32))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    Text("THE LOOP")
                    .font(.system(size: 32))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                }
                Text("Turn on tracking to receive personalized offers and updates based on your dining preferences.")
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
                Text("Taco Bell would like your permission to share your data in order to show you ads tailored to you as described in our Notice of Financial Incentive, Privacy Statement and US Privacy Notice. You do not have to opt in to use this app.")
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
    Screen3View()
}
