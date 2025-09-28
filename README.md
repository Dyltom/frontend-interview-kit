# 🟢 MATRIX TERMINAL TIMER v2.0

> *"Welcome to the Matrix."*

A retro Matrix-style terminal timer with drift correction, built with React + TypeScript. Features authentic CRT monitor effects, phosphor green glow, and terminal aesthetics straight from 1999.

**Live Demo**: [http://localhost:5173](http://localhost:5173)

![Matrix Terminal Timer](https://img.shields.io/badge/Status-ONLINE-00ff41?style=for-the-badge&labelColor=001100)
![Version](https://img.shields.io/badge/Version-2.0.0-00ff41?style=for-the-badge&labelColor=001100)
![License](https://img.shields.io/badge/License-MIT-00ff41?style=for-the-badge&labelColor=001100)

```
╔═══════════════════════════════════════════════════════════╗
║  ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗        ║
║  ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝        ║
║  ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝         ║
║  ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗         ║
║  ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗        ║
║  ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝        ║
╠═══════════════════════════════════════════════════════════╣
║           TEMPORAL DISPLACEMENT MODULE v2.0              ║
╚═══════════════════════════════════════════════════════════╝
```

## ⚡ Features

### 🖥️ Terminal Aesthetics
- **Authentic CRT Effects**: Scanlines, screen curve, and phosphor glow
- **Matrix Green Theme**: Classic terminal green (#00ff41) with multiple shades
- **ASCII Art Interface**: Box drawing characters and terminal frames
- **Monospace Typography**: Share Tech Mono font for authentic terminal feel
- **Boot Sequence**: Matrix-style initialization animation

### ⏱️ Timer Capabilities
- **Drift-Corrected Timing**: Using `requestAnimationFrame` and `performance.now()`
- **MM:SS.CS Display**: Centisecond precision with terminal formatting
- **4x Fast Forward**: Hold to accelerate time
- **State Management**: Start, Pause, Reset with visual feedback

### ⌨️ Controls
- **`SPACE`** - Start/Pause timer
- **`R`** - Reset to 00:00.00
- **`F`** (hold) - Fast forward at 4x speed
- **Mouse/Touch** - Click terminal buttons

### ♿ Accessibility
- **ARIA Labels**: Full screen reader support
- **Keyboard Navigation**: Complete keyboard control
- **Focus Indicators**: Terminal-style focus outlines
- **Live Regions**: Status announcements for screen readers

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Dyltom/matrix-terminal-timer.git
cd timer-scheduler

# Install dependencies
npm install

# Start the Matrix
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and enter the Matrix.

## 🏗️ Architecture

### Core Components

```
src/
├── components/
│   └── Timer.tsx           # Main timer with ASCII art
├── hooks/
│   └── useTimer.ts         # Timer state management
├── utils/
│   └── timer.ts            # Drift correction algorithm
└── styles/
    ├── matrix-terminal.css # CRT effects & theme
    └── timer.css          # Timer-specific styles
```

### Drift Correction Algorithm

```typescript
// High-precision timing with RAF
const now = performance.now();
const realElapsed = now - startTime;
const adjustedElapsed = realElapsed * speedMultiplier;
```

## 🎨 Visual Effects

### CRT Monitor Simulation
- **Scanlines**: Animated horizontal scan lines
- **Screen Curve**: Radial gradient vignetting
- **Phosphor Glow**: Text-shadow and box-shadow effects
- **Flicker**: Subtle opacity variations

### Color Palette
```css
--matrix-black: #0a0a0a       /* Deep black background */
--matrix-green-100: #00ff41   /* Primary Matrix green */
--matrix-green-200: #00cc33   /* Secondary green */
--matrix-green-300: #009926   /* Tertiary green */
--matrix-amber: #ffb000       /* Warning/fast-forward */
--matrix-red: #ff0040         /* Error states */
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

### Test Coverage
- ✅ Timer drift correction logic
- ✅ Speed multiplier calculations
- ✅ State management transitions
- ✅ Accessibility attributes
- ✅ Keyboard interactions

## 📊 Performance

- **Zero Drift**: Maintains accuracy over extended periods
- **60 FPS**: Smooth animations and transitions
- **< 50ms**: Interaction response time
- **Lightweight**: < 200KB total bundle size

## 🛠️ Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Production build
npm run build
```

## 📦 Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tooling
- **Vitest**: Testing framework
- **CSS3**: Animations and effects

## 🎯 Original Purpose

Built in 60 minutes as part of Canva frontend interview preparation, then enhanced with Matrix terminal aesthetics. Demonstrates:
- Real-time performance optimization
- Accessibility-first development
- Test-driven implementation
- Creative UI/UX design

## 🚀 Future Enhancements

- [ ] Matrix rain background animation
- [ ] Sound effects (keyboard clicks, beeps)
- [ ] Multiple timer instances
- [ ] Save/load timer states
- [ ] Network time synchronization
- [ ] Terminal command input
- [ ] Custom color themes (Amber, Blue, Red)
- [ ] Export time logs as .txt files

## 📄 License

MIT © 2024

---

```
> SYSTEM MESSAGE: TIMER MODULE LOADED SUCCESSFULLY
> STATUS: OPERATIONAL
> DRIFT CORRECTION: ACTIVE
> TEMPORAL DISPLACEMENT: READY
>
> WAKE UP, NEO...
> THE MATRIX HAS YOU...
> FOLLOW THE WHITE RABBIT.
>
> KNOCK, KNOCK, NEO.
```

**Built with ⚡ in the Matrix** | [GitHub](https://github.com/Dyltom/matrix-terminal-timer)