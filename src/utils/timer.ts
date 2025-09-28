export interface TimerState {
  startTime: number | null;
  pausedAt: number | null;
  elapsed: number;
  isRunning: boolean;
  speedMultiplier: number;
}

export class DriftCorrectedTimer {
  private frameId: number | null = null;
  private lastFrameTime: number = 0;
  private onUpdate: (elapsed: number) => void;

  constructor(onUpdate: (elapsed: number) => void) {
    this.onUpdate = onUpdate;
  }

  start(state: TimerState): TimerState {
    if (state.isRunning) return state;

    const now = performance.now();
    const startTime = state.pausedAt !== null
      ? now - state.elapsed
      : now;

    this.lastFrameTime = now;
    this.scheduleNextFrame(state.elapsed, startTime, state.speedMultiplier);

    return {
      ...state,
      startTime,
      pausedAt: null,
      isRunning: true
    };
  }

  pause(state: TimerState): TimerState {
    if (!state.isRunning) return state;

    this.stop();

    return {
      ...state,
      pausedAt: performance.now(),
      isRunning: false
    };
  }

  reset(): TimerState {
    this.stop();

    return {
      startTime: null,
      pausedAt: null,
      elapsed: 0,
      isRunning: false,
      speedMultiplier: 1
    };
  }

  setSpeedMultiplier(state: TimerState, multiplier: number): TimerState {
    if (!state.isRunning || !state.startTime) {
      return { ...state, speedMultiplier: multiplier };
    }

    const now = performance.now();
    const actualElapsed = now - state.startTime;
    const adjustedElapsed = state.elapsed;

    const newStartTime = now - (adjustedElapsed / multiplier);

    return {
      ...state,
      startTime: newStartTime,
      speedMultiplier: multiplier
    };
  }

  private scheduleNextFrame(baseElapsed: number, startTime: number, speedMultiplier: number) {
    this.frameId = requestAnimationFrame(() => {
      const now = performance.now();
      const deltaTime = now - this.lastFrameTime;

      const realElapsed = now - startTime;
      const adjustedElapsed = realElapsed * speedMultiplier;

      this.onUpdate(adjustedElapsed);
      this.lastFrameTime = now;

      this.scheduleNextFrame(baseElapsed, startTime, speedMultiplier);
    });
  }

  stop() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

export function getTimeAnnouncement(ms: number, isRunning: boolean, isPaused: boolean): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const timeStr = minutes > 0
    ? `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
    : `${seconds} second${seconds !== 1 ? 's' : ''}`;

  if (isPaused) return `Timer paused at ${timeStr}`;
  if (isRunning) return `Timer running at ${timeStr}`;
  return `Timer reset`;
}