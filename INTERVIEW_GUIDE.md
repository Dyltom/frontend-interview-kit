# Canva Frontend Interview Master Study Guide

_A practical, no-fluff handbook for preparing to crush a Canva Frontend Engineer interview — tuned to the AI-assisted format and Melbourne-specific feedback. Australian English throughout. Use this as your study base and as specs for the mini-projects you’ll build to reinforce learning._

---

## 0. Outcomes and Strategy

**Your goals**

1. **Demonstrate AI collaboration mastery.** Scope ambiguous work, prompt an assistant (Claude/Copilot/Cursor) to scaffold, then review, correct, test, and finish production-quality code while narrating trade-offs.
2. **Show excellent JavaScript + DOM fluency** (events, timing, Canvas, performance).
3. **Prove modern React competence** (clean state modelling, predictable effects, clear component boundaries, measured performance).
4. **Exhibit frontend system-design judgement** (caching, reliability, a11y, i18n, observability).
5. **Communicate clearly under time pressure** (make constraints visible, explain decisions, ship thin slices).

**How you’ll get there**

- **Study by building.** Every topic below includes targeted exercises or a project spec.
- **Narrate intent.** Say _what_ and _why_ before _how_, especially when prompting AI.
- **Optimise for interview texture.** Browser-like environment, timeboxed tasks, small composable changes.

---

## 0A. AI-Assisted Interview Playbook

**What’s really tested now**

- You’ll get a broad, realistic prompt (often a mini Canva feature). You’re expected to use AI tooling.
- The signal: can you **scope**, **plan**, **prompt for scaffolding**, **integrate**, **review**, **fix**, and **explain**?

**The loop**

1. **Clarify scope aloud.** Target a working core in ~60 minutes; mark stretch goals.
2. **Write `spec.md`.** Components, state shape, data flow, acceptance criteria.
3. **Prompt AI to scaffold.** Files, types, stubs, minimal wiring — not full magic.
4. **Run immediately.** Keep it compiling; resolve hallucinated APIs quickly.
5. **Ship thin slices.** “Add rectangle → select → drag” (end-to-end each).
6. **Review like PR.** Naming, edge cases, a11y, perf; add small tests.
7. **Narrate trade-offs.** What you defer and why; visible backlog for later.

**Prompt starters**

- **Scaffold:** “React + TypeScript. Create `Toolbar`, `CanvasStage`, `useShapesStore`, and a shapes model (`Rect`, `Text`). Minimal CSS, no third-party libs. Wire a render loop and hit-testing stubs.”
- **Constrain:** “Implement AABB hit-testing for rectangles only. Keep pure functions outside React.”
- **Review:** “List bugs/risky assumptions in your last diff. Don’t rewrite; comment actionable fixes.”
- **Tests:** “Generate Vitest for `addShape`, `selectAt(point)`, `moveSelected(dx,dy)` — no RTL yet.”

**Quality guardrails**

- **State:** serialisable; selection by `id` (no DOM nodes in state).
- **Canvas:** DPI aware; avoid full clears; batch draws; `requestAnimationFrame`.
- **Input:** pointer events + keyboard fallback; clean listener teardown.
- **Code:** small pure utilities; explicit types; friendly names; fast test loop.

---

## 1. What Canva Likely Tests

- **Hands-on JS + UI building:** to-do list, Tic Tac Toe, Snake, countdown, **mini-Canva** (shapes/text/drag).
- **React fundamentals:** controlled inputs, effects hygiene, refs, memo when needed.
- **Browser APIs:** Canvas, events, timers, fetch + `AbortController`, IntersectionObserver, History/URL.
- **Frontend system thinking:** image caching/serving basics, performance, reliability, a11y.
- **Light DSA in JS:** arrays, strings, hash maps, stacks, sliding window, simple parsing.
- **Communication:** clarify, collaborate, trade-offs, user impact.

---

## 2. JavaScript Fundamentals You Must Own

### 2.1 Language Mechanics

- Scope, closures, hoisting, TDZ; value vs reference; destructuring, rest/spread.
- Prototypes vs classes; `this` and arrows; equality/coercion (when to normalise).
- ES modules; default vs named exports; tree-shaking hints.

**Exercises**

