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
            if let image = loadSnapshot(for: family) {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } else {
                FallbackPlaceholder(entry: entry)
            }
        }
        .containerBackground(for: .widget) { Color.white.opacity(0.1) }
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
        ScrollView {
            VStack(spacing: 8) {
                Text(entry.wallpaper.moodEmoji)
                    .font(.largeTitle)
                Text("Snapshot Unavailable")
                    .font(.headline)
                
                Text("Updated: \(entry.date.formatted(date: .omitted, time: .standard))")
                    .font(.system(size: 8))
                    .foregroundColor(.secondary)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Entry ID: \(entry.wallpaper.id)")
                    Text("Entry Small: \(entry.wallpaper.smallFilename ?? "nil")")
                    
                    if let defaults = UserDefaults(suiteName: "group.com.sureshbabudj.iamaura") {
                        let allDict = defaults.dictionaryRepresentation()
                        
                        Text("--- Files on Disk ---")
                            .font(.system(size: 10, weight: .bold))
                            .padding(.top, 4)
                        
                        let sizes = ["smallFilename", "mediumFilename", "largeFilename"]
                        ForEach(sizes, id: \.self) { key in
                            if let fn = allDict[key] as? String, let url = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.sureshbabudj.iamaura")?.appendingPathComponent(fn) {
                                let exists = FileManager.default.fileExists(atPath: url.path)
                                Text("\(key): \(exists ? "EXISTS ✅" : "MISSING ❌")")
                                    .font(.system(size: 8))
                                    .foregroundColor(exists ? .green : .red)
                            }
                        }
                        
                        Text("--- Raw Suite Keys ---")
                            .font(.system(size: 10, weight: .bold))
                            .padding(.top, 4)
                        
                        let keys = allDict.keys.filter { $0.contains("aura") || $0.contains("Wallpaper") || $0.count < 30 }
                        ForEach(keys.sorted(), id: \.self) { key in
                            Text("\(key): \(String(describing: allDict[key] ?? "nil"))")
                                .font(.system(size: 8, design: .monospaced))
                                .foregroundColor(.blue)
                        }
                    }
                }
                .font(.system(size: 8, design: .monospaced))
                .foregroundColor(.secondary)
            }
            .padding()
        }
    }
}
