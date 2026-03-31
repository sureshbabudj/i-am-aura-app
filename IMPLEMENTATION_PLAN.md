### 1. App name & positioning

- **Name**: `I Am - Mood Affirmations & Wallpapers`  
- **One‑sentence positioning**:  
  - “Pick a mood, an affirmation, and style it as a wallpaper; keep it in your widget.”  
- **Monetization model**:  
  - Free tier + **one‑time purchase** (no subscription).  

***

### 2. Core concepts

- **Mood**: `motivational`, `romantic`, `happy`, `sad`, `empathy`, `focused`, etc.  
- **Affirmation**: 1–2‑line text, curated per mood.  
- **Background**:  
  - `color` (solid).  
  - `pattern` (grid, lines, swatches, “boxes in a box”).  
  - `image` (mood‑matched, CC0 / CC‑BY‑only).  
- **Widget**:  
  - iOS‑style Home Screen / Lock Screen widget that shows the **current affirmation** (with optional subtle background).

***

### 3. User flow (high‑level)

1. **Onboarding (1–2 screens)**  
   - Skip‑able tour showing:  
     - “Pick mood → Pick affirmation → Style wallpaper → Save as affirmation for widget.”

2. **Home screen**  
   - Tabs:  
     - `Moods` (grid: motivational, romantic, happy, sad, empathy, focused, etc.).  
     - `My Affirmations` (favorites / saved wallpapers).  
     - `Today` (current affirmation‑wallpaper + widget preview).  

3. **Mood → Affirmation**  
   - User picks a mood → list of 1–2‑line affirmations.  
   - Tap one affirmation → open **Customize screen**.

4. **Customize screen**  
   - Full wallpaper‑style preview (text + background).  
   - Config overlays:  
     - `Background` (color / pattern / image).  
     - `Text` (color, size, vertical + text alignment).  
     - `Image / pattern` (opacity, saturation, grayscale).  
   - Buttons: `Save as affirmation`, `Apply as wallpaper`, `Set as daily affirmation`.

5. **Widget**  
   - Widget shows **current affirmation** (text + tiny mood icon + optional background‑style tint).  
   - Tapping widget opens app to the **full affirmation‑wallpaper**.

***

### 4. Entities and data model

#### 4.1 Moods
- `id` (string)  
- `name`: `motivational`, `romantic`, `happy`, `sad`, `empathy`, `focused`, etc.  
- `icon`: optional icon key.  

#### 4.2 Affirmations
- `id` (string)  
- `mood_id` (ref)  
- `text`: 1–2‑line string.  
- `source` (optional: author / quote source).  
- `license_type` (e.g., `none`, `CC0`, `CC_BY`).  

#### 4.3 Background Definitions

- **Color background**  
  - `type`: `"color"`  
  - `hex`: `"#123456"`  
  - `opacity`: `0.0–1.0` (default: `1.0`).  

- **Pattern background**  
  - `type`: `"pattern"`  
  - `pattern_type`: `"grid"`, `"lines"`, `"swatches"`, `"boxes_in_box"`.  
  - `color`: `"#123456"`  
  - `opacity`: `0.0–1.0` (default: `0.3`).  

- **Image background**  
  - `type`: `"image"`  
  - `provider`: `"cc0_pexels"`, `"cc0_unsplash"`, etc.  
  - `image_id` (string, hash or key)  
  - `url` (original, with attribution metadata).  
  - `opacity`: `0.0–1.0` (default: `0.4`).  
  - `saturation`: `0.0–1.0` (0.0 = grayscale, 1.0 = full color).  
  - `blur` (optional boolean or radius value).  

#### 4.4 AffirmationWallpaper (styled instance)

- `id` (string)  
- `user_id` (optional if offline‑only).  
- `affirmation_id` (ref).  
- `mood_id` (ref).  
- `created_at` (timestamp).  
- `is_favorite` (bool).  
- `is_daily` (bool; “today’s affirmation”).  
- `background_json`: full background definition (color / pattern / image).  
- `style`:  
  - `text_color`: hex.  
  - `text_size`: `small`, `medium`, `large` (or numeric).  
  - `vertical_alignment`: `top`, `center`, `bottom`.  
  - `horizontal_alignment`: `left`, `center`, `right`.  
  - `text_opacity`: `0.0–1.0`.  

