import WidgetKit
import SwiftUI

struct WallpaperProvider: AppIntentTimelineProvider {
    
    // Create a static placeholder entry to reuse
    private static let placeholderEntry = WallpaperEntry(
        date: Date(),
        wallpaper: WallpaperData(
            id: "placeholder",
            quote: "I am capable of amazing things",
            moodId: "motivational",
            moodName: "Motivational",
            moodEmoji: "🔥",
            backgroundType: "gradient",
            backgroundValue: AnyCodable(["#FF6B35", "#F7931E"]),
            patternConfig: nil,
            textColor: "#FFFFFF",
            dominantColor: "#FF6B35"
        )
    )
    
    // MARK: - Placeholder
    func placeholder(in context: Context) -> WallpaperEntry {
        // WidgetKit passes in the context - don't create it yourself
        return Self.placeholderEntry
    }

    // MARK: - Snapshot
    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> WallpaperEntry {
        await loadCurrentEntry() ?? Self.placeholderEntry
    }
    
    // MARK: - Timeline
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<WallpaperEntry> {
        var entries: [WallpaperEntry] = []
        
        // Current wallpaper
        if let current = await loadCurrentEntry() {
            entries.append(current)
        } else {
            entries.append(Self.placeholderEntry)
        }
        
        // Load daily queue for future entries
        let defaults = UserDefaults(suiteName: "group.com.sureshbabudj.affirmationswallpaper")
        
        if let queueData = defaults?.array(forKey: "dailyQueue") as? [Data] {
            for (index, data) in queueData.enumerated() {
                if let wallpaper = try? JSONDecoder().decode(WallpaperData.self, from: data) {
                    let date = Calendar.current.date(byAdding: .hour, value: index * 4, to: Date())!
                    entries.append(WallpaperEntry(date: date, wallpaper: wallpaper))
                }
            }
        }
        
        return Timeline(entries: entries, policy: .atEnd)
    }
    
    // MARK: - Helper
    private func loadCurrentEntry() async -> WallpaperEntry? {
        let defaults = UserDefaults(suiteName: "group.com.sureshbabudj.affirmationswallpaper")
        
        guard let data = defaults?.data(forKey: "currentWallpaper"),
              let wallpaper = try? JSONDecoder().decode(WallpaperData.self, from: data) else {
            return nil
        }
        
        return WallpaperEntry(date: Date(), wallpaper: wallpaper)
    }
}
