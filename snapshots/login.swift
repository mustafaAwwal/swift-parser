import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            VStack(spacing: 8) {
                Text("Welcome Back")
                .fontWeight(.bold)
                .font(.largeTitle)
                Text("Sign in to continue")
                .foregroundStyle(.secondary)
            }
            VStack(spacing: 12) {
                TextField("Email", text: .constant(""))
                .textFieldStyle(.roundedBorder)
                SecureField("Password", text: .constant(""))
                .textFieldStyle(.roundedBorder)
            }
            CTAButton(label: "Sign In")
            Button("Forgot Password?", action: {})
            .btnText()
            .foregroundStyle(.blue)
            Spacer()
            HStack(spacing: 4) {
                Text("Don't have an account?")
                .foregroundStyle(.secondary)
                .font(.caption)
                Button("Sign Up", action: {})
                .btnLink()
            }
        }
        .padding(24)
    }
}

#Preview {
    ContentView()
}
