import SwiftUI

struct Screen7View: View {
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Image(systemName: "chevron.left")
                .font(.system(size: 20))
                Spacer()
                Text("Verify Your Email")
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
                VStack(alignment: .center, spacing: 20) {
                    ZStack {
                        Rectangle()
                        .foregroundStyle(.purple)
                        .frame(width: 120, height: 100)
                        .clipShape(Capsule().rotation(.degrees(180)).offset(y: 25))
                        Image(systemName: "envelope.open.fill")
                        .font(.system(size: 50))
                        .foregroundStyle(.white)
                        Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 24))
                        .foregroundStyle(.purple)
                        .offset(x: 30, y: -20)
                    }
                    .padding(.top, 20)
                    VStack(spacing: 4) {
                        Text("We've sent a one-time code to")
                        .font(.system(size: 16))
                        Rectangle()
                        .foregroundStyle(.gray.opacity(0.2))
                        .frame(width: 200, height: 16)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
                    }
                    Text("It may take a few minutes to arrive. If you can't find it, check your spam folder.")
                    .font(.system(size: 14))
                    .foregroundStyle(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Enter Code")
                        .font(.system(size: 12))
                        .foregroundStyle(.purple)
                        TextField("Enter Code", text: .constant(""))
                        .textFieldStyle(.roundedBorder)
                        .padding(12)
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(.purple, lineWidth: 1))
                    }
                    Text("OPEN MAIL APP")
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .font(.system(size: 14))
                    .frame(maxWidth: .infinity)
                    .padding(14)
                    .background(.purple)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    Text("CONFIRM")
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .font(.system(size: 14))
                    .frame(maxWidth: .infinity)
                    .padding(14)
                    .background(.gray)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    Text("Resend Code")
                    .font(.system(size: 14))
                    .foregroundStyle(.gray)
                    .underline()
                }
                .padding(.horizontal, 24)
                .padding(.top, 16)
            }
            Spacer()
            VStack(spacing: 0) {
                HStack(spacing: 0) {
                    VStack {
                        Text("1")
                        .font(.system(size: 24))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(12)
                    .background(.gray.opacity(0.15))
                    VStack {
                        Text("2")
                        .font(.system(size: 24))
                        Text("ABC")
                        .font(.system(size: 10))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .background(.gray.opacity(0.15))
                    VStack {
                        Text("3")
                        .font(.system(size: 24))
                        Text("DEF")
                        .font(.system(size: 10))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .background(.gray.opacity(0.15))
                }
                HStack(spacing: 0) {
                    VStack {
                        Text("4")
                        .font(.system(size: 24))
                        Text("GHI")
                        .font(.system(size: 10))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .background(.gray.opacity(0.15))
                    VStack {
                        Text("5")
                        .font(.system(size: 24))
                        Text("JKL")
                        .font(.system(size: 10))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .background(.gray.opacity(0.15))
                    VStack {
                        Text("6")
                        .font(.system(size: 24))
                        Text("MNO")
                        .font(.system(size: 10))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .background(.gray.opacity(0.15))
                }
                HStack(spacing: 0) {
                    VStack {
                        Text("7")
                        .font(.system(size: 24))
                        Text("PQRS")
                        .font(.system(size: 10))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .background(.gray.opacity(0.15))
                    VStack {
                        Text("8")
                        .font(.system(size: 24))
                        Text("TUV")
                        .font(.system(size: 10))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .background(.gray.opacity(0.15))
                    VStack {
                        Text("9")
                        .font(.system(size: 24))
                        Text("WXYZ")
                        .font(.system(size: 10))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                    .background(.gray.opacity(0.15))
                }
                HStack(spacing: 0) {
                    Rectangle()
                    .foregroundStyle(.clear)
                    .frame(maxWidth: .infinity)
                    VStack {
                        Text("0")
                        .font(.system(size: 24))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(12)
                    .background(.gray.opacity(0.15))
                    VStack {
                        Image(systemName: "delete.left")
                        .font(.system(size: 20))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(12)
                }
            }
            .background(.gray.opacity(0.1))
        }
    }
}

#Preview {
    Screen7View()
}
