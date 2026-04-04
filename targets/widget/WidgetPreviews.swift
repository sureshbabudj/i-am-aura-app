import WidgetKit
import SwiftUI

// MARK: - Sample Data
extension WallpaperData {
    static let sampleMotivational = WallpaperData(
        id: "sample-1",
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
    
    static let samplePeaceful = WallpaperData(
        id: "sample-2",
        quote: "I am at peace with my journey",
        moodId: "peaceful",
        moodName: "Peaceful",
        moodEmoji: "🌿",
        backgroundType: "gradient",
        backgroundValue: AnyCodable(["#96CEB4", "#FFEAA7"]),
        patternConfig: nil,
        textColor: "#2D3436",
        dominantColor: "#96CEB4"
    )
    
    static let sampleConfident = WallpaperData(
        id: "sample-3",
        quote: "I am confident in my unique abilities and strengths",
        moodId: "confident",
        moodName: "Confident",
        moodEmoji: "⭐",
        backgroundType: "color",
        backgroundValue: AnyCodable("#FDCB6E"),
        patternConfig: WallpaperData.PatternConfig(
            type: "dots",
            color: "#FFFFFF",
            opacity: 0.1,
            scale: 1.0
        ),
        textColor: "#2D3436",
        dominantColor: "#FDCB6E"
    )
}

extension WallpaperEntry {
    static let sample = WallpaperEntry(
        date: Date(),
        wallpaper: .sampleMotivational
    )
}

// MARK: - Previews
#Preview("Small - Motivational") {
    SmallWidgetView(entry: .sample)
}

#Preview("Small - Peaceful") {
    SmallWidgetView(entry: WallpaperEntry(
        date: Date(),
        wallpaper: .samplePeaceful
    ))
}

#Preview("Medium - Gradient") {
    MediumWidgetView(entry: .sample)
}

#Preview("Medium - Pattern") {
    MediumWidgetView(entry: WallpaperEntry(
        date: Date(),
        wallpaper: .sampleConfident
    ))
}

#Preview("Large - Full") {
    LargeWidgetView(entry: .sample)
}

#Preview("Sanity Check") {
    Text("Hello Preview")
}
