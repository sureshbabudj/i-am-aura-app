import WidgetKit
import SwiftUI

struct WallpaperProvider: TimelineProvider {
    typealias Entry = WallpaperEntry
    
    func placeholder(in context: Context) -> WallpaperEntry {
        WallpaperEntry.sample
    }

    func getSnapshot(in context: Context, completion: @escaping (WallpaperEntry) -> Void) {
        Task {
            let metadata = await loadCurrentMetadata() ?? .sample
            let entry = WallpaperEntry(date: Date(), wallpaper: metadata)
            completion(entry)
        }
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<WallpaperEntry>) -> Void) {
        Task {
            let metadata = await loadCurrentMetadata() ?? .sample
            let entry = WallpaperEntry(date: Date(), wallpaper: metadata)
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
        }
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
