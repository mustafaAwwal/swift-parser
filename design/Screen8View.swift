import SwiftUI

struct Screen8View: View {
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Image(systemName: "chevron.left")
                .font(.system(size: 18))
                Spacer()
                Text("Verify Your Email")
                .font(.system(size: 17))
                .fontWeight(.bold)
                Spacer()
                Spacer()
            }
            .padding(16)
            Divider()
            ScrollView {
                VStack(alignment: .center, spacing: 24) {
                    ZStack {
                        Circle()
                        .foregroundStyle(.purple.opacity(0.2))
                        .frame(width: 100, height: 100)
                        Image(systemName: "envelope.open.fill")
                        .font(.system(size: 40))
                        .foregroundStyle(.purple)
                    }
                    VStack(alignment: .center, spacing: 8) {
                        Text("We've sent a one-time code to")
                        .font(.system(size: 16))
                        Rectangle()
                        .foregroundStyle(.gray.opacity(0.2))
                        .frame(width: 200, height: 16)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
                        Text(".")
                        .font(.system(size: 16))
                    }
                    Text("It may take a few minutes to arrive. If you can't find it, check your spam folder.")
                    .font(.system(size: 14))
                    .foregroundStyle(.gray)
                    .multilineTextAlignment(.center)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Enter Code")
                        .font(.system(size: 11))
                        .foregroundStyle(.purple)
                        Text("545500")
                        .font(.system(size: 16))
                        Rectangle()
                        .foregroundStyle(.purple)
                        .frame(height: 2)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(.purple))
                    VStack(spacing: 12) {
                        Text("OPEN MAIL APP")
                        .font(.system(size: 14))
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(.purple)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        Text("CONFIRM")
                        .font(.system(size: 14))
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(.gray)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    Text("Resend Code")
                    .font(.system(size: 14))
                    .foregroundStyle(.purple)
                    .underline()
                }
                .padding(24)
            }
            Spacer()
            VStack(spacing: 1) {
                HStack(spacing: 1) {
                    Text("1")
                    .font(.system(size: 24))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    VStack(alignment: .center, spacing: 2) {
                        Text("2")
                        .font(.system(size: 24))
                        Text("ABC")
                        .font(.system(size: 9))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    VStack(alignment: .center, spacing: 2) {
                        Text("3")
                        .font(.system(size: 24))
                        Text("DEF")
                        .font(.system(size: 9))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                HStack(spacing: 1) {
                    VStack(alignment: .center, spacing: 2) {
                        Text("4")
                        .font(.system(size: 24))
                        Text("GHI")
                        .font(.system(size: 9))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    VStack(alignment: .center, spacing: 2) {
                        Text("5")
                        .font(.system(size: 24))
                        Text("JKL")
                        .font(.system(size: 9))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    VStack(alignment: .center, spacing: 2) {
                        Text("6")
                        .font(.system(size: 24))
                        Text("MNO")
                        .font(.system(size: 9))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                HStack(spacing: 1) {
                    VStack(alignment: .center, spacing: 2) {
                        Text("7")
                        .font(.system(size: 24))
                        Text("PQRS")
                        .font(.system(size: 9))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    VStack(alignment: .center, spacing: 2) {
                        Text("8")
                        .font(.system(size: 24))
                        Text("TUV")
                        .font(.system(size: 9))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    VStack(alignment: .center, spacing: 2) {
                        Text("9")
                        .font(.system(size: 24))
                        Text("WXYZ")
                        .font(.system(size: 9))
                        .foregroundStyle(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                HStack(spacing: 1) {
                    Spacer()
                    Text("0")
                    .font(.system(size: 24))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(.gray.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    Image(systemName: "delete.left")
                    .font(.system(size: 20))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                }
            }
            .padding(2)
            .background(.gray.opacity(0.08))
        }
    }
}

#Preview {
    Screen8View()
}
