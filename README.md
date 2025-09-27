# Frontend Interview Kit

A comprehensive React + TypeScript boilerplate optimized for frontend technical interviews. Built with modern tools and best practices, this kit includes everything you need to quickly build performant, accessible web applications during coding challenges.

## ✨ Features

### 🛠 Core Setup
- **React 18** with TypeScript in strict mode
- **Vite** for lightning-fast HMR and builds
- **Vitest** for unit testing with coverage reports
- **ESLint + Prettier** pre-configured
- **MSW** for API mocking in tests

### 🎯 Interview-Ready Utilities

#### Async Operations
- `fetchJSON` - Abortable fetch with retry logic and timeouts
- `debounce` & `throttle` - Control function execution frequency
- `memoize` - Cache expensive computations
- `once` - Ensure single execution

#### Canvas Utilities
- DPI-aware canvas setup
- Shape drawing (rectangles, circles, text)
- Hit testing for interactive graphics
- Export canvas to PNG/JPEG

#### DOM & Accessibility
- Keyboard navigation helpers
- Focus trapping for modals
- Screen reader announcements
- ARIA-compliant patterns

#### React Hooks
- `useDebounce` - Debounce values
- `useAsync` - Manage async operations with cancellation
- `useIntersectionObserver` - Detect element visibility
- `useVirtualList` - Virtualize large lists

### 📦 Components
- **Dropdown** - Fully accessible with keyboard navigation
- **VirtualList** - Efficiently render thousands of items

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/frontend-interview-kit.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Lint code |
| `npm run format` | Format with Prettier |

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── Dropdown.tsx    # Accessible dropdown
│   └── VirtualList.tsx # Virtual scrolling
├── hooks/              # Custom React hooks
│   ├── useAsync.ts
│   ├── useDebounce.ts
│   └── useIntersectionObserver.ts
├── utils/              # Utility functions
│   ├── async.ts        # Async operations
│   ├── canvas.ts       # Canvas helpers
│   └── dom.ts          # DOM utilities
├── types/              # TypeScript types
└── styles/             # CSS files
```

## 💡 Usage Examples

### Abortable Fetch with Retry

```typescript
import { fetchJSON } from '@utils/async';

const controller = new AbortController();

const result = await fetchJSON<User>('/api/user', {
  signal: controller.signal,
  retries: 3,
  timeout: 5000
});

if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

### Virtual List

```tsx
import { VirtualList } from '@components/VirtualList';

function App() {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  return (
    <VirtualList
      items={items}
      rowHeight={50}
      height={400}
      renderItem={(item) => <div>{item}</div>}
    />
  );
}
```

### Canvas Drawing

```typescript
import { setupCanvas, drawRect, hitTestRect } from '@utils/canvas';

const canvas = document.querySelector('canvas')!;
const ctx = setupCanvas(canvas);

const rect = {
  id: '1',
  x: 10,
  y: 10,
  width: 100,
  height: 50,
  fill: '#3b82f6'
};

drawRect(ctx, rect);

canvas.addEventListener('click', (e) => {
  const point = { x: e.offsetX, y: e.offsetY };
  if (hitTestRect(rect, point)) {
    console.log('Rectangle clicked!');
  }
});
```

## 🎯 Interview Tips

### Time Management
1. Spend 5-10 minutes understanding requirements
2. Build in thin slices - get something working quickly
3. Add tests for critical paths
4. Leave time for cleanup and documentation

### Code Quality
- Use TypeScript's strict mode
- Keep components small and focused
- Extract reusable logic into hooks
- Add accessibility from the start
- Handle errors gracefully

### Communication
- Narrate your thought process
- Explain trade-offs
- Mark TODOs for future improvements
- Ask clarifying questions early

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for frontend developers preparing for technical interviews.