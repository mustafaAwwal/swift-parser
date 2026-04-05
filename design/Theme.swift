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
    /// CTA button: bold, full-width, prominent, large
    func cta() -> some View {
        self
            .fontWeight(.semibold)
            .frame(maxWidth: .infinity)
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
    }

    /// Secondary button: medium weight, full-width, bordered, large
    func sec() -> some View {
        self
            .fontWeight(.medium)
            .frame(maxWidth: .infinity)
            .buttonStyle(.bordered)
            .controlSize(.large)
    }

    /// Text-only button: no chrome
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

// MARK: - Icon Circle

extension View {
    /// Wraps the view in a colored circle background
    /// Usage: Image(systemName: "car.fill").ico(.blue, size: 40)
    func ico(_ color: Color, size: CGFloat = 40) -> some View {
        self
            .font(.system(size: size * 0.4))
            .foregroundStyle(color)
            .frame(width: size, height: size)
            .background(
                Circle()
                    .foregroundStyle(color.opacity(0.15))
            )
    }
}

// MARK: - Ring (Progress Arc)

extension Shape {
    /// Progress ring fill arc: trims shape, strokes with round cap, rotates to start from top
    /// Usage: Circle().ring(0.84, .blue, lineWidth: 6)
    func ring(_ value: Double, _ color: Color, lineWidth: CGFloat = 8) -> some View {
        self
            .trim(from: 0, to: value)
            .stroke(color, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
            .rotationEffect(.degrees(-90))
    }

    /// Ring background track: strokes at reduced opacity
    /// Usage: Circle().ringTrack(.blue, lineWidth: 6)
    func ringTrack(_ color: Color, lineWidth: CGFloat = 8) -> some View {
        self
            .stroke(color.opacity(0.2), lineWidth: lineWidth)
    }
}
