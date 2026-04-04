import WidgetKit
import SwiftUI

func extractString(from any: Any?) -> String? {
    // Unwrap optionals
    guard let value = any else { return nil }

    // Direct String
    if let s = value as? String { return s }

    // If it's an Optional-wrapped value, unwrap via Mirror
    let mirror = Mirror(reflecting: value)
    if mirror.displayStyle == .optional {
        if let child = mirror.children.first { return extractString(from: child.value) }
        return nil
    }

    // Try common wrapper types (e.g., AnyCodable-like) that expose an internal `value`
    if let child = Mirror(reflecting: value).children.first(where: { $0.label == "value" }) {
        return extractString(from: child.value)
    }

    return nil
}

func extractStringArray(from any: Any?) -> [String]? {
    // Unwrap optionals
    guard let value = any else { return nil }

    // Direct [String]
    if let arr = value as? [String] { return arr }

    // If it's an Optional-wrapped value, unwrap via Mirror
    let mirror = Mirror(reflecting: value)
    if mirror.displayStyle == .optional {
        if let child = mirror.children.first { return extractStringArray(from: child.value) }
        return nil
    }

    // Try common wrapper types (e.g., AnyCodable-like) that expose an internal `value`
    if let child = Mirror(reflecting: value).children.first(where: { $0.label == "value" }) {
        return extractStringArray(from: child.value)
    }

    return nil
}

struct MediumWidgetView: View {
    var entry: WallpaperEntry
    
    var body: some View {
        HStack(spacing: 0) {
            // Left side: Visual element (mood icon/gradient)
            leftPanel
            
            // Right side: Quote content
            rightPanel
        }
        .widgetURL(URL(string: "affirmations://wallpaper/\(entry.wallpaper.id)"))
    }
    
    // MARK: - Left Panel (Visual)
    private var leftPanel: some View {
        ZStack {
            // Background
            Group {
                switch entry.wallpaper.backgroundType {
                case "color":
                    Color(hex: extractString(from: entry.wallpaper.backgroundValue) ?? "#FF6B35")
                    
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
                    // Show dominant color with image hint
                    Color(hex: entry.wallpaper.dominantColor ?? "#FF6B35")
                        .overlay(
                            Image(systemName: "photo.fill")
                                .font(.system(size: 30))
                                .foregroundColor(.white.opacity(0.3))
                        )
                    
                case "pattern":
                    Color(hex: extractString(from: entry.wallpaper.backgroundValue) ?? "#FF6B35")
                        .overlay(
                            MediumPatternOverlay(
                                patternType: entry.wallpaper.patternConfig?.type ?? "dots",
                                color: entry.wallpaper.patternConfig?.color ?? "#FFFFFF",
                                opacity: entry.wallpaper.patternConfig?.opacity ?? 0.15
                            )
                        )
                    
                default:
                    Color.orange
                }
            }
            
            // Mood emoji centered
            VStack {
                Text(entry.wallpaper.moodEmoji)
                    .font(.system(size: 48))
                
                Text(entry.wallpaper.moodName.uppercased())
                    .font(.system(size: 10, weight: .medium, design: .default))
                    .foregroundColor(.white.opacity(0.8))
                    .tracking(2)
            }
        }
        .frame(width: 100)
    }
    
