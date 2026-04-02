import WidgetKit
import SwiftUI

struct QuoteEntry: TimelineEntry {
  let date: Date
  let quote: String
  let mood: String
  let moodEmoji: String
  let textColor: Color
  let backgroundColor: Color
  let wallpaperId: String
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> QuoteEntry {
    QuoteEntry(
      date: Date(),
      quote: "I am capable of amazing things",
      mood: "motivational",
      moodEmoji: "🔥",
      textColor: .white,
      backgroundColor: .orange,
      wallpaperId: "placeholder"
    )
  }
  
  func getSnapshot(in context: Context, completion: @escaping (QuoteEntry) -> Void) {
    let entry = loadCurrentEntry()
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<QuoteEntry>) -> Void) {
    var entries: [QuoteEntry] = []
    let currentDate = Date()
    
    // Load saved data from App Group
    let defaults = UserDefaults(suiteName: "group.com.sureshbabudj.iamaura")
    
    // Check if rotation is enabled
    if let schedule = defaults?.dictionary(forKey: "rotationSchedule") as? [String: Any],
       let enabled = schedule["enabled"] as? Bool,
       enabled,
       let queue = defaults?.array(forKey: "dailyQuoteQueue") as? [[String: Any]] {
      
      // Create timeline entries based on rotation schedule
      let interval = schedule["interval"] as? Int ?? 4 // hours
      var entryDate = currentDate
      
      for (index, item) in queue.enumerated() {
        let quote = item["quote"] as? String ?? "I am enough"
        let mood = item["mood"] as? String ?? "peaceful"
        
        let entry = QuoteEntry(
          date: entryDate,
          quote: quote,
          mood: mood,
          moodEmoji: getEmojiForMood(mood),
          textColor: Color(hex: defaults?.string(forKey: "textColor") ?? "#FFFFFF"),
          backgroundColor: Color(hex: defaults?.string(forKey: "backgroundColor") ?? "#FF6B35"),
          wallpaperId: item["id"] as? String ?? "\(index)"
        )
        
        entries.append(entry)
        entryDate = Calendar.current.date(byAdding: .hour, value: interval, to: entryDate) ?? entryDate
      }
    } else {
      // Single entry mode
      entries.append(loadCurrentEntry())
    }
    
    let timeline = Timeline(entries: entries, policy: .atEnd)
    completion(timeline)
  }
  
  private func loadCurrentEntry() -> QuoteEntry {
    let defaults = UserDefaults(suiteName: "group.com.sureshbabudj.iamaura")
    
    return QuoteEntry(
      date: Date(),
      quote: defaults?.string(forKey: "currentQuote") ?? "I am enough",
      mood: defaults?.string(forKey: "currentMood") ?? "peaceful",
      moodEmoji: defaults?.string(forKey: "currentMoodEmoji") ?? "🌿",
      textColor: Color(hex: defaults?.string(forKey: "textColor") ?? "#FFFFFF"),
      backgroundColor: Color(hex: defaults?.string(forKey: "backgroundColor") ?? "#96CEB4"),
      wallpaperId: defaults?.string(forKey: "currentWallpaperId") ?? "default"
    )
  }
  
  private func getEmojiForMood(_ mood: String) -> String {
    let emojis: [String: String] = [
      "motivational": "🔥",
      "romantic": "💕",
      "peaceful": "🌿",
      "focused": "🎯",
      "confident": "⭐",
      "grateful": "🙏"
    ]
    return emojis[mood] ?? "✨"
  }
}

// MARK: - Widget Views

struct AuraWidgetEntryView: View {
  var entry: Provider.Entry
  @Environment(\.widgetFamily) var family
  
  var body: some View {
    switch family {
    case .systemSmall:
      SmallWidgetView(entry: entry)
    case .systemMedium:
      MediumWidgetView(entry: entry)
    case .systemLarge:
      LargeWidgetView(entry: entry)
    case .accessoryCircular:
      LockScreenCircularView(entry: entry)
    case .accessoryRectangular:
      LockScreenRectangularView(entry: entry)
    case .accessoryInline:
      LockScreenInlineView(entry: entry)
    @unknown default:
      SmallWidgetView(entry: entry)
    }
  }
}

// Small Widget (Home Screen)
struct SmallWidgetView: View {
  let entry: QuoteEntry
  