- Implement `once`, `memoize`, `compose`.
- Rebuild `Promise.all`, `allSettled`, `race`.
- Write a robust `deepClone` (arrays/maps/sets/dates) + tests.

### 2.2 Event Loop & Async Control

- Macro vs microtasks; `setTimeout` vs `Promise.then` vs `queueMicrotask`.
- Cancellation with `AbortController`; timeouts; retries; idempotence.
- Exponential backoff with jitter.

**Exercises**

- Debounced search that **cancels stale requests** and shows only the latest.
- `throttle(fn, interval, { leading, trailing })` + thorough tests.

### 2.3 Data Transformation Katas

- Normalise nested data to `{byId, allIds}`; grouping/partitioning; stable sorts.
- Chunked/idle processing to avoid blocking the main thread.

**Exercises**

- Flatten nested categories into forward/reverse indices (type-safe).
- Merge N paginated sources into a deduped, virtualised list.

---

## 3. Browser APIs You’ll Actually Use

- **DOM:** query/create/mutate safely; `classList`, `dataset`, `inert`.
- **Events:** bubbling/capture/delegation; passive listeners; pointer vs mouse vs touch.
- **Timers:** interval drift; `requestAnimationFrame` cadence.
- **Fetch:** streaming, error handling, timeouts, retries, cancellation, credentials.
- **IntersectionObserver:** lazy images; infinite scroll sentinels.
- **Clipboard & DnD:** progressive enhancement; keyboard alternatives.
- **History & URL:** deep-linkable state via `URLSearchParams`.

**Widget specs**

- Accessible dropdown with typeahead + arrow-key nav.
- Lazy image loader with IO + prefetch near sentinel.
- Drag-to-reorder list supporting both pointer and keyboard.

---

## 4. CSS & Layout Essentials

- Flexbox, Grid, aspect-ratio, container queries, `minmax`, `clamp`.
- Stacking contexts; z-index pitfalls.
- Animations: transform/opacity, compositing; `prefers-reduced-motion`.
- Design tokens & theming; CSS Modules vs utilities vs CSS-in-JS trade-offs.

**Exercises**

- Resizable two-pane editor that never janks while dragging.
- Grid rendering 10k cards without layout thrash.

---

## 5. Accessibility You Must Demonstrate

- **Semantics first**; add ARIA only if needed.
- **Keyboard support:** focus order, roving tabindex, Home/End, ESC.
- **Live regions:** announce loading/results/errors without spam.
- **Basics:** contrast, visible focus, reduced motion, SR-only text where appropriate.

**Checklist (per widget)**

- Keyboard-only operable.
- Predictable focus after async updates.
- Accurate roles/names/states to assistive tech.

---

## 6. React Mastery

### 6.1 Core Patterns

- Controlled inputs; lifted vs colocated state; clean component boundaries.
- Custom hooks for effects/cross-cutting concerns; small effect bodies.
- Error boundaries; Suspense when it clarifies loading.
- Context for DI; stabilise context values (split or memoise thoughtfully).

### 6.2 Effects Hygiene

- `useEffect` for **synchronising with the outside world**, not computing render values.
- `useMemo`/`useCallback` **only** with measured benefit.
- Avoid stale closures via action-style state transitions.

### 6.3 Forms & Async UX

- Progressive validation; optimistic updates + rollback.
- Cancellation on rapid input; visible in-flight + error states.

**Exercises**

- Controlled form with per-field undo.
- Search with optimistic UI and 409 rollback.

---

## 7. State Management Note

MobX is great but **not required**. Prefer plain React for interview builds **unless** complexity clearly warrants a store. If you showcase MobX, use small per-feature stores, computed derivations, actions only, and `enforceActions: "always"`.

**Optional MobX katas**

- `QueryStore` that debounces, cancels, and exposes a read-only view model.
- Prefetch next page with `reaction` near end-of-list.

---

## 8. TypeScript Where It Matters

- Strict mode; avoid `any` in public APIs.
- Discriminated unions for remote data states.
- Generics for loaders/utilities; user-defined type guards; `satisfies`.
- `readonly` deep where helpful; immutable inputs, controlled mutations.

**Exercises**

