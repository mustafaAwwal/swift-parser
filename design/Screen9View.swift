import SwiftUI

struct Screen9View: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                HStack {
                    Image(systemName: "chevron.left")
                    .font(.system(size: 18))
                    Spacer()
                    Text("Sign Up")
                    .font(.system(size: 17))
                    .fontWeight(.bold)
                    Spacer()
                    Spacer()
                }
                .padding(16)
                Divider()
                VStack(alignment: .leading, spacing: 20) {
                    Text("*Indicates Required field")
                    .font(.system(size: 13))
                    .foregroundStyle(.gray)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Email Address")
                        .font(.system(size: 11))
                        .foregroundStyle(.gray)
                        Rectangle()
                        .foregroundStyle(.gray.opacity(0.3))
                        .frame(height: 20)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(12)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray.opacity(0.3)))
                    VStack(alignment: .leading, spacing: 4) {
                        Text("*First Name")
                        .font(.system(size: 14))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(16)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray.opacity(0.3)))
                    VStack(alignment: .leading, spacing: 4) {
                        Text("*Last Name")
                        .font(.system(size: 14))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(16)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray.opacity(0.3)))
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Birthday (MM/DD)")
                        .font(.system(size: 14))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(16)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray.opacity(0.3)))
                    Text("Adding your birthday is optional and may also be done in your profile later. It cannot be changed once submitted.")
                    .font(.system(size: 12))
                    .foregroundStyle(.gray)
                    HStack(alignment: .top, spacing: 12) {
                        Rectangle()
                        .stroke(.gray)
                        .frame(width: 24, height: 24)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
                        Text("Be among the first to get a taste of Taco Bell news, offers and information via email.")
                        .font(.system(size: 14))
                    }
                    HStack(alignment: .top, spacing: 12) {
                        Rectangle()
                        .stroke(.gray)
                        .frame(width: 24, height: 24)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
                        Text("*I agree to the Terms of Use and Privacy Policy. California users, please see our California Privacy Notice for our Notice of Financial Incentive.")
                        .font(.system(size: 14))
                    }
                    Text("CONFIRM")
                    .font(.system(size: 14))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(.gray)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    Text("CANCEL")
                    .font(.system(size: 14))
                    .fontWeight(.bold)
                    .foregroundStyle(.purple)
                    .underline()
                    .frame(maxWidth: .infinity)
                    Text("Welcome Reward valid for 14 days from issuance and redeemable once for Reward Members only via the app at participating U.S. Taco Bell® locations, while supplies last. Limit 1 per registered user. Must make selections from predetermined menu items. No product or ingredient substitutions, upgrades or add-ons. Reward nontransferable and cannot be combined with other offers. No cash value. Terms apply: ta.co/terms.")
                    .font(.system(size: 11))
                    .foregroundStyle(.gray)
                }
                .padding(20)
            }
        }
    }
}

#Preview {
    Screen9View()
}
