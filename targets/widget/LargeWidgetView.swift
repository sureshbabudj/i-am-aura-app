import WidgetKit
import SwiftUI

struct LargeWidgetView: View {
    var entry: WallpaperEntry
    
    var body: some View {
        ZStack {
            // Full background
            backgroundLayer
            
            // Content overlay
            contentLayer
        }
        .widgetURL(URL(string: "affirmations://wallpaper/\(entry.wallpaper.id)"))
    }
    
    // MARK: - Background Layer
    private var backgroundLayer: some View {
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
                // For large widget, show image with overlay
                ZStack {
                    Color(hex: entry.wallpaper.dominantColor ?? "#FF6B35")
                    
                    // Image placeholder with gradient overlay for text readability
                    LinearGradient(
                        colors: [
                            Color.clear,
                            Color.black.opacity(0.4),
                            Color.black.opacity(0.6)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                }
                
            case "pattern":
                ZStack {
                    Color(hex: entry.wallpaper.backgroundValue as? String ?? "#FF6B35")
                    
                    LargePatternOverlay(
                        patternType: entry.wallpaper.patternConfig?.type ?? "dots",
                        color: entry.wallpaper.patternConfig?.color ?? "#FFFFFF",
                        opacity: entry.wallpaper.patternConfig?.opacity ?? 0.1,
                        scale: entry.wallpaper.patternConfig?.scale ?? 1.0
                    )
                }
                
            default:
                Color.orange
            }
        }
    }
    
    // MARK: - Content Layer
    private var contentLayer: some View {
        VStack(spacing: 0) {
            // Top: Mood header
            headerSection
            
            Spacer()
            
            // Middle: Main quote with styling
            quoteSection
            
            Spacer()
            
            // Bottom: Action hint
            footerSection
        }
        .padding(20)
    }
    
    // MARK: - Header
    private var headerSection: some View {
        HStack {
            HStack(spacing: 8) {
                Text(entry.wallpaper.moodEmoji)
                    .font(.system(size: 32))
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(entry.wallpaper.moodName.uppercased())
                        .font(.system(size: 12, weight: .semibold, design: .default))
                        .tracking(2)
                        .foregroundColor(textColor())
                    
                    Text("Daily Affirmation")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(textColor().opacity(0.6))
                }
            }
            
            Spacer()
            
            // Date
            Text(entry.date, style: .date)
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(textColor().opacity(0.5))
        }
    }
    
    // MARK: - Quote Section
    private var quoteSection: some View {
        VStack(spacing: 16) {
            // "I am" prefix with special styling
            HStack {
                Spacer()
                Text("I am")
                    .font(.system(size: 24, weight: .light, design: fontDesign()))
                    .foregroundColor(textColor().opacity(0.7))
                    .italic()
                Spacer()
            }
            
            // Main quote with dynamic font sizing
            Text(formattedQuote(entry.wallpaper.quote))
                .font(quoteFont())
                .foregroundColor(textColor())
                .multilineTextAlignment(.center)
                .lineSpacing(6)
                .minimumScaleFactor(0.7)
                .padding(.horizontal, 10)
            
            // Decorative line
            Rectangle()
                .fill(textColor().opacity(0.3))
                .frame(width: 60, height: 2)
        }
    }
    
    // MARK: - Footer
    private var footerSection: some View {
        HStack {
            // Pattern indicator if applicable
            if entry.wallpaper.backgroundType == "pattern" {
                HStack(spacing: 4) {
                    Image(systemName: "scribble")
                        .font(.system(size: 10))
                    Text(entry.wallpaper.patternConfig?.type ?? "pattern")
                        .font(.system(size: 9))
                }
                .foregroundColor(textColor().opacity(0.4))
            }
            
            Spacer()
            
            Text("Tap to open app →")
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(textColor().opacity(0.6))
        }
    }
    
    // MARK: - Helpers
    
    private func formattedQuote(_ quote: String) -> String {
        // Remove "I am " prefix since we show it separately
        return quote.replacingOccurrences(of: "I am ", with: "")
    }
    
    private func quoteFont() -> Font {
        let designs: [Font.Design] = [.serif, .rounded, .default, .monospaced]
        let design = designs[abs(entry.wallpaper.id.hashValue) % designs.count]
        
        // Size based on quote length
        let length = entry.wallpaper.quote.count
        let size: CGFloat
        if length < 30 {
            size = 32
        } else if length < 50 {
            size = 28
        } else {
            size = 24
        }
        
        return .system(size: size, weight: .semibold, design: design)
    }
    
    private func fontDesign() -> Font.Design {
        let designs: [Font.Design] = [.serif, .rounded, .default, .monospaced]
        return designs[abs(entry.wallpaper.id.hashValue) % designs.count]
    }
    
    private func textColor() -> Color {
        Color(hex: entry.wallpaper.textColor)
    }
}

// Large widget pattern overlay (full featured)
struct LargePatternOverlay: View {
    let patternType: String
    let color: String
    let opacity: Double
    let scale: Double
    