- `Result<T, E>` with `map`, `mapError`, `unwrapOr`.
- Safe JSON decoding (zod or small custom decoder).

---

## 9. Testing That Signals Quality

- **Unit**: stores, pure functions, reducers, selectors.
- **Component**: React Testing Library — assert behaviour & ARIA, not internals.
- **Contract**: fetch wrappers with `msw`.
- **Snapshot**: only for stable presentational bits.

**CI basics:** lint, typecheck, tests on PR; include coverage.

---

## 10. Performance & Reliability

- Measure first (Performance panel, React Profiler, web-vitals).
- Virtualise long lists; batch state updates; avoid sync layout cascades.
- Image perf: responsive, lazy, proper decoding hints.
- Reliability: retries + backoff, bounded concurrency, circuit breakers, skeletons.

**Exercises**

- Turn a naïve 10k-row list into a smooth virtualised list; record metrics.
- Add `AbortController` + backoff to fetch wrapper; test timeouts/retries.

---

## 11. Frontend System Design

**Answer pattern**

1. Clarify user goals/constraints.
2. High-level architecture + state model.
3. Performance, concurrency, caching, errors.
4. Accessibility + i18n.
5. Observability + metrics.
6. Trade-offs & alternatives.

**Be ready for**

- Elements browser: search/filters/infinite scroll/preview/drag to canvas.
- Collaborative editing basics: presence, optimistic ops, simple conflicts.
- File uploader: chunking, resumability, hashing, progress, errors.
- Theming + tokens at scale.
- Feature flags/experimentation; UX guardrails.

---

## 12. Portfolio Mini-Projects (Build to Learn)

Each has acceptance criteria + stretch goals. Include a README (Problem, Design, Trade-offs) and a short GIF.

### Project 1 — Vanilla Timer & Scheduler

- Start/pause/reset; hold to fast-forward; keyboard accessible.
- Accurate time with drift correction.
- Tests for timing and ARIA announcements.
- **Stretch:** countdown synced to server time.

### Project 2 — Accessible Dropdown + Command Palette

- Roving tabindex, typeahead, Home/End, proper roles.
- Live region announces results count.
- **Stretch:** async data with cancellation.

### Project 3 — Sticker Browser (React)

- Debounced search + cancellation; selectable grid with keyboard nav.
- Virtualise after ~200 items; lazy images via IO.
- Skeletons; retry with backoff; tests for store logic + a11y interactions.
- **Stretch:** offline cache; optimistic add/remove.

### Project 4 — Resumable File Uploader (React + TS)

- Chunking, retries, pause/resume, concurrency control.
- Progress/error UI; abstractions for transport swapping.
- **Stretch:** checksums + server coordination.

### Project 5 — Canvas-ish Elements Panel

- Search, preview-on-hover, drag-to-canvas stub.
- Prefetch next page near end; URL-driven state via `URLSearchParams`.
- **Stretch:** feature flag experimental ranking + simple metrics.

---

## 13. AI-Driven Mini-Canva Spec (Practice Brief)

**Deliver in ~60 minutes**

- Toolbar with **Rectangle** + **Text** tools.
- Click to add item; click to select; drag selected.
- Controls to change fill/text; **Export to PNG**.
- **Stretch:** Delete key; Circle; Snap-to-grid.

**Rules**

- React + TypeScript + `<canvas>`.
- Single `CanvasStage` component for drawing; shapes are plain objects.
- Pure utilities for hit-testing/transforms.
- Vitest for three small utilities (e.g., add/move/select).

**What to narrate**

- Canvas vs SVG choice.
- Scaling to thousands of shapes (dirty rects, layers, offscreen).
- How you’d add collaboration (presence via WS, optimistic ops).

---

## 14. Behavioural & Communication

Prepare **3 x 60-second** stories and **3 x 3-minute** deep dives.

- **Impact:** a metric you moved and how you measured it.
- **Debugging:** gnarly prod issue, your systematic approach.
- **Collaboration:** feedback, conflict, or cross-team alignment.

**Technique:** STAR, but emphasise decision points and trade-offs; name rejected alternatives and why.

---

## 15. Code Review & Refactor Readiness

- Spot naming smells, implicit coupling, oversized components.
- Extract pure functions from effects; invert dependencies via context.
- Add tests to lock behaviour before refactors.

