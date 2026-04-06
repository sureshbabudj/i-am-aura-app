import WidgetKit
import SwiftUI

@main
struct exportWidgets: WidgetBundle {
    var body: some Widget {
        WallpaperWidget()
        WallpaperControl()
        AuraLiveActivity()
    }
}

struct WallpaperWidget: Widget {
    let kind: String = "WallpaperWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(
            kind: kind,
            intent: ConfigurationAppIntent.self,
            provider: WallpaperProvider()
        ) { entry in
            WallpaperWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("I Am Aura")
        .description("Your favorite affirmations, rendered perfectly.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct WallpaperWidgetEntryView: View {
    var entry: WallpaperProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            if let uiImage = loadSnapshot(for: family) {
                Image(uiImage: uiImage)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } else {
                FallbackPlaceholder(entry: entry)
            }
        }
        .ignoresSafeArea(.all)
        .containerBackground(for: .widget) {
            Color.white.opacity(0.1)
        }
        .widgetURL(URL(string: "iamaura://create/\(entry.wallpaper.id)"))
    }
    
    // Unified helper for loading the snapshots by family
    private func loadSnapshot(for family: WidgetFamily) -> UIImage? {
        let fileName: String
        switch family {
        case .systemSmall: fileName = "small_widget.png"
        case .systemMedium: fileName = "medium_widget.png"
        case .systemLarge: fileName = "large_widget.png"
        default: fileName = "small_widget.png"
        }
        
        let fileManager = FileManager.default
        guard let groupURL = fileManager.containerURL(forSecurityApplicationGroupIdentifier: "group.com.sureshbabudj.iamaura") else {
            return nil
        }
        
        let imageURL = groupURL.appendingPathComponent(fileName)
        if let data = try? Data(contentsOf: imageURL), let image = UIImage(data: data) {
            return image
        }
        return nil
    }
}

// Fallback view shown if snapshots are missing
struct FallbackPlaceholder: View {
    var entry: WallpaperEntry
    var body: some View {
        VStack(spacing: 4) {
            Text(entry.wallpaper.moodEmoji)
                .font(.largeTitle)
            Text("No snapshot found yet.")
                .font(.caption)
                .foregroundColor(.secondary)
            Text("Tip: Open Aura and tap 'Save' to sync your widget.")
                .font(.system(size: 10))
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
    }
}
