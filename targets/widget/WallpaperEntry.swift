import WidgetKit
import SwiftUI

// Simplified metadata representation
struct WallpaperEntry: TimelineEntry {
    let date: Date
    let wallpaper: WallpaperMetadata
}

struct WallpaperMetadata: Codable {
    let id: String
    let moodEmoji: String
    let moodName: String
    let smallFilename: String?
    let mediumFilename: String?
    let largeFilename: String?
}

// MARK: - Sample Data
extension WallpaperMetadata {
    static let sample = WallpaperMetadata(
        id: "active_wallpaper",
        moodEmoji: "🌿",
        moodName: "Peaceful",
        smallFilename: nil,
        mediumFilename: nil,
        largeFilename: nil
    )
}

extension WallpaperEntry {
    static let sample = WallpaperEntry(
        date: Date(),
        wallpaper: .sample
    )
}
