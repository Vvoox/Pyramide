# One Line Challenge

A minimalist mobile puzzle game built with **React Native + Expo + TypeScript**.

Trace every edge of each puzzle in a single continuous stroke — without lifting your finger.

---

## Architecture Overview

```
src/
├── components/        # Reusable UI building blocks
│   ├── EdgeView       # Single edge rendered as an SVG Line
│   ├── GameHeader     # Back / restart / level info bar
│   ├── LevelCard      # Card used in the level-select grid
│   ├── NodeView       # Single puzzle node rendered as an SVG Circle
│   ├── PuzzleBoard    # Interactive SVG canvas + PanResponder
│   └── ResultModal    # Win celebration modal
├── constants/
│   ├── colors.ts      # Design-system colour tokens
│   └── layout.ts      # Board size, snap radius, stroke widths
├── game/
│   ├── levels.ts      # All 10 level definitions (nodes + edges + metadata)
│   ├── pathTracker.ts # Pure state-machine (no React) – applyTouchStart/Snap/End
│   └── validation.ts  # Edge-exists, isLevelComplete, validateMove helpers
├── hooks/
│   ├── useGameState   # Central game hook – owns PathState + PanResponder logic
│   └── useProgress    # Subscribes to progressStore, re-renders on changes
├── navigation/
│   └── AppNavigator   # NavigationContainer + NativeStack (Home/LevelSelect/Game)
├── screens/
│   ├── GameScreen     # Gameplay screen – wires board, header, modal, persistence
│   ├── HomeScreen     # Title + Play + Level Select
│   └── LevelSelectScreen # Scrollable grid of LevelCards
├── store/
│   └── progressStore  # Singleton in-memory store with AsyncStorage persistence
└── utils/
    ├── geometry.ts    # distance(), toPixel(), edgeKey(), findClosestNode()
    └── storage.ts     # Typed AsyncStorage wrapper (loadProgress / saveProgress)
```

### Key Design Decisions

| Concern | Decision |
|---|---|
| State management | Lightweight singleton store + React hooks (no Redux/Zustand) |
| Touch input | PanResponder (no heavy gesture library needed for simple drag-to-node) |
| Board rendering | react-native-svg – declarative, cross-platform, no canvas API needed |
| Persistence | @react-native-async-storage/async-storage – simple key/value, offline-first |
| Game logic separation | `pathTracker.ts` is pure functions with zero React imports → easy to unit-test |
| Coordinate system | Nodes use 0–1 normalised coords, scaled to pixels at render time |

---

## Game Rules

1. Every level is an **Eulerian-path** puzzle: you must visit every edge exactly once.
2. Start from the **coral/pink** highlighted node (if one is shown).
3. Drag your finger from node to node — the path snaps automatically.
4. **Fail** conditions:
   - Touching an edge that doesn't exist
   - Touching an edge that has already been visited
   - Lifting your finger before all edges are traced
5. **Win** when all edges are visited in one continuous stroke.

---

## Levels

| # | Name | Difficulty | Edges | Notes |
|---|------|-----------|-------|-------|
| 1 | Triangle | Easy | 3 | Eulerian circuit – start anywhere |
| 2 | Square | Easy | 4 | Eulerian circuit |
| 3 | Diamond | Easy | 5 | Path: B → C |
| 4 | House | Medium | 6 | Path: A → B |
| 5 | Pentagon | Medium | 6 | Path: A → C |
| 6 | Ladder | Medium | 7 | Path: B → E |
| 7 | Kite | Medium | 6 | Path: A → C |
| 8 | Hexagon | Hard | 8 | Path: A → E |
| 9 | Web | Hard | 11 | Path: B → E |
| 10 | The Grid | Hard | 13 | Path: F → H |

---

## Running the Project

### Prerequisites
- Node.js ≥ 18
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android emulator, or the **Expo Go** app on your device

### Install & Start

```bash
cd OneLineChallenge
npm install
npx expo start
```

Then press:
- `i` to open iOS Simulator
- `a` to open Android emulator
- Scan the QR code with Expo Go on your device

---

## Packages to Install

```bash
npm install \
  @react-native-async-storage/async-storage \
  @react-navigation/native \
  @react-navigation/native-stack \
  expo-linear-gradient \
  react-native-gesture-handler \
  react-native-reanimated \
  react-native-safe-area-context \
  react-native-screens \
  react-native-svg
```

---

## Suggested Next Improvements

### Gameplay
- [ ] Hint system (show one valid next move)
- [ ] Undo last step (allow correcting without full reset)
- [ ] Timer mode and best-time leaderboard
- [ ] Level editor (in-app tool to design and export levels)

### Content
- [ ] 20+ additional levels across more difficulties
- [ ] Level packs with themes (geometry, architecture, nature)
- [ ] Daily challenge level (server-generated or seeded by date)

### UX / Polish
- [ ] Particle burst animation on level complete
- [ ] Haptic feedback (expo-haptics) on snap and fail
- [ ] Sound effects (expo-av)
- [ ] Animated level-unlock transition
- [ ] Colour themes / dark-light toggle

### Technical
- [ ] Unit tests for `pathTracker.ts` and `validation.ts`
- [ ] E2E tests with Detox
- [ ] OTA updates via EAS Update
- [ ] Analytics (level attempts, fail points) to tune difficulty
