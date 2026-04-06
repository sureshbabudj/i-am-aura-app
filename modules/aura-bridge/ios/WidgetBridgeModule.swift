import ExpoModulesCore
import WidgetKit

public class WidgetBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WidgetBridge")
    
    // Minimal method to get the App Group path for FileSystem.copyAsync
    Function("getAppGroupPath") { () -> String? in
        let groupId = "group.com.sureshbabudj.iamaura"
        if let groupURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: groupId) {
            return groupURL.path
        }
        return nil
    }

    Function("setSharedData") { (groupId: String, key: String, data: [String: Any]) in
        let defaults = UserDefaults(suiteName: groupId)
        defaults?.set(data, forKey: key)
        defaults?.synchronize()
        print("AuraBridge: Set data for \(key) in \(groupId)")
    }

    Function("reloadWidget") { () in
        #if canImport(WidgetKit)
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
            print("AuraBridge: Reloaded all timelines")
        }
        #endif
    }
  }
}
