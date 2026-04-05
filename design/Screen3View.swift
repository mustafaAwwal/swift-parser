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
                .font(.system(size: 64))
                .foregroundStyle(.white)
                VStack(alignment: .center, spacing: 8) {
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
                Text("Taco Bell would like your permission to share your data in order to show you ads tailored to you as described in our Notice of Financial Incentive, Privacy Statement and US Privacy Notice. You do not have to opt in to use this app.")
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
    Screen3View()
}
