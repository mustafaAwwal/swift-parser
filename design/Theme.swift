import SwiftUI

// MARK: - Hex Color

extension Color {
    init(hex: UInt, opacity: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: opacity)
    }
}

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