#### 4.5 WidgetState (per‑device, optional)

- `current_affirmation_wallpaper_id` (string; ref to `AffirmationWallpaper`).  
- `widget_type`: `small`, `medium`, `large`.  
- `widget_background_style` (e.g., `none`, `tint_only`, `blur_thumbnail`).  

***

### 5. Screens & UI flows

#### 5.1 Screen 1: Onboarding (optional)
- Screens:  
  - `Welcome`  
  - `How it works`: mood → affirmation → customize → wallpaper → widget.  
- Action:  
  - `Skip` → go to **Home screen**.  
  - `Get started` → same.

#### 5.2 Screen 2: Home (Tabs)
- Bottom tab bar:  
  - Tab 1: `Moods`  
  - Tab 2: `My Affirmations`  
  - Tab 3: `Today`  

States:
- `Moods` tab:  
  - Horizontal list or grid of moods (icons + labels).  
  - Tap on mood → open **AffirmationList screen**.  

- `My Affirmations` tab:  
  - Cards: each card = `AffirmationWallpaper` (small preview + text snippet).  
  - Tap → open `Customize` for that wallpaper.  
  - Long‑tap: context menu (Delete, Move to favorites, Set as daily) (if favorites in‑free).  

- `Today` tab:  
  - Large card showing:  
    - Current `AffirmationWallpaper` full preview.  
    - Action buttons: `Edit`, `Apply as wallpaper`, `Save as widget`.  

#### 5.3 Screen 3: AffirmationList
- Path: `mood_id` parameter.  
- UI:  
  - Vertical list of affirmations for that mood.  
  - Each row:  
    - `text` (1–2 lines).  
    - `mood_icon` (tiny).  
    - `source` (small, below, if present).  
- Actions:  
  - `Tap` → open `Customize` for that affirmation + default empty background.  
  - `Heart` icon (optional in free) → mark as favorite (if in‑free).  

#### 5.4 Screen 4: Customize
Layout:
- Full‑screen background preview (phone‑sized canvas).  
- Bottom sheet / overlay controls:

Sections:

1. **Background overlay**  
   - Field: `Background type`: radio / segmented picker.  
     - options: `Color`, `Pattern`, `Image`.  
   - If `Color`:  
     - Color picker (hex + eyedropper‑style, if available).  
     - Opacity slider (0.0–1.0, default: `1.0`).  
   - If `Pattern`:  
     - Pattern picker: `Grid`, `Lines`, `Swatches`, `Boxes in a box`.  
     - Pattern color picker.  
     - Pattern opacity slider (default: `0.3`).  
   - If `Image`:  
     - Lazy‑loaded grid of mood‑matched CC images (for that mood).  
     - Parameters:  
       - `Image opacity` slider (default: `0.4`).  
       - `Saturation` slider (0.0–1.0; `0.0` = grayscale).  
       - Optional `Blur` toggle / slider.  

2. **Text style overlay**  
   - `Text color` picker.  
   - `Text size` picker: small, medium, large.  
   - `Vertical alignment`: segmented: `Top`, `Center`, `Bottom`.  
   - `Text alignment`: `Left`, `Center`, `Right`.  
   - `Text opacity` slider.  

Buttons (bottom):
- `Save as affirmation` (updates current `AffirmationWallpaper` or creates a new one).  
- `Save as daily affirmation` → marks `is_daily = true`, and notifies widget‑system.  
- `Apply as wallpaper` → calls iOS wallpaper‑set API (or save to gallery + instruct user to set manually).  
- `Back` → go back to `AffirmationList` or `My Affirmations` (contextual).  

#### 5.5 Screen 5: Today / Widget‑Preview
- Shows:  
  - `AffirmationWallpaper` preview (same as `Customize` canvas, read‑only).  
  - `Mood` + `text` + metadata (e.g., `Source: John Doe`).  
  - Actions:  
    - `Edit` → open `Customize` for that `AffirmationWallpaper`.  
    - `Apply as wallpaper`.  
    - `Copy to widget` (if not already set).  

This is effectively your **“widget anchor” screen**.

