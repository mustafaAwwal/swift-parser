import SwiftUI

struct Screen6View: View {
    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                Rectangle()
                .foregroundStyle(.purple)
                .ignoresSafeArea()
                VStack(alignment: .center, spacing: 12) {
                    HStack {
                        Image(systemName: "chevron.left")
                        .font(.system(size: 18))
                        .foregroundStyle(.white)
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    Text("Rewards")
                    .font(.system(size: 12))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 6)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(.white))
                    VStack(alignment: .center, spacing: 4) {
                        Text("Sign up to")
                        .font(.system(size: 28))
                        .foregroundStyle(.white)
                        Text("earn rewards.")
                        .font(.system(size: 28))
                        .foregroundStyle(.white)
                    }
                }
                .padding(.vertical, 16)
            }
            .frame(height: 180)
            Rectangle()
            .foregroundStyle(.orange.opacity(0.3))
            .frame(height: 180)
            VStack(alignment: .center, spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Email Address")
                    .font(.system(size: 11))
                    .foregroundStyle(.purple)
                    Rectangle()
                    .foregroundStyle(.clear)
                    .frame(height: 1)
                    .overlay(RoundedRectangle(cornerRadius: 0).stroke(.purple, lineWidth: 2))
                }
                .frame(maxWidth: .infinity)
                Text("SIGN UP NOW")
                .font(.system(size: 14))
                .fontWeight(.bold)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(.gray)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                Text("OR")
                .font(.system(size: 12))
                .foregroundStyle(.gray)
                HStack(spacing: 8) {
                    Image(systemName: "apple.logo")
                    .font(.system(size: 16))
                    Text("Sign In With Apple")
                    .font(.system(size: 14))
                    .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(.black))
                VStack(alignment: .center, spacing: 4) {
                    Text("ALREADY HAVE A TACO BELL ACCOUNT?")
                    .font(.system(size: 11))
                    .foregroundStyle(.gray)
                    .tracking(1)
                    Text("LOG IN")
                    .font(.system(size: 12))
                    .fontWeight(.bold)
                    .foregroundStyle(.purple)
                    .underline()
                }
                Text("BY CREATING AN ACCOUNT, YOU AGREE TO OUR REWARDS TERMS AND THE TACO BELL TERMS OF USE, AND THAT YOU HAVE READ THE TACO BELL PRIVACY POLICY INCLUDING THE US NOTICE AND NOTICE OF FINANCIAL INCENTIVE.")
                .font(.system(size: 9))
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
            }
            .padding(24)
            Spacer()
        }
    }
}

#Preview {
    Screen6View()
}
