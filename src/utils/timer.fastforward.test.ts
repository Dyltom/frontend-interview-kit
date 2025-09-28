import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DriftCorrectedTimer, TimerState } from './timer';

describe('Timer Fast-Forward', () => {
  let timer: DriftCorrectedTimer;
  let onUpdate: ReturnType<typeof vi.fn>;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let performanceSpy: ReturnType<typeof vi.spyOn>;
  let rafCallbacks: Array<FrameRequestCallback> = [];

  const executeRaf = () => {
    // Execute the first callback in the queue
    if (rafCallbacks.length > 0) {
      const cb = rafCallbacks[0];
      cb(performance.now());
    }
  };

  beforeEach(() => {
    rafCallbacks = [];
    onUpdate = vi.fn();
    timer = new DriftCorrectedTimer(onUpdate);

    let rafId = 0;
    rafSpy = vi.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return ++rafId;
    });

    vi.spyOn(global, 'cancelAnimationFrame').mockImplementation(() => {});

    performanceSpy = vi.spyOn(performance, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    rafSpy.mockRestore();
    performanceSpy.mockRestore();
  });

  describe('RAF callback', () => {
    it('should be registered when timer starts', () => {
      const initialState: TimerState = {
        startTime: null,
        pausedAt: null,
        elapsed: 0,
        isRunning: false,
        speedMultiplier: 1
      };

      const runningState = timer.start(initialState);
      expect(rafSpy).toHaveBeenCalled();
      expect(rafCallbacks.length).toBeGreaterThan(0);

      // Check the state has proper values
      expect(runningState.isRunning).toBe(true);
      expect(runningState.startTime).toBe(0); // Since performance.now() returns 0

      // Execute RAF and check if onUpdate is called
      performanceSpy.mockReturnValue(100);
      executeRaf();
      expect(onUpdate).toHaveBeenCalledWith(100);
    });
  });

  describe('setSpeedMultiplier', () => {
    it('should apply 4x speed when fast-forward is enabled', () => {
      // Start timer at normal speed
      const initialState: TimerState = {
        startTime: null,
        pausedAt: null,
        elapsed: 0,
        isRunning: false,
        speedMultiplier: 1
      };

      const runningState = timer.start(initialState);
      expect(runningState.isRunning).toBe(true);
      expect(runningState.speedMultiplier).toBe(1);

      // Simulate 1 second passing
      performanceSpy.mockReturnValue(1000);
      executeRaf();
      expect(onUpdate).toHaveBeenCalledWith(1000);

      // Enable fast-forward
      const ffState = timer.setSpeedMultiplier(runningState, 4);
      expect(ffState.speedMultiplier).toBe(4);

      // Clear previous calls
      onUpdate.mockClear();

      // Simulate another 1 second passing (total 2 seconds)
      performanceSpy.mockReturnValue(2000);
      executeRaf();

      // With 4x speed from the 1-second mark, the next second should show 4 seconds of progress
      // So total should be around 5000ms (1000ms normal + 4000ms fast)
      const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
      expect(lastCall).toBeGreaterThanOrEqual(4000);
      expect(lastCall).toBeLessThanOrEqual(5000);
    });

    it('should maintain elapsed time continuity when changing speed', () => {
      const initialState: TimerState = {
        startTime: null,
        pausedAt: null,
        elapsed: 0,
        isRunning: false,
        speedMultiplier: 1
      };

      const runningState = timer.start(initialState);

      // Run for 2 seconds at normal speed
      performanceSpy.mockReturnValue(2000);
      executeRaf();
      expect(onUpdate).toHaveBeenLastCalledWith(2000);

      // Switch to 4x speed
      const ffState = timer.setSpeedMultiplier(runningState, 4);
      expect(ffState.elapsed).toBe(2000); // Should preserve current elapsed time

      // The start time should be adjusted so that future calculations are correct
      expect(ffState.startTime).toBeDefined();
      expect(ffState.startTime).toBeLessThan(2000);
    });

    it('should return to normal speed when fast-forward is disabled', () => {
      const initialState: TimerState = {
        startTime: null,
        pausedAt: null,
        elapsed: 0,
        isRunning: false,
        speedMultiplier: 4
      };

      const runningState = timer.start(initialState);
      expect(runningState.speedMultiplier).toBe(4);

      // Run for 1 second at 4x speed
      performanceSpy.mockReturnValue(1000);
      executeRaf();
      expect(onUpdate).toHaveBeenLastCalledWith(4000);

      // Switch back to normal speed
      const normalState = timer.setSpeedMultiplier(runningState, 1);
      expect(normalState.speedMultiplier).toBe(1);
      expect(normalState.elapsed).toBe(4000); // Should preserve elapsed time

      onUpdate.mockClear();

      // Run for another second at normal speed
      performanceSpy.mockReturnValue(2000);
      executeRaf();

      // Should be 4000 + 1000 = 5000
      const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
      expect(lastCall).toBeGreaterThanOrEqual(4900);
      expect(lastCall).toBeLessThanOrEqual(5100);
    });

    it('should handle speed changes while paused', () => {
      const pausedState: TimerState = {
        startTime: null,
        pausedAt: 1000,
        elapsed: 2000,
        isRunning: false,
        speedMultiplier: 1
      };

      const ffState = timer.setSpeedMultiplier(pausedState, 4);
      expect(ffState.speedMultiplier).toBe(4);
      expect(ffState.elapsed).toBe(2000); // Elapsed time unchanged
      expect(ffState.isRunning).toBe(false);

      // When resuming, should use the new speed
      performanceSpy.mockReturnValue(2000);
      const resumedState = timer.start(ffState);

      performanceSpy.mockReturnValue(3000);
      executeRaf();

      // Should show 2000ms + (1000ms * 4) = 6000ms
      expect(onUpdate).toHaveBeenCalledWith(6000);
    });
  });
});