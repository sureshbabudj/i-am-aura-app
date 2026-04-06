import WidgetKit
import AppIntents

enum MoodCategory: String, AppEnum {
    case all = "all"
    case motivational = "motivational"
    case romantic = "romantic"
    case peaceful = "peaceful"
    case focused = "focused"
    case confident = "confident"
    case grateful = "grateful"

    static var typeDisplayRepresentation: TypeDisplayRepresentation = "Mood Category"
    static var caseDisplayRepresentations: [MoodCategory: DisplayRepresentation] = [
        .all: "Random Favorites",
        .motivational: "Motivational 🔥",
        .romantic: "Romantic 💕",
        .peaceful: "Peaceful 🌿",
        .focused: "Focused 🎯",
        .confident: "Confident ⭐",
        .grateful: "Grateful 🙏"
    ]
}

struct ConfigurationAppIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource { "Configure Aura Widget" }
    static var description: IntentDescription { "Choose which category of affirmations to show." }

    @Parameter(title: "Category", default: .all)
    var favoriteMood: MoodCategory
    
    @Parameter(title: "Show Mood Icon", default: true)
    var showIcon: Bool
}