    // MARK: - Right Panel (Content)
    private var rightPanel: some View {
        ZStack {
            // Subtle background from wallpaper
            Color(hex: extractString(from: entry.wallpaper.backgroundValue) ?? "#FFFFFF")
                .opacity(0.05)
            
            VStack(alignment: .leading, spacing: 8) {
                // Header
                HStack {
                    Text("TODAY I AM...")
                        .font(.system(size: 10, weight: .semibold, design: .default))
                        .foregroundColor(textColor().opacity(0.6))
                        .tracking(1)
                    
                    Spacer()
                    
                    // Small mood icon
                    Text(entry.wallpaper.moodEmoji)
                        .font(.system(size: 14))
                }
                
                // Main quote - 2-3 lines
                Text(entry.wallpaper.quote)
                    .font(.system(size: 16, weight: .semibold, design: fontDesign()))
                    .foregroundColor(textColor())
                    .lineSpacing(2)
                    .lineLimit(3)
                    .minimumScaleFactor(0.85)
                
                Spacer(minLength: 0)
                
                // Footer hint
                HStack {
                    Spacer()
                    Text("Tap to view")
                        .font(.system(size: 9))
                        .foregroundColor(textColor().opacity(0.4))
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            LinearGradient(
                colors: [
                    Color(hex: extractString(from: entry.wallpaper.backgroundValue) ?? "#FFFFFF").opacity(0.1),
                    Color.clear
                ],
                startPoint: .leading,
                endPoint: .trailing
            )
        )
    }
    
    private func fontDesign() -> Font.Design {
        let designs: [Font.Design] = [.default, .serif, .rounded, .monospaced]
        let index = abs(entry.wallpaper.id.hashValue) % designs.count
        return designs[index]
    }
    
    private func textColor() -> Color {
        Color(hex: entry.wallpaper.textColor)
    }
}

// Medium widget pattern overlay (more detailed)
struct MediumPatternOverlay: View {
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
                case "waves":
                    drawWaves(context: context, size: size, color: patternColor)
                case "hexagons":
                    drawHexagons(context: context, size: size, color: patternColor)
                default:
                    drawDots(context: context, size: size, color: patternColor)
                }
            }
        }
    }
    
    private func drawDots(context: GraphicsContext, size: CGSize, color: Color) {
        for x in stride(from: 15, to: size.width, by: 25) {
            for y in stride(from: 15, to: size.height, by: 25) {
                context.fill(
                    Path(ellipseIn: CGRect(x: x-3, y: y-3, width: 6, height: 6)),
                    with: .color(color)
                )
            }
        }
    }
    
    private func drawGrid(context: GraphicsContext, size: CGSize, color: Color) {
        var path = Path()
        let spacing: CGFloat = 30
        
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
        for y in stride(from: 0, to: size.height, by: 20) {
            path.move(to: CGPoint(x: 0, y: y))
            path.addLine(to: CGPoint(x: size.width, y: y))
        }
        context.stroke(path, with: .color(color), lineWidth: 0.5)
    }
    
    private func drawWaves(context: GraphicsContext, size: CGSize, color: Color) {
        var path = Path()
        for y in stride(from: 20, to: size.height, by: 40) {
            path.move(to: CGPoint(x: 0, y: y))
            for x in stride(from: 0, to: size.width, by: 20) {
                path.addQuadCurve(
                    to: CGPoint(x: x + 10, y: y),
                    control: CGPoint(x: x + 5, y: y - 10)
                )
            }
        }
        context.stroke(path, with: .color(color), lineWidth: 1)
    }
    
    private func drawHexagons(context: GraphicsContext, size: CGSize, color: Color) {
        // Simplified hexagon pattern
        let width: CGFloat = 30
        let height: CGFloat = 26
        var path = Path()
        
        for row in 0..<Int(size.height / height) + 1 {
            for col in 0..<Int(size.width / width) + 1 {
                let x = CGFloat(col) * width + (CGFloat(row % 2) * width / 2)
                let y = CGFloat(row) * height
                let hex = createHexagon(x: x, y: y, size: 12)
                path.addPath(hex)
            }
        }
        
        context.stroke(path, with: .color(color), lineWidth: 1)
    }
    
    private func createHexagon(x: CGFloat, y: CGFloat, size: CGFloat) -> Path {
        var path = Path()
        for i in 0..<6 {
            let angle = CGFloat(i) * .pi / 3
            let px = x + size * cos(angle)
            let py = y + size * sin(angle)
            if i == 0 {
                path.move(to: CGPoint(x: px, y: py))
            } else {
                path.addLine(to: CGPoint(x: px, y: py))
            }
        }
        path.closeSubpath()
        return path
    }
}
