import WidgetKit
import SwiftUI

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
        .configurationDisplayName("I Am Wallpaper")
        .description("Daily affirmations with beautiful wallpapers")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct WallpaperWidgetEntryView: View {
    var entry: WallpaperProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        Group {

            switch family {
            case .systemSmall:
                SmallWidgetView(entry: entry)
            case .systemMedium:
                MediumWidgetView(entry: entry)
            case .systemLarge:
                LargeWidgetView(entry: entry)
            case .systemExtraLarge:
                if #available(iOS 15.0, *) {
                    LargeWidgetView(entry: entry)
                } else {
                    SmallWidgetView(entry: entry)
                }
            @unknown default:
                SmallWidgetView(entry: entry)
            }
        }
        .containerBackground(for: .widget) {
            Color.clear
        }
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

