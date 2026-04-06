import ActivityKit
import WidgetKit
import SwiftUI

struct AuraAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var quote: String
        var moodEmoji: String
        var colorHex: String
    }

    var focusGoal: String
}

struct AuraLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: AuraAttributes.self) { context in
            // Lock screen / Notification UI
            HStack(spacing: 12) {
                Text(context.state.moodEmoji)
                    .font(.system(size: 32))
                    .padding(8)
                    .background(Color(hex: context.state.colorHex).opacity(0.2))
                    .clipShape(Circle())
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(context.attributes.focusGoal.uppercased())
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: context.state.colorHex))
                        .tracking(1)
                    
                    Text(context.state.quote)
                        .font(.system(size: 16, weight: .semibold, design: .serif))
                        .lineLimit(2)
                }
                
                Spacer()
            }
            .padding()
            .activityBackgroundTint(Color.white.opacity(0.9))
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded - The full detailed view when long-pressed
                DynamicIslandExpandedRegion(.leading) {
                    Text(context.state.moodEmoji)
                        .font(.title)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Aura")
                        .font(.caption)
                        .foregroundColor(Color(hex: context.state.colorHex))
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text(context.state.quote)
                        .font(.system(size: 20, weight: .medium, design: .serif))
                        .multilineTextAlignment(.center)
                        .padding(.top, 4)
                }
            } compactLeading: {
                Text(context.state.moodEmoji)
            } compactTrailing: {
                Text("Focus")
                    .font(.caption2)
                    .foregroundColor(Color(hex: context.state.colorHex))
            } minimal: {
                Text(context.state.moodEmoji)
            }
            .widgetURL(URL(string: "iamaura://"))
            .keylineTint(Color(hex: context.state.colorHex))
        }
    }
}

// MARK: - Previews
#Preview("Notification", as: .content, using: AuraAttributes(focusGoal: "Mindfulness")) {
   AuraLiveActivity()
} contentStates: {
    AuraAttributes.ContentState(quote: "I am present and at peace.", moodEmoji: "🌿", colorHex: "#96CEB4")
    AuraAttributes.ContentState(quote: "I embrace the journey before me.", moodEmoji: "⭐", colorHex: "#FDCB6E")
}
