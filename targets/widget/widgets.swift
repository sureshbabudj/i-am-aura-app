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
        StaticConfiguration(
            kind: kind,
            provider: WallpaperProvider()
        ) { entry in
            WallpaperWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("I Am Aura")
        .description("Your favorite affirmations, rendered perfectly.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
        .contentMarginsDisabled()
    }
}

struct WallpaperWidgetEntryView: View {
    var entry: WallpaperProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            if let image = loadSnapshot(for: family) {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .ignoresSafeArea(.all)
            } else {
                FallbackPlaceholder(entry: entry)
            }
        }
        .containerBackground(for: .widget) { Color.black }
        .ignoresSafeArea(.all)
    }
    
    private func loadSnapshot(for family: WidgetFamily) -> UIImage? {
        let fileName: String?
        switch family {
        case .systemSmall: fileName = entry.wallpaper.smallFilename
        case .systemMedium: fileName = entry.wallpaper.mediumFilename
        case .systemLarge: fileName = entry.wallpaper.largeFilename
        default: fileName = entry.wallpaper.smallFilename
        }
        
        guard let fileName = fileName else { return nil }
        
        let fileManager = FileManager.default
        let groupId = "group.com.sureshbabudj.iamaura"
        guard let groupURL = fileManager.containerURL(forSecurityApplicationGroupIdentifier: groupId) else {
            return nil
        }
        
        let imageURL = groupURL.appendingPathComponent(fileName)
        let path = imageURL.path
        
        if fileManager.fileExists(atPath: path) {
            return UIImage(contentsOfFile: path)
        }
        return nil
    }
}

struct FallbackPlaceholder: View {
    var entry: WallpaperEntry
    var body: some View {
        VStack(spacing: 8) {
            Text(entry.wallpaper.moodEmoji)
                .font(.system(size: 32))
            Text("Setting up your Aura...")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .containerBackground(for: .widget) { Color.black }
    }
}
