import WidgetKit
import SwiftUI

struct SmallWidgetView: View {
    var entry: WallpaperEntry
    
    // Unicode font styles for different designs
    private let fontStyles: [Font.Design] = [.default, .serif, .rounded, .monospaced]
    
    var body: some View {
        ZStack {
            // Background based on wallpaper type
            Group {
                switch entry.wallpaper.backgroundType {
                case "color":
                    Color(hex: extractHexString(from: entry.wallpaper.backgroundValue) ?? "#FF6B35")
                    
                case "gradient":
                  if let colors = extractStringArray(from: entry.wallpaper.backgroundValue) {
                      LinearGradient(
                          gradient: Gradient(colors: colors.map { Color(hex: $0) }),
                          startPoint: .top,
                          endPoint: .bottom
                      )
                  } else {
                      Color.orange
                  }
                    
                case "image":
                    // For small widget, use blurred thumbnail or color overlay
                    Color(hex: entry.wallpaper.dominantColor ?? "#FF6B35")
                        .overlay(
                            LinearGradient(
                                colors: [.clear, Color.black.opacity(0.3)],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                    
                case "pattern":
                    Color(hex: extractHexString(from: entry.wallpaper.backgroundValue) ?? "#FF6B35")
                        .overlay(
                            PatternOverlay(
                                patternType: entry.wallpaper.patternConfig?.type ?? "dots",
                                color: entry.wallpaper.patternConfig?.color ?? "#FFFFFF",
                                opacity: entry.wallpaper.patternConfig?.opacity ?? 0.1
                            )
                        )
                    
                default:
                    Color.orange
                }
            }
            
            // Content - Centered quote with mood emoji
            VStack(spacing: 4) {
                // Mood emoji at top
                Text(entry.wallpaper.moodEmoji)
                    .font(.system(size: 24))
                
                Spacer(minLength: 4)
                
                // Quote - 1-2 lines max for small widget
                Text(formattedQuote(entry.wallpaper.quote))
                    .font(.system(size: 11, weight: .semibold, design: fontStyle()))
                    .foregroundColor(textColor())
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .minimumScaleFactor(0.8)
                    .padding(.horizontal, 8)
                
                Spacer(minLength: 4)
            }
            .padding(.vertical, 8)
        }
        .widgetURL(URL(string: "affirmations://wallpaper/\(entry.wallpaper.id)"))
    }
    
    // Select font style based on wallpaper config or cycle through
    private func fontStyle() -> Font.Design {
        let styles: [Font.Design] = [.default, .serif, .rounded, .monospaced]
        let index = abs(entry.wallpaper.id.hashValue) % styles.count
        return styles[index]
    }
    
    private func textColor() -> Color {
        Color(hex: entry.wallpaper.textColor)
    }
    
    private func formattedQuote(_ quote: String) -> String {
        // Remove "I am" prefix for small widget to save space
        let cleaned = quote.replacingOccurrences(of: "I am ", with: "")
        return cleaned.prefix(40).description
    }
}

fileprivate extension SmallWidgetView {
    // Tries to extract a single hex color string from `backgroundValue`, which may be String or [String]
    func extractHexString(from value: Any?) -> String? {
        if let s = value as? String { return s }
        if let arr = value as? [String] { return arr.first }
        return nil
    }

    // Tries to extract an array of hex color strings from `backgroundValue`, which may already be [String] or a comma-separated String
    func extractHexArray(from value: Any?) -> [String]? {
        if let arr = value as? [String] { return arr }
        if let s = value as? String {
            // Accept comma or space separated lists like "#FF6B35,#FFD166" or "#FF6B35 #FFD166"
            let separators = CharacterSet(charactersIn: ", ")
            let parts = s.components(separatedBy: separators).filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
            if parts.count > 1 { return parts }
        }
        return nil
    }
}

// Pattern overlay for small widget
struct PatternOverlay: View {
    let patternType: String
    let color: String
    let opacity: Double
    
    var body: some View {
        GeometryReader { geometry in
            Canvas { context, size in
                let patternColor = Color(hex: color).opacity(opacity)
                
                switch patternType {
                case "dots":
                    drawDots(context: context, size: size, color: patternColor)
                case "grid":
                    drawGrid(context: context, size: size, color: patternColor)
                case "lines":
                    drawLines(context: context, size: size, color: patternColor)
                default:
                    drawDots(context: context, size: size, color: patternColor)
                }
            }
        }
    }
    
    private func drawDots(context: GraphicsContext, size: CGSize, color: Color) {
        let spacing: CGFloat = 20
        for x in stride(from: 10, to: size.width, by: spacing) {
            for y in stride(from: 10, to: size.height, by: spacing) {
                context.fill(
                    Path(ellipseIn: CGRect(x: x-2, y: y-2, width: 4, height: 4)),
                    with: .color(color)
                )
            }
        }
    }
    
    private func drawGrid(context: GraphicsContext, size: CGSize, color: Color) {
        let spacing: CGFloat = 30
        var path = Path()
        
        for x in stride(from: 0, to: size.width, by: spacing) {
            path.move(to: CGPoint(x: x, y: 0))
            path.addLine(to: CGPoint(x: x, y: size.height))
        }
        
        for y in stride(from: 0, to: size.height, by: spacing) {
            path.move(to: CGPoint(x: 0, y: y))
            path.addLine(to: CGPoint(x: size.width, y: y))
        }
        
        context.stroke(path, with: .color(color), lineWidth: 1)
    }
    
    private func drawLines(context: GraphicsContext, size: CGSize, color: Color) {
        var path = Path()
        let spacing: CGFloat = 20
        
        for y in stride(from: 0, to: size.height, by: spacing) {
            path.move(to: CGPoint(x: 0, y: y))
            path.addLine(to: CGPoint(x: size.width, y: y))
        }
        
        context.stroke(path, with: .color(color), lineWidth: 0.5)
    }
}
