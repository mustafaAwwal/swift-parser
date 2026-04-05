import SwiftUI

struct Screen4View: View {
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                HStack(spacing: 0) {
                    Text("PICKUP")
                    .font(.system(size: 11))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 4))
                    Text("DELIVERY")
                    .font(.system(size: 11))
                    .fontWeight(.bold)
                    .foregroundStyle(.black)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.2))
                    .clipShape(RoundedRectangle(cornerRadius: 4))
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text("LOCATION")
                    .font(.system(size: 9))
                    .foregroundStyle(.gray)
                    Text("941 W Randolph St, Chicago, IL 60607")
                    .font(.system(size: 11))
                    .fontWeight(.bold)
                    .underline()
                }
            }
            .padding(16)
            VStack(alignment: .leading, spacing: 8) {
                Text("Hey there")
                .font(.system(size: 24))
                .fontWeight(.bold)
                HStack(spacing: 8) {
                    HStack(spacing: 4) {
                        Image(systemName: "envelope.fill")
                        .font(.system(size: 14))
                        Text("INBOX")
                        .font(.system(size: 12))
                        .fontWeight(.bold)
                    }
                    Text("|")
                    .foregroundStyle(.gray)
                    Text("Log In")
                    .font(.system(size: 12))
                    .foregroundStyle(.purple)
                    Text("or")
                    .font(.system(size: 12))
                    .foregroundStyle(.gray)
                    Text("Sign Up")
                    .font(.system(size: 12))
                    .foregroundStyle(.purple)
                    Text("to get your cravings.")
                    .font(.system(size: 12))
                    .foregroundStyle(.gray)
                }
            }
            .padding(.horizontal, 16)
            ZStack {
                Rectangle()
                .foregroundStyle(.gray.opacity(0.3))
                .frame(height: 160)
                HStack {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("YOUR PICK.")
                        .font(.system(size: 22))
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                        Text("IT'S FREE.")
                        .font(.system(size: 22))
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                        Text("Join Taco Bell® Rewards and choose a free welcome reward from this craveable lineup.")
                        .font(.system(size: 11))
                        .foregroundStyle(.white.opacity(0.8))
                        Text("JOIN REWARDS")
                        .font(.system(size: 11))
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(.black)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
                    }
                    .padding(16)
                    Spacer()
                }
            }
            .padding(.horizontal, 16)
            ZStack {
                Rectangle()
                .foregroundStyle(.purple.opacity(0.9))
                .clipShape(RoundedRectangle(cornerRadius: 16))
                VStack(alignment: .center, spacing: 8) {
                    HStack(alignment: .center, spacing: 4) {
                        Text("$")
                        .font(.system(size: 20))
                        .foregroundStyle(.white)
                        Text("1")
                        .font(.system(size: 48))
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                    }
                    Text("= 10 points*")
                    .font(.system(size: 16))
                    .foregroundStyle(.white)
                }
                .padding(24)
            }
            .frame(height: 140)
            .padding(.horizontal, 16)
            .padding(.top, 16)
            VStack(alignment: .center, spacing: 8) {
                Text("1. EARN POINTS FOR FREE FOOD")
                .font(.system(size: 14))
                .fontWeight(.bold)
                Text("Rack up points with every qualifying order on the app, drive-thru, or kiosk. Celebrate every 250 points with a free reward.")
                .font(.system(size: 13))
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 16)
            Spacer()
            Text("START ORDER")
            .font(.system(size: 14))
            .fontWeight(.bold)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(.purple)
            .padding(.horizontal, 16)
            HStack {
                VStack(alignment: .center, spacing: 4) {
                    Image(systemName: "house.fill")
                    .font(.system(size: 20))
                    .foregroundStyle(.purple)
                    Text("Home")
                    .font(.system(size: 10))
                    .foregroundStyle(.purple)
                }
                .frame(maxWidth: .infinity)
                VStack(alignment: .center, spacing: 4) {
                    Image(systemName: "menucard")
                    .font(.system(size: 20))
                    .foregroundStyle(.gray)
                    Text("Menu")
                    .font(.system(size: 10))
                    .foregroundStyle(.gray)
                }
                .frame(maxWidth: .infinity)
                VStack(alignment: .center, spacing: 4) {
                    Image(systemName: "star")
                    .font(.system(size: 20))
                    .foregroundStyle(.gray)
                    Text("Rewards")
                    .font(.system(size: 10))
                    .foregroundStyle(.gray)
                }
                .frame(maxWidth: .infinity)
                VStack(alignment: .center, spacing: 4) {
                    Image(systemName: "checkmark.circle")
                    .font(.system(size: 20))
                    .foregroundStyle(.gray)
                    Text("Check In")
                    .font(.system(size: 10))
                    .foregroundStyle(.gray)
                }
                .frame(maxWidth: .infinity)
                VStack(alignment: .center, spacing: 4) {
                    Image(systemName: "person")
                    .font(.system(size: 20))
                    .foregroundStyle(.gray)
                    Text("Profile")
                    .font(.system(size: 10))
                    .foregroundStyle(.gray)
                }
                .frame(maxWidth: .infinity)
            }
            .padding(.vertical, 8)
        }
    }
}

#Preview {
    Screen4View()
}
