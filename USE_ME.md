# How to Use This Boilerplate

## Quick Start for New Projects

```bash
# Copy the boilerplate to a new project folder
cp -r boilerplate/ ../projects/my-new-project

# Navigate to your new project
cd ../projects/my-new-project

# Install dependencies
npm install

# Start development
npm run dev
```

## What's Included

### Pre-configured Tools
- **Vite** - Fast build tool with HMR
- **React 18** - UI library
- **TypeScript** - Strict mode enabled
- **Vitest** - Testing framework with coverage
- **ESLint & Prettier** - Code quality and formatting
- **MSW** - API mocking for tests

### Ready-to-Use Utilities

#### Async Utilities (`src/utils/async.ts`)
- `fetchJSON` - Abortable fetch with retry and timeout
- `debounce` - Delay function execution
- `throttle` - Limit execution frequency
- `once` - Execute function only once
- `memoize` - Cache function results

#### Canvas Utilities (`src/utils/canvas.ts`)
- `setupCanvas` - DPI-aware canvas setup
- `hitTestRect`, `hitTestCircle` - Shape hit detection
- `drawRect`, `drawCircle`, `drawText` - Shape rendering
- `exportCanvasToImage` - Export canvas to PNG/JPEG

#### DOM Utilities (`src/utils/dom.ts`)
- `handleKeyboardNavigation` - Arrow key navigation
- `trapFocus` - Focus management for modals
- `announceToScreenReader` - A11y announcements

#### React Hooks
- `useDebounce` - Debounce values
- `useAsync` - Manage async operations with cancellation
- `useIntersectionObserver` - Detect element visibility

### Example Components
- **Dropdown** - Fully accessible dropdown with keyboard navigation

## Project Types You Can Build

### 1. Mini Canvas Editor
```bash
cp -r boilerplate/ ../projects/canvas-editor
# Use canvas utilities for shape drawing
# Implement selection and drag functionality
```

### 2. Search Component
```bash
cp -r boilerplate/ ../projects/search-component
# Use debounce and async hooks
# Add virtualization for large result sets
```

### 3. File Uploader
```bash
cp -r boilerplate/ ../projects/file-uploader
# Use async utilities for chunked uploads
# Add progress tracking and retry logic
```

## Development Workflow

1. **Start with spec.md**
   ```markdown
   # Feature Spec
   - Components needed
   - State shape
   - Acceptance criteria
   ```

2. **Use AI for scaffolding**
   - Generate initial component structure
   - Create type definitions
   - Set up basic tests

3. **Build incrementally**
   - Keep the app runnable
   - Test as you go
   - Profile performance

4. **Follow the checklist**
   - ✅ Keyboard accessible
   - ✅ Screen reader friendly
   - ✅ Error handling
   - ✅ Tests passing
   - ✅ TypeScript strict

## Tips for Canva Interview

### Time Management
- Spend 5-10 mins planning
- Build thin slices (end-to-end features)
- Leave time for testing and polish

### Code Quality
- Use existing utilities (don't reinvent)
- Keep components small and focused
- Add tests for critical logic

### Communication
- Narrate your decisions
- Explain trade-offs
- Mark TODOs for future work

### Common Patterns
```typescript
// State management
const [state, setState] = useState<StateType>({
  // Keep serializable
});

// Cancellable operations
const abortController = useRef<AbortController>();

// Keyboard handling
onKeyDown={(e) => handleKeyboardNavigation(e, options)}

// A11y announcements
announceToScreenReader('Action completed', 'polite');
```

## Scripts Reference

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run test:coverage` | Test with coverage |
| `npm run typecheck` | Check TypeScript |
| `npm run lint` | Lint code |
| `npm run format` | Format with Prettier |

## Remember

- Start simple, iterate quickly
- Test accessibility features
- Profile before optimizing
- Document your decisions

Good luck with your interview prep! 🚀