import ExpoModulesCore

public class WidgetBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WidgetBridge")
    
    // Minimal method to get the App Group path for FileSystem.copyAsync
    Function("getAppGroupPath") { () -> String? in
       let fileManager = FileManager.default
       let bundleId = Bundle.main.bundleIdentifier ?? "UNKNOWN"
       let groupId = "group.com.sureshbabudj.iamaura"
       
       print("WidgetBridge: Requesting path for group \(groupId) from bundle \(bundleId)")
       
       if let groupURL = fileManager.containerURL(forSecurityApplicationGroupIdentifier: groupId) {
         return groupURL.path
       }
       
       print("WidgetBridge ERROR: Could not find container for group \(groupId). Ensure App Groups are enabled in entitlements for both App and Widget targets.")
       return nil
    }
  }
}
