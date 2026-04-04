import WidgetKit
import SwiftUI

struct WallpaperEntry: TimelineEntry {
    let date: Date
    let wallpaper: WallpaperData
}

struct WallpaperData: Codable {
    let id: String
    let quote: String
    let moodId: String
    let moodName: String
    let moodEmoji: String
    let backgroundType: String // "color", "gradient", "image", "pattern"
    let backgroundValue: AnyCodable // String for color, [String] for gradient, String for image URL
    let patternConfig: PatternConfig?
    let textColor: String
    let dominantColor: String?
    
    struct PatternConfig: Codable {
        let type: String
        let color: String
        let opacity: Double
        let scale: Double?
    }
}

// Helper for polymorphic Codable
struct AnyCodable: Codable {
    let value: Any
    
    init(_ value: Any) {
        self.value = value
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let string = try? container.decode(String.self) {
            value = string
        } else if let array = try? container.decode([String].self) {
            value = array
        } else {
            value = ""
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let string = value as? String {
            try container.encode(string)
        } else if let array = value as? [String] {
            try container.encode(array)
        }
    }
}
