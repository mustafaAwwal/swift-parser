import SwiftUI

struct Screen4View: View {
    var body: some View {
        VStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 12) {
                    HStack(spacing: 0) {
                        Text("PICKUP")
                        .font(.system(size: 12))
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                        .padding(8)
                        .padding(.horizontal, 12)
                        .background(.purple)
                        Text("DELIVERY")
                        .font(.system(size: 12))
                        .fontWeight(.bold)
                        .foregroundStyle(.purple)
                        .padding(8)
                        .padding(.horizontal, 12)
                        .background(.white)
                        .overlay(RoundedRectangle(cornerRadius: 0).stroke(.purple, lineWidth: 1))
                    }
                    VStack(alignment: .leading, spacing: 2) {
                        Text("LOCATION")
                        .font(.system(size: 10))
                        .foregroundStyle(.gray)
                        Text("941 W Randolph St, Chicago, IL 60607")
                        .font(.system(size: 12))
                        .fontWeight(.bold)
                        .underline()
                    }
                }
                VStack(alignment: .leading, spacing: 4) {
                    Text("Hey there")
                    .font(.system(size: 24))
                    .fontWeight(.bold)
                    HStack(spacing: 8) {
                        Image(systemName: "envelope.fill")
                        .foregroundStyle(.purple)
                        Text("INBOX")
                        .font(.system(size: 12))
                        .fontWeight(.bold)
                        Text("|")
                        .foregroundStyle(.gray)
                        Text("Log In")
                        .foregroundStyle(.purple)
                        .font(.system(size: 14))
                        Text("or")
                        .font(.system(size: 14))
                        .foregroundStyle(.gray)
                        Text("Sign Up")
                        .foregroundStyle(.purple)
                        .font(.system(size: 14))
                        Text("to get your cravings.")
                        .font(.system(size: 14))
                        .foregroundStyle(.gray)
                    }
                }
            }
            .padding(16)
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    ZStack(alignment: .bottomLeading) {
                        Rectangle()
                        .foregroundStyle(.brown.opacity(0.6))
                        .frame(height: 180)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        VStack(alignment: .leading, spacing: 8) {
                            Text("YOUR PICK.")
                            .font(.system(size: 24))
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("IT'S FREE.")
                            .font(.system(size: 24))
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            Text("Join Taco Bell® Rewards and choose a free  welcome reward from  this craveable lineup.")
                            .font(.system(size: 12))
                            .foregroundStyle(.white)
                            Text("JOIN REWARDS")
                            .font(.system(size: 12))
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                            .padding(10)
                            .background(.black)
                            .clipShape(RoundedRectangle(cornerRadius: 4))
                        }
                        .padding(16)
                    }
                    .padding(.horizontal, 16)
                    ZStack(alignment: .center) {
                        Rectangle()
                        .foregroundStyle(.indigo)
                        .frame(height: 160)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        VStack(spacing: 8) {
                            HStack(spacing: 4) {
                                Text("$")
                                .font(.system(size: 20))
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                                Text("1")
                                .font(.system(size: 48))
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            }
                            Text("= 10 points*")
                            .font(.system(size: 16))
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                        }
                    }
                    .padding(.horizontal, 16)
                    VStack(alignment: .center, spacing: 8) {
                        Text("1. EARN POINTS FOR FREE FOOD")
                        .font(.system(size: 16))
                        .fontWeight(.bold)
                        Text("Rack up points with every qualifying order on the app, drive-thru, or kiosk. Celebrate every 250 points with a free reward.")
                        .font(.system(size: 14))
                        .foregroundStyle(.gray)
                        .multilineTextAlignment(.center)
                    }
                    .padding(.horizontal, 16)
                }
            }
            Spacer()
            Text("START ORDER")
            .fontWeight(.bold)
            .foregroundStyle(.white)
            .font(.system(size: 16))
            .frame(maxWidth: .infinity)
            .padding(16)
            .background(.purple)
            HStack {
                VStack(spacing: 4) {
                    Image(systemName: "house.fill")
                    .foregroundStyle(.purple)
                    Text("Home")
                    .font(.system(size: 10))
                    .foregroundStyle(.purple)
                }
                Spacer()
                VStack(spacing: 4) {
                    Image(systemName: "menucard")
                    .foregroundStyle(.gray)
                    Text("Menu")
                    .font(.system(size: 10))
                    .foregroundStyle(.gray)
                }
                Spacer()
                VStack(spacing: 4) {
                    Image(systemName: "star.fill")
                    .foregroundStyle(.gray)
                    Text("Rewards")
                    .font(.system(size: 10))
                    .foregroundStyle(.gray)
                }
                Spacer()
                VStack(spacing: 4) {
                    Image(systemName: "checkmark.circle")
                    .foregroundStyle(.gray)
                    Text("Check In")
                    .font(.system(size: 10))
                    .foregroundStyle(.gray)
                }
                Spacer()
                VStack(spacing: 4) {
                    Image(systemName: "person")
                    .foregroundStyle(.gray)
                    Text("Profile")
                    .font(.system(size: 10))
                    .foregroundStyle(.gray)
                }
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 8)
        }
    }
}

#Preview {
    Screen4View()
}