***

### 6. Widget (iOS‑style)

#### 6.1 Widget types

- `Small`  
  - Area: ~1×1 (iOS‑style).  
  - Content:  
    - 1 line of text (truncated if needed).  
    - Tiny mood icon.  
    - Optionally: background tint matching the affirmation’s main color.

- `Medium`  
  - Area: ~2×1 (iOS‑style).  
  - Content:  
    - 1–2 lines of text.  
    - Mood icon.  
    - Optional: very light background pattern (e.g., faint grid) or blur tint.  

- `Large` (optional)  
  - Area: ~2×2 or 3×1.  
  - Content:  
    - 1–2 lines of text.  
    - Mood icon + “mood name”.  
    - Soft background color (same as wallpaper base color, low opacity).

#### 6.2 Widget data source

- The app exposes a **CurrentAffirmationProvider** (widget‑extension‑style service):  
  - Picks the `AffirmationWallpaper` that is `is_daily = true` or falls in rotation (if you implement rotation).  
  - Returns structured data to the widget:  
    - `text` (1–2 lines).  
    - `mood_name`.  
    - `mood_icon_key`.  
    - `background_color` (base color from `background_json.hex` or dominant color from image).  
    - `background_pattern_type` (optional, if you want pattern‑style tint).  

#### 6.3 Widget actions

- `Tap` on widget:  
  - Opens app → navigates to `Today` screen → scroll to that `AffirmationWallpaper`.  
- `Long‑tap` / widget edit:  
  - Lets user pick:  
    - `Current daily affirmation` (list of saved `AffirmationWallpaper`).  
    - `Widget size` / `Widget style` (tint‑only vs no‑background).  

***

### 7. States and transitions

- **States**  
  - `onboarding_shown` (bool, once).  
  - `current_affirmation_wallpaper_id` (string; current daily).  
  - `affirmation_list_filter` (mood‑id).  

- **Transitions**  
  - `Home → AffirmationList` → `Customize` → `Save` → `Today` (auto‑scroll to saved one).  
  - `Widget` → `Launch app` → `Today` → `Customize` (if user wants to re‑style).  

***

### 8. One‑time purchase breakdown

- **Free tier**  
  - All moods (UI‑only).  
  - Limited affirmation library (e.g., 10 affirmations per mood).  
  - Limited patterns: only `Grid` and `Lines` (no `Swatches` / `Boxes in a box`).  
  - Limited images: only 1–2 CC0 packs per mood.  
  - No widget background (widget shows text + icon only).  

- **Paid tier (one‑time purchase)**  
  - Unlock all affirmations.  
  - Unlock all patterns + opacity controls.  
  - Unlock all CC0 / CC‑BY image packs (with built‑in attribution layer).  
  - Widget background: allow user to choose which of their saved `AffirmationWallpaper` is applied as widget background (tint / pattern / blur).  
  - No ads.  

Paid‑only properties stored as `feature_flags` or similar; unlocking via IAP‑receipt‑validation (or, if Apple‑only, via StoreKit).

***

### 9. Attribution / CC compliance layer

- For each `Image background` record:  
  - Store:  
    - `attribution_name` (e.g., “John Doe”).  
    - `attribution_source_url`.  
    - `license_type` (`CC0`, `CC_BY`, etc.).  
    - `license_url` (e.g., `https://creativecommons.org/licenses/by/4.0/`).  
- **In‑app UI**:  
  - Tiny “i” / “info” icon next to image thumbnails.  
  - Long‑press or tap to open an **attribution popup** (1–2 lines + link).  
- **Settings screen**:  
  - `Attributions` section: scrollable list of all CC images used, with their metadata.

***

### 10. Tech‑agnostic assumptions (implementation‑neutral)

- App is **phone‑only**, portrait‑optimized.  
- Uses **offline‑first** storage for affirmations & wallpapers (local db + sync for multi‑device if you decide later).  
- Widget is **iOS‑style** (Home Screen + Lock Screen, depending on iOS version); Android can follow similar widget patterns.  
- UI components:  
  - Color picker  
  - Opacity / saturation sliders  
  - Segmented controls (radio‑style for alignment, background type)  
  - Grid of images (mood‑matched)  