    var body: some View {
        GeometryReader { geometry in
            let scaledSize = CGSize(
                width: geometry.size.width / CGFloat(scale),
                height: geometry.size.height / CGFloat(scale)
            )
            
            Canvas { context, size in
                let patternColor = Color(hex: color).opacity(opacity)
                
                switch patternType {
                case "dots":
                    drawDots(context: context, size: size, color: patternColor, scale: scale)
                case "grid":
                    drawGrid(context: context, size: size, color: patternColor, scale: scale)
                case "lines":
                    drawLines(context: context, size: size, color: patternColor, scale: scale)
                case "waves":
                    drawWaves(context: context, size: size, color: patternColor, scale: scale)
                case "hexagons":
                    drawHexagons(context: context, size: size, color: patternColor, scale: scale)
                case "triangles":
                    drawTriangles(context: context, size: size, color: patternColor, scale: scale)
                case "checkerboard":
                    drawCheckerboard(context: context, size: size, color: patternColor, scale: scale)
                default:
                    drawDots(context: context, size: size, color: patternColor, scale: scale)
                }
            }
        }
    }
    
    private func drawDots(context: GraphicsContext, size: CGSize, color: Color, scale: Double) {
        let spacing: CGFloat = 40 * CGFloat(scale)
        for x in stride(from: spacing/2, to: size.width, by: spacing) {
            for y in stride(from: spacing/2, to: size.height, by: spacing) {
                context.fill(
                    Path(ellipseIn: CGRect(x: x-4, y: y-4, width: 8, height: 8)),
                    with: .color(color)
                )
            }
        }
    }
    
    private func drawGrid(context: GraphicsContext, size: CGSize, color: Color, scale: Double) {
        var path = Path()
        let spacing: CGFloat = 50 * CGFloat(scale)
        
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
    
    private func drawLines(context: GraphicsContext, size: CGSize, color: Color, scale: Double) {
        var path = Path()
        let spacing: CGFloat = 30 * CGFloat(scale)
        
        for y in stride(from: 0, to: size.height, by: spacing) {
            path.move(to: CGPoint(x: 0, y: y))
            path.addLine(to: CGPoint(x: size.width, y: y))
        }
        
        context.stroke(path, with: .color(color), lineWidth: 0.5)
    }
    
    private func drawWaves(context: GraphicsContext, size: CGSize, color: Color, scale: Double) {
        var path = Path()
        let amplitude: CGFloat = 10 * CGFloat(scale)
        let wavelength: CGFloat = 40 * CGFloat(scale)
        
        for y in stride(from: 30, to: size.height, by: 60 * CGFloat(scale)) {
            path.move(to: CGPoint(x: 0, y: y))
            for x in stride(from: 0, to: size.width, by: 5) {
                let relativeX = x.truncatingRemainder(dividingBy: wavelength)
                let angle = (relativeX / wavelength) * 2 * .pi
                let yOffset = sin(angle) * amplitude
                path.addLine(to: CGPoint(x: x, y: y + yOffset))
            }
        }
        
        context.stroke(path, with: .color(color), lineWidth: 1.5)
    }
    
    private func drawHexagons(context: GraphicsContext, size: CGSize, color: Color, scale: Double) {
        let hexSize: CGFloat = 20 * CGFloat(scale)
        let width: CGFloat = hexSize * 2
        let height: CGFloat = sqrt(3) * hexSize
        
        var path = Path()
        
        for row in 0..<Int(size.height / height) + 2 {
            for col in 0..<Int(size.width / width) + 2 {
                let xOffset = (CGFloat(row % 2) * width / 2)
                let x = CGFloat(col) * width + xOffset
                let y = CGFloat(row) * height
                
                let hex = createHexagonPath(x: x, y: y, size: hexSize)
                path.addPath(hex)
            }
        }
        
        context.stroke(path, with: .color(color), lineWidth: 1)
    }
    
    private func createHexagonPath(x: CGFloat, y: CGFloat, size: CGFloat) -> Path {
        var path = Path()
        for i in 0..<6 {
            let angle = CGFloat(i) * .pi / 3 - .pi / 2
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
    
    private func drawTriangles(context: GraphicsContext, size: CGSize, color: Color, scale: Double) {
        let spacing: CGFloat = 40 * CGFloat(scale)
        var path = Path()
        
        for x in stride(from: 0, to: size.width, by: spacing) {
            for y in stride(from: 0, to: size.height, by: spacing) {
                let triangle = createTriangle(x: x + spacing/2, y: y + spacing/2, size: 15 * CGFloat(scale))
                path.addPath(triangle)
            }
        }
        
        context.stroke(path, with: .color(color), lineWidth: 1)
    }
    
    private func createTriangle(x: CGFloat, y: CGFloat, size: CGFloat) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: x, y: y - size))
        path.addLine(to: CGPoint(x: x + size, y: y + size))
        path.addLine(to: CGPoint(x: x - size, y: y + size))
        path.closeSubpath()
        return path
    }
    
    private func drawCheckerboard(context: GraphicsContext, size: CGSize, color: Color, scale: Double) {
        let squareSize: CGFloat = 30 * CGFloat(scale)
        
        for x in stride(from: 0, to: size.width, by: squareSize * 2) {
            for y in stride(from: 0, to: size.height, by: squareSize * 2) {
                context.fill(
                    Path(CGRect(x: x, y: y, width: squareSize, height: squareSize)),
                    with: .color(color)
                )
                context.fill(
                    Path(CGRect(x: x + squareSize, y: y + squareSize, width: squareSize, height: squareSize)),
                    with: .color(color)
                )
            }
        }
    }
}
