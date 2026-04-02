# Aura - Quotes & Wallpapers

A personalized mobile application designed to improve the user's mental well-being through high-frequency positive quotes and aesthetic visual customization. This app functions as a cognitive retelling tool, helping you reframe the user's subconscious belief systems via micro-engagements with constructive thought patterns.

## 🚀 Core Features

### 🎨 Visual Wallpapers & Personalization

- **Mood-Based Backgrounds**: High-resolution imagery from a dynamic Cloudinary-powered library sourced from unsplash CC attributed free to use images, filtered specifically to match the user's current emotional state.
- **Dynamic Gradients**: Mood-specific gradient presets that automatically align with the user's selected intent (Confident, Peaceful, Focused, etc.).
- **Pattern Overlays**: Intricate geometric pattern generators (Grid, Dots, Waves) with customizable scale and opacity.
- **Advanced Adjustments**: Fine-tune background image opacity and saturation to ensure maximum text readability.

### ✍️ Affirmation Personalization

- **Custom Content**: Create and edit the user's own quotes or use curated, mood-based collections.
- **Typography Engine**: Choose from a selection of premium fonts and specialized text styles (Serif, Script, Monospace).
- **Styling Controls**: Adjust text alignment, sizing, and opacity directly on an interactive canvas.

### 🖼️ Widget Ecosystem

- **Instant Previews**: View the user's quotes exactly as they will appear on the user's Home and Lock screens.
- **Multi-Size Support**: Pre-designed layouts for Small, Medium, and Large widgets ensuring critical visibility in high-traffic device areas.
- **Native Bridge**: Direct integration with iOS/Android widget targets for seamless background updates.

### 📖 Library & Daily Moods

- **Collection Management**: Save the user's favorite creations for quick access.
- **Daily Rotation**: Set specific wallpapers as the user's "Daily" choice to anchor the user's emotional state throughout the day.
- **Favorites**: Mark best-performing quotes for easy retrieval.

---

## 🛠️ Technical Architecture

### **Built With**

- **Framework**: [Expo](https://expo.dev/) (React Native) for cross-platform performance.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persistent storage for reliable user configurations.
- **Image Engine**: [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) for high-performance caching and smooth transitions.
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS) + React Native StyleSheet for high-fidelity component design.
- **Components**: [Lucide React Native](https://lucide.dev/) for intuitive iconography.

### **Key Systems**

- **Cloudinary Integration**: Dynamic URL transformation for on-the-fly image upscaling and optimization.
- **Custom SVG Patterns**: Procedural generation of wallpaper patterns using \`react-native-svg\`.
- **Zustand Middleware**: Persistent state leveraging \`AsyncStorage\` to ensure user customizations survive app restarts.

---

## 🧠 Scientific Foundation

The 'Aura' app is grounded in **Self-Affirmation Theory** and **Neuroplasticity**. By repeatedly exposing the brain to positive scripts in high-visibility areas like the phone lock screen, the app helps strengthen neural pathways associated with self-worth and resilience.

### **Observed Benefits**

| Outcome               | Psychological Implication                                |
| :-------------------- | :------------------------------------------------------- |
| **Self-Perception**   | Significant boost in sense of worth and competence.      |
| **Well-Being**        | Improvement in mood and daily life satisfaction.         |
| **Anxiety Reduction** | Buffer against external stressors and negative thoughts. |

---

## 📦 Installation & Development

1. **Clone the repository**
2. **Install dependencies**: \`npm install\`
3. **Start the development server**: \`npx expo start\`
4. **Open in simulator**: Press \`i\` for iOS or \`a\` for Android.

---

## 📋 Project Roadmap

- [x] Cloudinary Image Migration
- [x] Mood-Specific Gradient Defaults
- [x] Dynamic Pattern Generators
- [x] Horizontal Selection Interface
- [ ] AI-Powered Affirmation Generation (Coming Soon)
- [ ] Community Mood Packs (Planned)

---

_Transform the user's internal dialogue, one wallpaper at a time._
