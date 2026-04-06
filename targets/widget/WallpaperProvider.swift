import WidgetKit
import SwiftUI

struct WallpaperProvider: AppIntentTimelineProvider {
    typealias Entry = WallpaperEntry
    typealias Intent = ConfigurationAppIntent
    
    func placeholder(in context: Context) -> WallpaperEntry {
        WallpaperEntry.sample
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> WallpaperEntry {
        await loadCurrentEntry() ?? .sample
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<WallpaperEntry> {
        let entry = await loadCurrentEntry() ?? .sample
        return Timeline(entries: [entry], policy: .atEnd)
    }

    private func loadCurrentEntry() async -> WallpaperEntry? {
        let defaults = UserDefaults(suiteName: "group.com.sureshbabudj.iamaura")
        
        // ExtensionStorage stores Records as dictionaries in UserDefaults
        if let dict = defaults?.dictionary(forKey: "currentWallpaper"),
           let id = dict["id"] as? String,
           let moodName = dict["moodName"] as? String,
           let moodEmoji = dict["moodEmoji"] as? String {
            
            let metadata = WallpaperMetadata(
                id: id,
                moodEmoji: moodEmoji,
                moodName: moodName
            )
            return WallpaperEntry(date: Date(), wallpaper: metadata)
        }
        
        return nil
    }
}
