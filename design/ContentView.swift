import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView(selection: .constant(4)) {
            Tab("Home", systemImage: "house.fill", value: 0) {
                Text("")
            }
            Tab("Search", systemImage: "magnifyingglass", value: 1) {
                Text("")
            }
            Tab("New", systemImage: "plus.app", value: 2) {
                Text("")
            }
            Tab("Reels", systemImage: "play.square", value: 3) {
                Text("")
            }
            Tab("Profile", systemImage: "person.fill", value: 4) {
                VStack(spacing: 0) {
                    HStack {
                        Text("alex_design")
                        .font(.headline)
                        .fontWeight(.bold)
                        Spacer()
                        HStack(spacing: 20) {
                            Image(systemName: "plus.app")
                            .font(.system(size: 22))
                            Menu {
                                Button(action: {}) { Label("Settings", systemImage: "gearshape") }
                                Button(action: {}) { Label("Archive", systemImage: "archivebox") }
                                Button(action: {}) { Label("Saved", systemImage: "bookmark") }
                                Button(action: {}) { Label("Close Friends", systemImage: "star") }
                                Divider()
                                Button(action: {}) { Label("Log Out", systemImage: "rectangle.portrait.and.arrow.right") }
                            } label: {
                                Label("More", systemImage: "line.3.horizontal")
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    ScrollView {
                        VStack(alignment: .leading, spacing: 0) {
                            VStack(alignment: .center, spacing: 16) {
                                HStack(spacing: 24) {
                                    VStack(alignment: .center, spacing: 8) {
                                        ZStack {
                                            Circle()
                                            .stroke(LinearGradient(colors: [Color(hex: 0xE5625E), Color(hex: 0xFFD700)], startPoint: .leading, endPoint: .trailing), lineWidth: 3)
                                            .frame(width: 86, height: 86)
                                            Circle()
                                            .foregroundStyle(Color(hex: 0xE8E8ED))
                                            .frame(width: 78, height: 78)
                                            Image(systemName: "person.fill")
                                            .font(.system(size: 32))
                                            .foregroundStyle(.gray)
                                        }
                                        Text("alex_design")
                                        .font(.caption)
                                        .fontWeight(.bold)
                                    }
                                    VStack(alignment: .center, spacing: 2) {
                                        Text("248")
                                        .font(.subheadline)
                                        .fontWeight(.bold)
                                        Text("Posts")
                                        .font(.caption)
                                    }
                                    VStack(alignment: .center, spacing: 2) {
                                        Text("14.2K")
                                        .font(.subheadline)
                                        .fontWeight(.bold)
                                        Text("Followers")
                                        .font(.caption)
                                    }
                                    VStack(alignment: .center, spacing: 2) {
                                        Text("892")
                                        .font(.subheadline)
                                        .fontWeight(.bold)
                                        Text("Following")
                                        .font(.caption)
                                    }
                                }
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Alex Rivera")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    Text("Digital designer & photographer\n📍 San Francisco\n✨ Creating things that make people smile")
                                    .font(.caption)
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                HStack(spacing: 8) {
                                    Text("Edit Profile")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 6)
                                    .background(Color(hex: 0xF5F5F7))
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                    Text("Share Profile")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 6)
                                    .background(Color(hex: 0xF5F5F7))
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                    Image(systemName: "person.badge.plus")
                                    .font(.system(size: 14))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(Color(hex: 0xF5F5F7))
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 16)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Story Highlights")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundStyle(.secondary)
                            }
                            .padding(.horizontal, 16)
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 16) {
                                    VStack(alignment: .center, spacing: 6) {
                                        ZStack {
                                            Circle()
                                            .stroke(.gray.opacity(0.3), lineWidth: 1)
                                            .frame(width: 64, height: 64)
                                            Circle()
                                            .foregroundStyle(Color(hex: 0xF5F5F7))
                                            .frame(width: 60, height: 60)
                                            Image(systemName: "airplane")
                                            .font(.system(size: 22))
                                            .foregroundStyle(.gray)
                                        }
                                        Text("Travel")
                                        .font(.caption)
                                    }
                                    VStack(alignment: .center, spacing: 6) {
                                        ZStack {
                                            Circle()
                                            .stroke(.gray.opacity(0.3), lineWidth: 1)
                                            .frame(width: 64, height: 64)
                                            Circle()
                                            .foregroundStyle(Color(hex: 0xF5F5F7))
                                            .frame(width: 60, height: 60)
                                            Image(systemName: "camera")
                                            .font(.system(size: 22))
                                            .foregroundStyle(.gray)
                                        }
                                        Text("Studio")
                                        .font(.caption)
                                    }
                                    VStack(alignment: .center, spacing: 6) {
                                        ZStack {
                                            Circle()
                                            .stroke(.gray.opacity(0.3), lineWidth: 1)
                                            .frame(width: 64, height: 64)
                                            Circle()
                                            .foregroundStyle(Color(hex: 0xF5F5F7))
                                            .frame(width: 60, height: 60)
                                            Image(systemName: "cup.and.saucer")
                                            .font(.system(size: 22))
                                            .foregroundStyle(.gray)
                                        }
                                        Text("Coffee")
                                        .font(.caption)
                                    }
                                    VStack(alignment: .center, spacing: 6) {
                                        ZStack {
                                            Circle()
                                            .stroke(.gray.opacity(0.3), lineWidth: 1)
                                            .frame(width: 64, height: 64)
                                            Circle()
                                            .foregroundStyle(Color(hex: 0xF5F5F7))
                                            .frame(width: 60, height: 60)
                                            Image(systemName: "dog")
                                            .font(.system(size: 22))
                                            .foregroundStyle(.gray)
                                        }
                                        Text("Luna")
                                        .font(.caption)
                                    }
                                    VStack(alignment: .center, spacing: 6) {
                                        ZStack {
                                            Circle()
                                            .stroke(.gray.opacity(0.3), lineWidth: 1)
                                            .frame(width: 64, height: 64)
                                            Circle()
                                            .foregroundStyle(Color(hex: 0xF5F5F7))
                                            .frame(width: 60, height: 60)
                                            Image(systemName: "paintbrush")
                                            .font(.system(size: 22))
                                            .foregroundStyle(.gray)
                                        }
                                        Text("Art")
                                        .font(.caption)
                                    }
                                    VStack(alignment: .center, spacing: 6) {
                                        ZStack {
                                            Circle()
                                            .foregroundStyle(Color(hex: 0xF5F5F7))
                                            .frame(width: 60, height: 60)
                                            Image(systemName: "plus")
                                            .font(.system(size: 22))
                                            .foregroundStyle(.primary)
                                        }
                                        Text("New")
                                        .font(.caption)
                                    }
                                }
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                            }
                            Divider()
                            HStack {
                                Spacer()
                                Image(systemName: "square.grid.3x3")
                                .font(.system(size: 20))
                                .foregroundStyle(.primary)
                                Spacer()
                                Image(systemName: "person.crop.rectangle")
                                .font(.system(size: 20))
                                .foregroundStyle(.secondary)
                                Spacer()
                            }
                            .padding(.vertical, 8)
                            Divider()
                            VStack(spacing: 1) {
                                HStack(spacing: 1) {
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xD1D1D6))
                                    .aspectRatio(1, contentMode: .fit)
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xC7C7CC))
                                    .aspectRatio(1, contentMode: .fit)
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xB0B0B8))
                                    .aspectRatio(1, contentMode: .fit)
                                }
                                HStack(spacing: 1) {
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xA8A8B0))
                                    .aspectRatio(1, contentMode: .fit)
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xD1D1D6))
                                    .aspectRatio(1, contentMode: .fit)
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xC0C0C8))
                                    .aspectRatio(1, contentMode: .fit)
                                }
                                HStack(spacing: 1) {
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xB8B8C0))
                                    .aspectRatio(1, contentMode: .fit)
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xD1D1D6))
                                    .aspectRatio(1, contentMode: .fit)
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xA0A0A8))
                                    .aspectRatio(1, contentMode: .fit)
                                }
                                HStack(spacing: 1) {
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xC7C7CC))
                                    .aspectRatio(1, contentMode: .fit)
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xB0B0B8))
                                    .aspectRatio(1, contentMode: .fit)
                                    Rectangle()
                                    .foregroundStyle(Color(hex: 0xD1D1D6))
                                    .aspectRatio(1, contentMode: .fit)
                                }
                            }
                        }
                    }
                }
            }
        }
        .tint(.primary)
    }
}

#Preview {
    ContentView()
}
