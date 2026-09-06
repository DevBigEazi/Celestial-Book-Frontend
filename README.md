# Celestial Book (CB) 📖✨

> An atmospheric, AI-supported social reading sanctuary where readers discover their next world based on tropes, mood, atmosphere, and emotional depth.

---

## 🌟 Product Vision

Celestial Book transforms book discovery into entering a personal reading world rather than browsing a generic bookstore. It combines a deep **Reader Persona Quiz**, **Swipe Your Stars** discovery, **TBR & Library** tracking, and **Book Clubs & Circles** centered on shared emotional reactions.

$$\text{DISCOVER} \longrightarrow \text{PERSONALIZE} \longrightarrow \text{READ} \longrightarrow \text{CONNECT}$$

---

## 🚀 Key Features (PRD Compliant)

### 1. Our Manifesto & Welcome
- Atmospheric onboarding introducing the Celestial Book philosophy: *"Books are more than pages. They are places we escape to, emotions we feel deeply, stories that stay with us long after they end."*
- Choice to dive directly into the deep Reader Persona Quiz or explore immediately.

### 2. Deep Reader Persona Quiz
- **Part I: Deep Questions** (Yes/No emotional questions: *"Would you want him to burn down the world for you?", "Could you love the villain of the story?", "Would you let them ruin you, just to be remembered?"*).
- **Part II: Reading Mood Sliders** (Dual-pole spectrums: Slow Burn ↔ Fast Plot; Tender ↔ Brutal; Bittersweet ↔ Triumphant; Intimate Room ↔ Whole Empire; First Person ↔ Third Person).
- **Part III: In Your Own Words** (*"Where should the story take you?"* and *"In which book are you currently residing?"*).
- **Part IV: Tropes & Genres** (Selection of tropes such as Enemies to Lovers, Found Family, Dark Academia, Morally Gray, Yearning, etc.).
- **Resulting Persona**: Unique reading identities like `Romantic · Atmospheric · Slow Burn`.

### 3. Home & Multi-Mode Discovery
- Personalized starting point displaying recommendations, active Reader Persona, TBR highlights, and recommended Book Circles.
- **Comfort Mode**: *"Show me something I already know I will probably love."*
- **Exploration Mode**: *"Show me something new."*
- **Surprise Me**: An unexpected recommendation tailored to your profile.
- Priority boosting for indie, niche, and less-renowned authors.

### 4. Swipe Your Stars
- Dedicated 1-card-at-a-time discovery stack.
- Atmospheric metadata: cover, title, author, atmosphere/vibe tag (e.g. `MAGICAL`), tropes, synopsis, and AI-curated *"Why This Book"* rationales.
- Gesture controls: **Like / Heart** (saves to Library & TBR with positive affinity) and **Reject / Cross** (removes and refines recommendations).

### 5. TBR & Library
- **To Be Read (TBR)**: Manage reading journeys across **Want to Read**, **Currently Reading**, and **Finished**.
- **Connected Library**: Track owned books, integrating with Google Play Books, Amazon affiliate, and physical libraries.

### 6. Book Clubs & Circles
- Small circles of readers: *Midnight Romantics* (reading *The Night Circus*), *Ink & Oak* (reading *Babel*), *Gothic Tides* (reading *Piranesi*).
- Search circles by book title, author, genre, or club name. Create custom circles.
- In-circle discussion focused on emotional reactions: **Happy**, **Sad**, **Angry**, **Surprised**, and **Emotionally Invested**.

### 7. Your Orbit (Settings)
- **Profile & Account**: Editable display name, email, Reader Persona, sign in/out, and account cancellation.
- **Language**: Native language names (English, Deutsch, Español, Français, Italiano, Português, Nederlands, العربية, 한국어, 中文, 日本語, Türkçe, Shqip).
- **Background & Fonts (Personal Appearance)**:
  - 8 celestial skies: Midnight Library, Celestial Gold, Moonlit Garden, Ember Hearth, Rose Quartz, Whispering Forest, Deep Tides, Desert Dusk.
  - Accent color: Celestial Gold or Celestial Blue.
  - **Theme Modes**: Universal support for `Dark`, `Light`, and `System` appearance across all screens.
  - Typography: Celestial Serif, Literary Italic, Modern Sans, Classic Serif.
- **Brand Logo & Mark**: Retains the iconic constellation open-book emblem, tinted in PRD **Celestial Gold & Deep Indigo**.
- **Help & Contact Support**: Direct feedback transmission and interactive FAQ accordion.

---

## 🛠 Tech Stack

- **Framework**: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) with [React Native 0.86](https://reactnative.dev/) and React 19.2
- **Language**: TypeScript (Strict Mode, 0 `any` types)
- **Routing**: `expo-router` v6
- **Styling**: Pure React Native `StyleSheet.create` (No Tailwind / UI kits)
- **Animation & Gestures**: `react-native-reanimated` & `react-native-gesture-handler`
- **State & Storage**: React Context + `@react-native-async-storage/async-storage`
- **AI Integration**: Anthropic Claude API (`claude-sonnet-4-6`) with fallback mock data
- **Fonts**: `@expo-google-fonts/geist` and `@expo-google-fonts/geist-mono`
---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for live AI)
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key_here
```
*(If no key is present, the app gracefully falls back to local atmospheric mock data).*

### 3. Run Development Server
```bash
# Start on Web (Recommended for rapid testing)
npm run web

# Start on iOS Simulator
npm run ios

# Start on Android Emulator
npm run android
```

### 4. Quality Checks
```bash
# Type check
npx tsc --noEmit

# Lint
npx expo lint
```

---

## 📜 PRD Specification Reference

All screens, layouts, and copy match the 12-page **Celestial Book Product Requirements Document** and its 12 Visual References. For detailed engineering specifications, consult [`agent.md`](./agent.md).
