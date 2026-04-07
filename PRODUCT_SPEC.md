# Project: I am Aura (Affirmations & Wallpaper)

## Product Specification & Technical Audit

### 1. Product Overview

- **Mission**: A premium, aesthetics-driven application for personalized affirmations based on famous quotes and Home and Lock Screen personalization.
- **Core Value Prop**: Transform daily fammous quotes as personal affirmations into beautiful, high-resolution wallpapers and interactive iOS widgets.
- **Design Language**: "Bento-style" layout, Glassmorphism, and Typography-first aesthetics.

### 2. Core Feature Set

- **Mood-Based Discovery**: 6 curated moods (Confident, Grateful, Peaceful, Focused, Motivational, Romantic) with uniquely weighted quote libraries.
- **Dynamic Customizer**:
  - **Background Types**: Solid Colors, Harmonies (Gradients), Unsplash Imagery, and SVG-based Background Patterns.
  - **Typography**: Unicode text transformation (Stylized Serif, Script, etc.) and Google Font integration (Noto Serif, Inter, Manrope).
  - **Adjustments**: Opacity control, saturation shifting, and drag-and-drop text positioning.
- **Native Widget Synchronization**:
  - Deterministic image rendering for Small, Medium, and Large widget sizes.
  - Real-time native reload triggers via custom bridge.
- **Subscription Management**: RevenueCat integration with multi-tier entitlements and local "Mock Mode" for development.

### 3. Technical Stack

- **Core Framework**: Expo SDK 55 (React Native).
- **Navigation**: Expo Router (File-based routing).
- **Styling**: NativeWind v4 (Tailwind CSS for React Native).
- **State Management**:
  - **Zustand**: Multi-store architecture (Wallpaper, Subscription, Mood, App).
  - **Persistence**: AsyncStorage with JSON serialization for long-term storage.
- **Animations**: React Native Reanimated (Shared values for text transforms and transitions).
- **Assets**:
  - **Images**: Cloudinary (Dynamic resizing/formatting pipeline) + Unsplash (Source metadata).
  - **Capturing**: `react-native-view-shot` for deterministic snapshot generation.

### 4. Native Architecture & Integrations

- **AuraBridge (Custom Module)**:
  - Used for communication between the React Native bridge and iOS `WidgetKit`.
  - Handles Writing to App Group Shared Container (`group.com.sureshbabudj.iamaura`).
  - Methods: `setSharedData(JSON)`, `reloadWidget()`.
- **iOS Extension**:
  - Language: Swift 6.0+.
  - Frameworks: WidgetKit, AppIntents (for interactive triggers).
  - Data Sharing: `UserDefaults(suiteName:)` shared between Target and App.
- **Subscription**:
  - Integrated `react-native-purchases`.
  - Mock layer for local physical device testing without paid developer account.

### 5. Data Models & Constants

- **Wallpaper Schema**: Deep object storing `backgroundValue`, `textAlignment`, `unsplashHref`, and `dominantColor`.
- **Quotes**: Grouped JSON data structures with mood-id indexing.
- **Settings**: Centralized `settingsData.ts` for legal links and attribution management.

### 6. Development & Deployment

- **Build System**: Expo Prebuild (Generated iOS/Android projects).
- **Environment**: Optimized for Mac (Xcode 16 compliance).
- **Analytics/Legal**: Integrated UMAMI for privacy-safe tracking; in-app `expo-web-browser` for legal compliance.

### 7. Core Workflows

- **Widget Sync**: UI Action -> Capture 3 Sizes -> Update Metadata -> Write to Group -> Trigger Native Reload.
- **Onboarding**: First-run detection via `hasSeenOnboarding` persisted in App Store.
- **Library Management**: Local-first persistence with optional "Sync to Widget" as an explicit user action.
