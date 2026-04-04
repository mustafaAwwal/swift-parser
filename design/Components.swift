import SwiftUI

// MARK: - Styled Button Helpers

struct CTAButton: View {
    let label: String
    var body: some View {
        Button(action: {}) {
            Text(label)
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .controlSize(.large)
    }
}

struct SecButton: View {
    let label: String
    var body: some View {
        Button(action: {}) {
            Text(label)
                .fontWeight(.medium)
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.bordered)
        .controlSize(.large)
    }
}
