import SwiftUI

struct Screen6View: View {
    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                Rectangle()
                .foregroundStyle(.purple)
                .frame(height: 200)
                .ignoresSafeArea()
                VStack(spacing: 12) {
                    HStack {
                        Image(systemName: "chevron.left")
                        .foregroundStyle(.white)
                        .font(.system(size: 20))
                        Spacer()
                    }
                    Text("Rewards")
                    .font(.system(size: 14))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 6)
                    .overlay(Capsule().stroke(.white, lineWidth: 2))
                    Text("Sign up to")
                    .font(.system(size: 28))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    Text("earn rewards.")
                    .font(.system(size: 28))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                }
                .padding(16)
            }
            Rectangle()
            .foregroundStyle(.orange.opacity(0.3))
            .frame(height: 180)
            VStack(alignment: .center, spacing: 16) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Email Address")
                    .font(.system(size: 12))
                    .foregroundStyle(.purple)
                    Rectangle()
                    .foregroundStyle(.clear)
                    .frame(height: 40)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.purple, lineWidth: 2))
                }
                Text("SIGN UP NOW")
                .fontWeight(.bold)
                .foregroundStyle(.black)
                .font(.system(size: 14))
                .frame(maxWidth: .infinity)
                .padding(14)
                .background(.gray.opacity(0.2))
                .clipShape(RoundedRectangle(cornerRadius: 8))
                Text("OR")
                .font(.system(size: 12))
                .foregroundStyle(.gray)
                HStack(spacing: 8) {
                    Image(systemName: "apple.logo")
                    .foregroundStyle(.black)
                    Text("Sign In With Apple")
                    .font(.system(size: 14))
                    .fontWeight(.bold)
                }
                .frame(maxWidth: .infinity)
                .padding(14)
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(.black, lineWidth: 1))
                VStack(spacing: 4) {
                    Text("ALREADY HAVE A TACO BELL ACCOUNT?")
                    .font(.system(size: 11))
                    .tracking(1)
                    Text("LOG IN")
                    .font(.system(size: 14))
                    .fontWeight(.bold)
                    .foregroundStyle(.purple)
                    .underline()
                }
                Text("BY CREATING AN ACCOUNT, YOU AGREE TO OUR REWARDS TERMS AND THE TACO BELL TERMS OF USE, AND THAT YOU HAVE READ THE TACO BELL PRIVACY POLICY INCLUDING THE US NOTICE AND NOTICE OF FINANCIAL INCENTIVE LOCATED...")
                .font(.system(size: 10))
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
            }
            .padding(.horizontal, 24)
            .padding(.top, 24)
            Spacer()
        }
    }
}

#Preview {
    Screen6View()
}