**Exercise:** Freeze behaviour with tests, refactor to a cleaner shape, document before/after.

---

## 16. Interview Day Playbook

- 10-minute warm-up: tiny DOM kata + one utility test.
- Say the plan first; implement in thin slices; checkpoint with interviewer.
- Use AI early for scaffolding; keep the app runnable; cut scope if needed.
- After each round, write two bullets: **went well** / **tighten next**.

---

## 17. GitHub Presentation

- Monorepo: `projects/` (mini-apps) + `docs/` (design write-ups).
- Each project: README, tests, demo GIF, deployed link.
- CI: lint, typecheck, tests; badges in README.

**README template**

- Problem
- Scenarios & constraints
- Architecture & state model
- Trade-offs & alternatives
- Results & metrics
- Next steps with more time

---

## 18. Self-Assessment Checklists

### JS & DOM

- [ ] Implement debounce/throttle from scratch with tests.
- [ ] Build a dropdown with full keyboard support + correct ARIA.
- [ ] Cancel in-flight fetches with `AbortController`.

### React

- [ ] Explain lift vs colocate; keep render pure; isolate effects.
- [ ] Use error boundaries + context appropriately.
- [ ] Profile before “optimising”; measure wins.

### AI Collaboration

- [ ] Turn a 1-page plan into a scaffold with AI in <5 minutes.
- [ ] Review AI output, spot bugs quickly, improve structure.
- [ ] Narrate trade-offs while cutting/extending scope.

### System Design

- [ ] Diagram a feature’s state model and data flow in 3 minutes.
- [ ] Propose caching, concurrency, failure-handling strategies.
- [ ] Explain a11y and i18n considerations by default.

---

## 19. Reference Patterns & Snippets

### Abortable, Retrying Fetch (TypeScript)

```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

export async function fetchJSON<T>(
  url: string,
  opts: { signal?: AbortSignal; retries?: number; timeout?: number } = {}
): Promise<Result<T>> {
  const { signal, retries = 2, timeout = 8000 } = opts;
  let attempt = 0;
  const comp = new AbortController();
  const timer = setTimeout(() => comp.abort(), timeout);
  if (signal)
    signal.addEventListener('abort', () => comp.abort(), { once: true });
  try {
    while (true) {
      try {
        const res = await fetch(url, { signal: comp.signal });
        if (!res.ok) {
          if (res.status >= 500 && attempt < retries) {
            attempt++;
            await wait(backoff(attempt));
            continue;
          }
          return { ok: false, error: new Error(`HTTP ${res.status}`) };
        }
        return { ok: true, value: (await res.json()) as T };
      } catch (e: any) {
        if (comp.signal.aborted)
          return { ok: false, error: new Error('aborted') };
        if (attempt < retries) {
          attempt++;
          await wait(backoff(attempt));
          continue;
        }
        return {
          ok: false,
          error: e instanceof Error ? e : new Error(String(e)),
        };
      }
    }
  } finally {
    clearTimeout(timer);
  }
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const backoff = (n: number) =>
  Math.min(2000, 200 * 2 ** (n - 1)) + Math.random() * 150;
```

### Virtualised List Sketch (React)

```tsx
function VirtualList({
  rowCount,
  rowHeight,
  renderRow,
}: {
  rowCount: number;
  rowHeight: number;
  renderRow: (i: number) => React.ReactNode;
}) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const height = 400;
  const start = Math.floor(scrollTop / rowHeight);
  const end = Math.min(rowCount, start + Math.ceil(height / rowHeight) + 3);
  const offsetY = start * rowHeight;
  return (
    <div
      style={{ overflow: 'auto', height }}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
    >
      <div style={{ height: rowCount * rowHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {Array.from({ length: end - start }, (_, i) => renderRow(start + i))}
        </div>
      </div>
    </div>
  );
}
```

### Tiny Canvas Utilities

```ts
export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export type Rect = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
};
export const hitRect = (r: Rect, px: number, py: number) =>
  px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
```

---

## 20. Suggested Resources

Skim fast, then build:

