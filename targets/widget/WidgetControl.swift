import AppIntents
import SwiftUI
import WidgetKit

struct WallpaperControl: ControlWidget {
    static let kind: String = "com.sureshbabudj.iamaura.quoteControl"

    var body: some ControlWidgetConfiguration {
        AppIntentControlConfiguration(
            kind: Self.kind,
            provider: Provider()
        ) { value in
            ControlWidgetButton(action: LaunchAppIntent()) {
                Label("New Quote", systemImage: "sparkles")
            }
        }
        .displayName("I Am Aura")
        .description("Quickly open a new affirmation.")
    }
}

extension WallpaperControl {
    struct Value {
        var name: String
    }

    struct Provider: AppIntentControlValueProvider {
        func previewValue(configuration: ControlConfiguration) -> Value {
            WallpaperControl.Value(name: "Aura")
        }

        func currentValue(configuration: ControlConfiguration) async throws -> Value {
            return WallpaperControl.Value(name: "Aura")
        }
    }
}

struct ControlConfiguration: ControlConfigurationIntent {
    static let title: LocalizedStringResource = "Aura Configuration"
}

struct LaunchAppIntent: AppIntent {
    static let title: LocalizedStringResource = "Launch Aura"
    static let openAppWhenRun: Bool = true

    func perform() async throws -> some IntentResult & ReturnsValue<Bool> {
        // This will trigger opening the app via the "iamaura://" scheme
        return .result(value: true)
    }
}
