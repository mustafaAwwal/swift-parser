import SwiftUI

struct Screen0View: View {
    var body: some View {
        ZStack {
            Rectangle()
            .foregroundStyle(.purple)
            .ignoresSafeArea()
            VStack(alignment: .center) {
                Spacer()
                HStack(spacing: 12) {
                    Image(systemName: "bell.fill")
                    .font(.system(size: 28))
                    Text("Welcome")
                    .font(.system(size: 32))
                    .fontWeight(.bold)
                }
                .foregroundStyle(.white)
                .padding(.horizontal, 32)
                .padding(.vertical, 16)
                .overlay(RoundedRectangle(cornerRadius: 40).stroke(.white))
                Spacer()
            }
        }
    }
}

#Preview {
    Screen0View()
}
