import WidgetKit
import SwiftUI

struct WallpaperProvider: AppIntentTimelineProvider {
    typealias Entry = WallpaperEntry
    typealias Intent = ConfigurationAppIntent
    
    func placeholder(in context: Context) -> WallpaperEntry {
        WallpaperEntry.sample
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> WallpaperEntry {
        let metadata = await loadCurrentMetadata() ?? .sample
        return WallpaperEntry(date: Date(), wallpaper: metadata, configuration: configuration)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<WallpaperEntry> {
        let metadata = await loadCurrentMetadata() ?? .sample
        let entry = WallpaperEntry(date: Date(), wallpaper: metadata, configuration: configuration)
        return Timeline(entries: [entry], policy: .atEnd)
    }

    private func loadCurrentMetadata() async -> WallpaperMetadata? {
        let groupId = "group.com.sureshbabudj.iamaura"
        let defaults = UserDefaults(suiteName: groupId)
        
        guard let dict = defaults?.dictionary(forKey: "currentWallpaper") else {
            return nil
        }
        
        return WallpaperMetadata(
            id: dict["id"] as? String ?? "unknown",
            moodEmoji: dict["moodEmoji"] as? String ?? "🌿",
            moodName: dict["moodName"] as? String ?? "Aura",
            smallFilename: dict["smallFilename"] as? String,
            mediumFilename: dict["mediumFilename"] as? String,
            largeFilename: dict["largeFilename"] as? String
        )
    }
}
