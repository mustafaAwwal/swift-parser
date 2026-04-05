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
                    .font(.system(size: 32))
                    .foregroundStyle(.white)
                    Text("Welcome")
                    .font(.system(size: 36))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                }
                .padding(20)
                .overlay(RoundedRectangle(cornerRadius: 40).stroke(.white, lineWidth: 2))
                Spacer()
            }
        }
    }
}

#Preview {
    Screen0View()
}
