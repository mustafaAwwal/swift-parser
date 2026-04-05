import SwiftUI

struct Screen9View: View {
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Image(systemName: "chevron.left")
                .font(.system(size: 20))
                Spacer()
                Text("Sign Up")
                .font(.system(size: 18))
                .fontWeight(.bold)
                Spacer()
                Rectangle()
                .foregroundStyle(.clear)
                .frame(width: 24)
            }
            .padding(16)
            Divider()
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("*Indicates Required field")
                    .font(.system(size: 14))
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Email Address")
                        .font(.system(size: 12))
                        .foregroundStyle(.purple)
                        Rectangle()
                        .foregroundStyle(.gray.opacity(0.15))
                        .frame(height: 44)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(.purple, lineWidth: 1))
                    }
                    TextField("*First Name", text: .constant(""))
                    .textFieldStyle(.roundedBorder)
                    .padding(12)
                    .frame(maxWidth: .infinity)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray.opacity(0.3), lineWidth: 1))
                    TextField("*Last Name", text: .constant(""))
                    .textFieldStyle(.roundedBorder)
                    .padding(12)
                    .frame(maxWidth: .infinity)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray.opacity(0.3), lineWidth: 1))
                    TextField("Birthday (MM/DD)", text: .constant(""))
                    .textFieldStyle(.roundedBorder)
                    .padding(12)
                    .frame(maxWidth: .infinity)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.gray.opacity(0.3), lineWidth: 1))
                    Text("Adding your birthday is optional and may also be done in your profile later. It cannot be changed once submitted.")
                    .font(.system(size: 12))
                    .foregroundStyle(.gray)
                    HStack(alignment: .top, spacing: 12) {
                        RoundedRectangle(cornerRadius: 4)
                        .stroke(.gray, lineWidth: 1)
                        .frame(width: 24, height: 24)
                        Text("Be among the first to get a taste of Taco Bell news, offers and information via email.")
                        .font(.system(size: 14))
                    }
                    HStack(alignment: .top, spacing: 12) {
                        RoundedRectangle(cornerRadius: 4)
                        .stroke(.gray, lineWidth: 1)
                        .frame(width: 24, height: 24)
                        Text("*I agree to the Terms of Use and Privacy Policy. California users, please see our California Privacy Notice for our Notice of Financial Incentive.")
                        .font(.system(size: 14))
                    }
                    Text("CONFIRM")
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .font(.system(size: 14))
                    .frame(maxWidth: .infinity)
                    .padding(14)
                    .background(.gray)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    Text("CANCEL")
                    .fontWeight(.bold)
                    .foregroundStyle(.purple)
                    .font(.system(size: 14))
                    .frame(maxWidth: .infinity)
                    .underline()
                    Text("Welcome Reward valid for 14 days from issuance and redeemable once for Reward Members only via the app at participating U.S. Taco Bell® locations, while supplies last. Limit 1 per registered user. Must make selections from predetermined menu items. No product or ingredient substitutions, upgrades or add-ons. Reward nontransferable and cannot be combined with other offers. No cash value. Terms apply: ta.co/terms.")
                    .font(.system(size: 11))
                    .foregroundStyle(.gray)
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 16)
            }
        }
    }
}

#Preview {
    Screen9View()
}
