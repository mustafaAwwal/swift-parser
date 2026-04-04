import SwiftUI

struct ContentView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Good Morning")
                        .foregroundStyle(.secondary)
                        .font(.subheadline)
                        Text("Dashboard")
                        .fontWeight(.bold)
                        .font(.largeTitle)
                    }
                    Spacer()
                    ZStack {
                        Image(systemName: "circle.fill")
                        .font(.system(size: 44))
                        .foregroundStyle(.blue)
                        .opacity(0.15)
                        Image(systemName: "person.fill")
                        .font(.system(size: 20))
                        .foregroundStyle(.blue)
                    }
                }
                HStack(spacing: 12) {
                    VStack {
                        VStack(alignment: .leading, spacing: 8) {
                            Image(systemName: "flame.fill")
                            .font(.system(size: 24))
                            .foregroundStyle(.orange)
                            Text("1,847")
                            .fontWeight(.bold)
                            .font(.title2)
                            Text("Calories")
                            .foregroundStyle(.secondary)
                            .font(.caption)
                        }
                        .padding(16)
                    }
                    .card()
                    VStack {
                        VStack(alignment: .leading, spacing: 8) {
                            Image(systemName: "figure.walk")
                            .font(.system(size: 24))
                            .foregroundStyle(.green)
                            Text("8,234")
                            .fontWeight(.bold)
                            .font(.title2)
                            Text("Steps")
                            .foregroundStyle(.secondary)
                            .font(.caption)
                        }
                        .padding(16)
                    }
                    .card()
                }
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Today's Goals")
                        .fontWeight(.bold)
                        .font(.headline)
                        Spacer()
                        Button("See All", action: {})
                        .btnText()
                        .foregroundStyle(.blue)
                    }
                    VStack {
                        VStack(spacing: 16) {
                            HStack {
                                Image(systemName: "drop.fill")
                                .foregroundStyle(.cyan)
                                Text("Water Intake")
                                .fontWeight(.semibold)
                                Spacer()
                                Text("6/8 glasses")
                                .foregroundStyle(.secondary)
                                .font(.caption)
                            }
                            Divider()
                            HStack {
                                Image(systemName: "bed.double.fill")
                                .foregroundStyle(.purple)
                                Text("Sleep")
                                .fontWeight(.semibold)
                                Spacer()
                                Text("7h 23m")
                                .foregroundStyle(.secondary)
                                .font(.caption)
                            }
                            Divider()
                            HStack {
                                Image(systemName: "heart.fill")
                                .foregroundStyle(.red)
                                Text("Heart Rate")
                                .fontWeight(.semibold)
                                Spacer()
                                Text("72 bpm")
                                .foregroundStyle(.secondary)
                                .font(.caption)
                            }
                        }
                        .padding(16)
                    }
                    .card()
                }
                HStack(spacing: 8) {
                    Text("Protein")
                    .badge()
                    Text("Carbs")
                    .badge()
                    Text("Fat")
                    .badge()
                    Text("Fiber")
                    .badge()
                }
                VStack(alignment: .leading, spacing: 12) {
                    Text("Recent Meals")
                    .fontWeight(.bold)
                    .font(.headline)
                    VStack {
                        VStack(spacing: 12) {
                            HStack(spacing: 12) {
                                ZStack {
                                    Image(systemName: "circle.fill")
                                    .font(.system(size: 44))
                                    .foregroundStyle(.green)
                                    .opacity(0.15)
                                    Image(systemName: "leaf.fill")
                                    .font(.system(size: 20))
                                    .foregroundStyle(.green)
                                }
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Grilled Chicken Salad")
                                    .fontWeight(.semibold)
                                    Text("Lunch - 450 cal")
                                    .foregroundStyle(.secondary)
                                    .font(.caption)
                                }
                                Spacer()
                                Text("12:30")
                                .foregroundStyle(.secondary)
                                .font(.caption)
                            }
                            Divider()
                            HStack(spacing: 12) {
                                ZStack {
                                    Image(systemName: "circle.fill")
                                    .font(.system(size: 44))
                                    .foregroundStyle(.orange)
                                    .opacity(0.15)
                                    Image(systemName: "cup.and.saucer.fill")
                                    .font(.system(size: 20))
                                    .foregroundStyle(.orange)
                                }
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Oatmeal with Berries")
                                    .fontWeight(.semibold)
                                    Text("Breakfast - 320 cal")
                                    .foregroundStyle(.secondary)
                                    .font(.caption)
                                }
                                Spacer()
                                Text("8:15")
                                .foregroundStyle(.secondary)
                                .font(.caption)
                            }
                        }
                        .padding(16)
                    }
                    .card()
                }
                VStack(spacing: 12) {
                    CTAButton(label: "Log New Meal")
                    SecButton(label: "View Full Report")
                    HStack(spacing: 16) {
                        Button("Settings", action: {})
                        .btnGhost()
                        Spacer()
                        Button("Terms of Use", action: {})
                        .btnLink()
                    }
                }
            }
            .padding(20)
        }
    }
}

#Preview {
    ContentView()
}
