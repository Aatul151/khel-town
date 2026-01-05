# Language Town 🏙️

An interactive 3D educational web application for kids aged 4-8 to learn alphabets, words, and phonics.

## Features

- **Alphabet Street**: Interactive 3D letter buildings (A-F)
- **Click Interactions**: Tap letters to see related objects and hear phonics
- **Star Rewards**: Gamification with star counter and progress tracking
- **Audio System**: Phonics pronunciation with repeat functionality
- **Responsive Design**: Mobile-first, tablet and desktop friendly
- **Progress Tracking**: LocalStorage persistence

## Tech Stack

- React + TypeScript
- React Three Fiber (Three.js)
- @react-three/drei
- Vite
- Howler.js
- Tailwind CSS

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/      # Reusable 3D and UI components
├── scenes/         # 3D scenes (AlphabetStreet, Town)
├── data/           # Letter data and configurations
├── ui/             # HUD and UI components
├── utils/          # Storage and utility functions
└── assets/         # Models and audio files (to be added)
```

## Assets Needed

Place the following assets in the `public` folder:

### Models (`/public/models/`)
- `apple.glb`
- `ball.glb`
- `cat.glb`
- `dog.glb`
- `elephant.glb`
- `fish.glb`

### Audio (`/public/audio/`)
- `a_apple.mp3`
- `b_ball.mp3`
- `c_cat.mp3`
- `d_dog.mp3`
- `e_elephant.mp3`
- `f_fish.mp3`

### Fonts (`/public/fonts/`)
- `helvetiker_regular.typeface.json` (Three.js typeface)

## Notes

- The app uses fallback shapes if GLB models are not found
- Audio files should be optimized for web (MP3 format recommended)
- Models should use DRACO compression for better performance
- All interactions are designed to be kid-safe with no failure states

## License

MIT

