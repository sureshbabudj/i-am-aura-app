import WidgetKit
import SwiftUI

struct WallpaperProvider: AppIntentTimelineProvider {
    typealias Entry = WallpaperEntry
    typealias Intent = ConfigurationAppIntent
    
    func placeholder(in context: Context) -> WallpaperEntry {
        WallpaperEntry.sample
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> WallpaperEntry {
        let entry = await loadCurrentEntry() ?? .sample
        return entry
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<WallpaperEntry> {
        let entry = await loadCurrentEntry() ?? .sample
        
        // We set the date to NOW so that the system sees this as a fresh entry every time
        let timelineEntry = WallpaperEntry(date: Date(), wallpaper: entry.wallpaper)
        
        return Timeline(entries: [timelineEntry], policy: .atEnd)
    }

    private func loadCurrentEntry() async -> WallpaperEntry? {
        let groupId = "group.com.sureshbabudj.iamaura"
        let defaults = UserDefaults(suiteName: groupId)
        
        guard let dict = defaults?.dictionary(forKey: "currentWallpaper") else {
            return nil
        }
        
        let metadata = WallpaperMetadata(
            id: dict["id"] as? String ?? "unknown",
            moodEmoji: dict["moodEmoji"] as? String ?? "🌿",
            moodName: dict["moodName"] as? String ?? "Aura",
            smallFilename: dict["smallFilename"] as? String,
            mediumFilename: dict["mediumFilename"] as? String,
            largeFilename: dict["largeFilename"] as? String
        )
        
        return WallpaperEntry(date: Date(), wallpaper: metadata)
    }
}
