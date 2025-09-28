export interface TimerState {
  startTime: number | null;
  pausedAt: number | null;
  elapsed: number;
  isRunning: boolean;
  speedMultiplier: number;
}

export class DriftCorrectedTimer {
  private frameId: number | null = null;
  private onUpdate: (elapsed: number) => void;
  private currentState: TimerState | null = null;

  constructor(onUpdate: (elapsed: number) => void) {
    this.onUpdate = onUpdate;
  }

  start(state: TimerState): TimerState {
    if (state.isRunning) return state;

    const now = performance.now();
    const startTime = state.pausedAt !== null
      ? now - (state.elapsed / state.speedMultiplier)
      : now;

    const newState = {
      ...state,
      startTime,
      pausedAt: null,
      isRunning: true
    };

    this.currentState = newState;
    this.scheduleNextFrame();

    return newState;
  }

  pause(state: TimerState): TimerState {
    if (!state.isRunning) return state;

    this.stop();

    const newState = {
      ...state,
      pausedAt: performance.now(),
      isRunning: false
    };

    this.currentState = newState;
    return newState;
  }

  reset(): TimerState {
    this.stop();

    const newState = {
      startTime: null,
      pausedAt: null,
      elapsed: 0,
      isRunning: false,
      speedMultiplier: 1
    };

    this.currentState = newState;
    return newState;
  }

  setSpeedMultiplier(state: TimerState, multiplier: number): TimerState {
    if (!state.isRunning || !state.startTime) {
      const newState = { ...state, speedMultiplier: multiplier };
      this.currentState = newState;
      return newState;
    }

    const now = performance.now();
    // Calculate the current elapsed time at the old speed
    const currentElapsed = (now - state.startTime) * state.speedMultiplier;

    // Calculate new start time to maintain continuity
    const newStartTime = now - (currentElapsed / multiplier);

    const newState = {
      ...state,
      startTime: newStartTime,
      elapsed: currentElapsed,
      speedMultiplier: multiplier
    };

    this.currentState = newState;
    return newState;
  }

  private scheduleNextFrame() {
    this.frameId = requestAnimationFrame(() => {
      if (!this.currentState || !this.currentState.isRunning || !this.currentState.startTime) {
        return;
      }

      const now = performance.now();
      const realElapsed = now - this.currentState.startTime;
      const adjustedElapsed = realElapsed * this.currentState.speedMultiplier;

      this.onUpdate(adjustedElapsed);

      this.scheduleNextFrame();
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