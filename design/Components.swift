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

// MARK: - Floating Label TextField

// MARK: - Image Placeholder

struct ImagePlaceholder: View {
    var height: CGFloat = 200
    var color: Color = .gray
    var icon: String = "photo"

    var body: some View {
        ZStack {
            Rectangle()
                .foregroundStyle(color.opacity(0.2))
            Image(systemName: icon)
                .font(.system(size: 32))
                .foregroundStyle(color.opacity(0.5))
        }
        .frame(maxWidth: .infinity)
        .frame(height: height)
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

// MARK: - Search Bar

struct SearchBar: View {
    let placeholder: String
    var value: String = ""

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(value.isEmpty ? .secondary : .primary)
            Text(value.isEmpty ? placeholder : value)
                .foregroundStyle(value.isEmpty ? .secondary : .primary)
            Spacer()
            if !value.isEmpty {
                Image(systemName: "xmark.circle.fill")
                    .foregroundStyle(.secondary)
            }
        }
        .padding(10)
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

// MARK: - Floating Label TextField

struct FloatingTextField: View {
    let label: String
    let value: String

    var body: some View {
        ZStack(alignment: .topLeading) {
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color.gray.opacity(0.4))
                .frame(height: 56)
            Text(value.isEmpty ? "" : value)
                .padding(.horizontal, 12)
                .padding(.top, 26)
                .frame(maxWidth: .infinity, alignment: .leading)
            Text(label)
                .font(value.isEmpty ? .body : .caption)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 12)
                .padding(.top, value.isEmpty ? 18 : 8)
        }
    }
}

struct FloatingSecureField: View {
    let label: String
    let value: String

    var body: some View {
        ZStack(alignment: .topLeading) {
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color.gray.opacity(0.4))
                .frame(height: 56)
            Text(value.isEmpty ? "" : String(repeating: "•", count: value.count))
                .padding(.horizontal, 12)
                .padding(.top, 26)
                .frame(maxWidth: .infinity, alignment: .leading)
            Text(label)
                .font(value.isEmpty ? .body : .caption)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 12)
                .padding(.top, value.isEmpty ? 18 : 8)
        }
    }
}
