import SwiftUI

struct BarChart: View {
    let values: [Double]
    var color: Color = .blue
    var labels: [String] = []
    var height: CGFloat = 120
    var active: Int = -1

    var body: some View {
        let maxVal = values.max() ?? 1

        HStack(alignment: .bottom, spacing: 6) {
            ForEach(Array(values.enumerated()), id: \.offset) { index, value in
                let barH = (value / maxVal) * height
                let isActive = index == active
                let opacity = isActive ? 1.0 : 0.3 + (value / maxVal) * 0.7

                VStack(spacing: 4) {
                    RoundedRectangle(cornerRadius: 4)
                        .foregroundStyle(color.opacity(opacity))
                        .frame(height: barH)

                    if index < labels.count {
                        Text(labels[index])
                            .font(.caption)
                            .fontWeight(isActive ? .bold : .regular)
                            .foregroundStyle(isActive ? .white : .white.opacity(0.3))
                    }
                }
            }
        }
        .frame(maxWidth: .infinity)
        .frame(height: height + 20)
    }
}
