import ActivityKit
import WidgetKit
import SwiftUI

struct AuraAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var quote: String
        var moodEmoji: String
        var colorHex: String
        var progress: Double // Progress towards a focus goal
    }

    var focusSession: String
}

struct AuraLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: AuraAttributes.self) { context in
            // Lock screen / Notification UI
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 12) {
                    Text(context.state.moodEmoji)
                        .font(.system(size: 24))
                        .padding(10)
                        .background(Color(hex: context.state.colorHex).opacity(0.15))
                        .clipShape(Circle())
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text(context.attributes.focusSession.uppercased())
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: context.state.colorHex))
                            .tracking(1.5)
                        
                        Text("MINDSET FOCUS")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    Text("AURA")
                        .font(.system(size: 12, weight: .black))
                        .italic()
                        .foregroundColor(Color(hex: context.state.colorHex).opacity(0.5))
                }
                
                Text(context.state.quote)
                    .font(.system(size: 18, weight: .semibold, design: .serif))
                    .foregroundColor(.primary)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
                    .padding(.bottom, 4)
            }
            .padding(16)
            .activityBackgroundTint(Color(hex: "#121212").opacity(0.8))
            .activitySystemActionForegroundColor(Color.white)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded - The full detailed view when long-pressed
                DynamicIslandExpandedRegion(.leading) {
                    Text(context.state.moodEmoji)
                        .font(.title)
                        .padding(.leading, 8)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .trailing) {
                        Text("AURA")
                            .font(.system(size: 14, weight: .black))
                            .foregroundColor(Color(hex: context.state.colorHex))
                        Text("Active")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.secondary)
                    }
                    .padding(.trailing, 8)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(spacing: 8) {
                        Text(context.state.quote)
                            .font(.system(size: 18, weight: .medium, design: .serif))
                            .multilineTextAlignment(.center)
                            .foregroundColor(.white)
                            .padding(.horizontal)
                        
                        // Small Progress Bar
                        GeometryReader { geo in
                            ZStack(alignment: .leading) {
                                RoundedRectangle(cornerRadius: 2)
                                    .fill(Color.white.opacity(0.2))
                                    .frame(height: 4)
                                RoundedRectangle(cornerRadius: 2)
                                    .fill(Color(hex: context.state.colorHex))
                                    .frame(width: geo.size.width * context.state.progress, height: 4)
                            }
                        }
                        .frame(height: 4)
                        .padding(.horizontal, 24)
                        .padding(.bottom, 8)
                    }
                }
            } compactLeading: {
                Text(context.state.moodEmoji)
                    .padding(.leading, 4)
            } compactTrailing: {
                Text("Focusing")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: context.state.colorHex))
                    .padding(.trailing, 4)
            } minimal: {
                Text(context.state.moodEmoji)
            }
            .widgetURL(URL(string: "iamaura://"))
            .keylineTint(Color(hex: context.state.colorHex))
        }
    }
}

// MARK: - Previews
#Preview("Notification", as: .content, using: AuraAttributes(focusSession: "Mindfulness")) {
   AuraLiveActivity()
} contentStates: {
    AuraAttributes.ContentState(quote: "I am present and at peace.", moodEmoji: "🌿", colorHex: "#96CEB4", progress: 0.3)
    AuraAttributes.ContentState(quote: "I embrace the journey before me.", moodEmoji: "⭐", colorHex: "#FDCB6E", progress: 0.7)
}