  var body: some View {
    ZStack {
      // Background
      entry.backgroundColor
        .overlay(
          // Subtle pattern or gradient effect
          LinearGradient(
            colors: [entry.backgroundColor.opacity(0.8), entry.backgroundColor],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
          )
        )
      
      VStack(spacing: 8) {
        // Mood emoji
        Text(entry.moodEmoji)
          .font(.system(size: 24))
        
        // Quote text (truncated for small size)
        Text(entry.quote)
          .font(.system(size: 12, weight: .semibold, design: .rounded))
          .foregroundColor(entry.textColor)
          .multilineTextAlignment(.center)
          .lineLimit(3)
          .minimumScaleFactor(0.8)
          .padding(.horizontal, 8)
      }
    }
  }
}

// Medium Widget (Home Screen)
struct MediumWidgetView: View {
  let entry: QuoteEntry
  
  var body: some View {
    ZStack {
      entry.backgroundColor
      
      HStack(spacing: 16) {
        // Left side: Mood icon
        VStack {
          Text(entry.moodEmoji)
            .font(.system(size: 40))
          Text(entry.mood.capitalized)
            .font(.system(size: 10, weight: .medium))
            .foregroundColor(entry.textColor.opacity(0.8))
            .textCase(.uppercase)
        }
        .frame(width: 60)
        
        // Right side: Quote
        VStack(alignment: .leading, spacing: 4) {
          Text("Today I am...")
            .font(.system(size: 11, weight: .medium))
            .foregroundColor(entry.textColor.opacity(0.7))
            .textCase(.uppercase)
            .tracking(1)
          
          Text(entry.quote)
            .font(.system(size: 16, weight: .semibold, design: .rounded))
            .foregroundColor(entry.textColor)
            .lineLimit(3)
            .minimumScaleFactor(0.9)
        }
        
        Spacer()
      }
      .padding()
    }
  }
}

// Large Widget (Home Screen)
struct LargeWidgetView: View {
  let entry: QuoteEntry
  
  var body: some View {
    ZStack {
      entry.backgroundColor
      
      VStack(spacing: 20) {
        // Header
        HStack {
          Text(entry.moodEmoji)
            .font(.system(size: 32))
          Text(entry.mood.capitalized)
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(entry.textColor.opacity(0.8))
            .textCase(.uppercase)
          Spacer()
        }
        .padding(.horizontal)
        
        // Main quote
        VStack(spacing: 8) {
          Text("I am")
            .font(.system(size: 20, weight: .medium))
            .foregroundColor(entry.textColor.opacity(0.7))
          
          Text(entry.quote.replacingOccurrences(of: "I am ", with: ""))
            .font(.system(size: 28, weight: .bold, design: .rounded))
            .foregroundColor(entry.textColor)
            .multilineTextAlignment(.center)
            .lineSpacing(4)
            .padding(.horizontal, 20)
        }
        
        Spacer()
        
        // Footer hint
        Text("Tap to open app")
          .font(.system(size: 11))
          .foregroundColor(entry.textColor.opacity(0.5))
          .padding(.bottom, 8)
      }
      .padding(.vertical)
    }
  }
}

// Lock Screen Circular Widget
struct LockScreenCircularView: View {
  let entry: QuoteEntry
  
  var body: some View {
    ZStack {
      AccessoryWidgetBackground()
      
      VStack {
        Text(entry.moodEmoji)
          .font(.system(size: 20))
      }
    }
  }
}

// Lock Screen Rectangular Widget
struct LockScreenRectangularView: View {
  let entry: QuoteEntry
  
  var body: some View {
    HStack(spacing: 8) {
      Text(entry.moodEmoji)
        .font(.system(size: 20))
      
      VStack(alignment: .leading, spacing: 2) {
        Text("I am")
          .font(.system(size: 11, weight: .medium))
          .foregroundColor(.secondary)
        
        Text(entry.quote.replacingOccurrences(of: "I am ", with: ""))
          .font(.system(size: 15, weight: .semibold, design: .rounded))
          .lineLimit(1)
      }
      
      Spacer()
    }
    .padding(.horizontal, 4)
  }
}

// Lock Screen Inline Widget
struct LockScreenInlineView: View {
  let entry: QuoteEntry
  
  var body: some View {
    HStack(spacing: 4) {
      Text(entry.moodEmoji)
      Text("I am \(entry.quote.replacingOccurrences(of: "I am ", with: ""))")
        .lineLimit(1)
    }
  }
}

// MARK: - Widget Configuration

@main
struct AuraWidget: Widget {
  let kind: String = "AuraWidget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      AuraWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("Aura Quotes")
    .description("Daily quotes based on your mood")
    .supportedFamilies([
      .systemSmall,
      .systemMedium,
      .systemLarge,
      .accessoryCircular,
      .accessoryRectangular,
      .accessoryInline
    ])
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