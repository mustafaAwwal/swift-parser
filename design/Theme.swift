import SwiftUI

// MARK: - Button Modifiers

extension View {
    /// Text-only button: plain style
    func btnText() -> some View {
        self.buttonStyle(.plain)
    }

    /// Link button: plain + caption font
    func btnLink() -> some View {
        self
            .buttonStyle(.plain)
            .font(.caption)
    }

    /// Ghost button: borderless
    func btnGhost() -> some View {
        self.buttonStyle(.borderless)
    }
}

// MARK: - Badge

extension View {
    /// Capsule badge with colored background
    func badge(_ color: Color = .blue) -> some View {
        self
            .font(.caption2)
            .fontWeight(.medium)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color)
            .foregroundStyle(.white)
            .clipShape(Capsule())
    }
}

// MARK: - Card

extension View {
    /// Card container: material background, rounded corners
    func card() -> some View {
        self
            .background(.regularMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    /// Card title styling
    func cardTitle() -> some View {
        self.font(.headline)
    }

    /// Card body styling
    func cardBody() -> some View {
        self
            .font(.body)
            .foregroundStyle(.secondary)
    }
}