- MDN (DOM, Canvas, Async JS)
- _JavaScript: The Hard Parts_ (event loop, closures)
- React official docs (Thinking in React, Effects)
- Byte-sized videos on caching/CDNs/system design
- LeetCode Top 75 (only arrays/strings/hashmaps/stacks/sliding window)

---

## Appendix A — Glossary (Tiny Examples)

**Closure:** function remembers variables from creation scope.

```js
function counter() {
  let x = 0;
  return () => ++x;
}
```

**Event loop:** microtasks before next macrotask.

```js
setTimeout(() => console.log('macro'));
Promise.resolve().then(() => console.log('micro')); // micro then macro
```

**Debounce:**

```js
function debounce(fn, d) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), d);
  };
}
```

**Throttle:**

```js
function throttle(fn, i) {
  let last = 0;
  return (...a) => {
    const n = Date.now();
    if (n - last > i) {
      last = n;
      fn(...a);
    }
  };
}
```

**AbortController:**

```js
const c = new AbortController();
fetch('/api', { signal: c.signal });
c.abort();
```

**Controlled component:**

```jsx
const [v, setV] = useState('');
<input value={v} onChange={(e) => setV(e.target.value)} />;
```

**Error boundary (class):**

```jsx
class Boundary extends React.Component {
  state = { e: null };
  componentDidCatch(e) {
    this.setState({ e });
  }
  render() {
    return this.state.e ? <p>Error</p> : this.props.children;
  }
}
```

**Discriminated union:**

```ts
type Remote<T> =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'ok'; data: T }
  | { type: 'err'; err: string };
```

---

## Appendix B — Task Bank (Acceptance Criteria)

**B1. Debounce/Throttle** — correct edge-cases, trailing/leading options, cancel method; property-based tests (stretch).
**B2. Abortable Fetch** — timeout abort, retries on 5xx, typed `Result<T,E>`; circuit-breaker (stretch).
**B3. Command Palette** — Ctrl+K, filter, arrow nav, Enter selects, ESC closes, focus restore, live region.
**B4. Virtualised List** — 10k items smooth; stable measurements; sticky headers/page jumps (stretch).
**B5. Accessible Dropdown** — trigger/listbox roles, full keyboard control, correct ARIA; typeahead (stretch).
**B6. Sticker Browser** — debounce/cancel, virtualise, skeletons, retry; tests; offline/optimistic (stretch).
**B7. Resumable Uploader** — chunking, concurrency, retries+jitter, pause/resume, persistence; checksums (stretch).
**B8. Drag-to-Reorder** — pointer + keyboard, live region announcements; edge auto-scroll (stretch).
**B9. URL-Driven Filters** — querystring mirrors UI, back/forward sync; localStorage for cold starts (stretch).
**B10. Code Review Kata** — tests before refactor; extract pure utilities; PR notes; introduce store/context (stretch).

---

## Appendix C — Full Project Specs (Milestones)

**C1. Vanilla Timer & Scheduler** — spec → core timing (drift-corrected) → keyboard → live region → tests → docs.
**C2. Command Palette** — dialog semantics → debounced/abortable input → roving tabindex → live region → tests.
**C3. Sticker Browser (React)** — types → debounced/abortable fetch → virtualised grid → keyboard selection → skeletons/tests/README.
**C4. Resumable Uploader** — chunk/queue/retry → pause/resume → IndexedDB persistence → tests.
**C5. Elements Panel** — search/preview → drag-to-canvas stub → prefetch/cache → feature flag + metrics.

---

## Appendix D — Checklists & Rubrics

**A11y** — keyboard-only, visible focus, correct roles/names, sane live-region messaging.
**Performance** — no layout thrash; virtualise; images lazy+decode async.
**Reliability** — cancellable I/O; bounded, jittered retries; explicit state machines.
**Code Review** — intentful names; small functions; no dead code; tests protect critical paths; README covers problem/design/trade-offs/alternatives.

---

## Appendix E — Study Flow

Pick a topic → learn the definition → build the smallest viable example → complete one Task Bank exercise **and** one Project milestone using it. Repeat.
When unsure, go: **JS/Async → Browser APIs & a11y → React → System Design → Projects → AI practice runs → mocks**.
End each session with a 3–5 line log: what you learned, what you shipped, what tripped you up.
