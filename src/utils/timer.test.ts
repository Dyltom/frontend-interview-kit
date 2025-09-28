import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DriftCorrectedTimer, formatTime, getTimeAnnouncement, TimerState } from './timer';

describe('Timer Utils', () => {
  describe('formatTime', () => {
    it('formats milliseconds to MM:SS.CS format', () => {
      expect(formatTime(0)).toBe('00:00.00');
      expect(formatTime(1000)).toBe('00:01.00');
      expect(formatTime(61000)).toBe('01:01.00');
      expect(formatTime(125550)).toBe('02:05.55');
      expect(formatTime(999990)).toBe('16:39.99');
    });

    it('handles centiseconds correctly', () => {
      expect(formatTime(10)).toBe('00:00.01');
      expect(formatTime(50)).toBe('00:00.05');
      expect(formatTime(99)).toBe('00:00.09');
      expect(formatTime(100)).toBe('00:00.10');
      expect(formatTime(999)).toBe('00:00.99');
    });
  });

  describe('getTimeAnnouncement', () => {
    it('announces paused state', () => {
      expect(getTimeAnnouncement(5000, false, true)).toBe('Timer paused at 5 seconds');
      expect(getTimeAnnouncement(65000, false, true)).toBe('Timer paused at 1 minute 5 seconds');
      expect(getTimeAnnouncement(120000, false, true)).toBe('Timer paused at 2 minutes 0 seconds');
    });

    it('announces running state', () => {
      expect(getTimeAnnouncement(3000, true, false)).toBe('Timer running at 3 seconds');
      expect(getTimeAnnouncement(61000, true, false)).toBe('Timer running at 1 minute 1 second');
    });

    it('announces reset state', () => {
      expect(getTimeAnnouncement(0, false, false)).toBe('Timer reset');
      expect(getTimeAnnouncement(1000, false, false)).toBe('Timer reset');
    });

    it('uses singular/plural forms correctly', () => {
      expect(getTimeAnnouncement(1000, true, false)).toBe('Timer running at 1 second');
      expect(getTimeAnnouncement(2000, true, false)).toBe('Timer running at 2 seconds');
      expect(getTimeAnnouncement(60000, true, false)).toBe('Timer running at 1 minute 0 seconds');
      expect(getTimeAnnouncement(61000, true, false)).toBe('Timer running at 1 minute 1 second');
    });
  });

  describe('DriftCorrectedTimer', () => {
    let timer: DriftCorrectedTimer;
    let onUpdate: ReturnType<typeof vi.fn<[number], void>>;
    let rafSpy: ReturnType<typeof vi.spyOn>;
    let cafSpy: ReturnType<typeof vi.spyOn>;
    let performanceSpy: ReturnType<typeof vi.spyOn>;
    let rafCallbacks: Array<FrameRequestCallback> = [];

    beforeEach(() => {
      rafCallbacks = [];
      onUpdate = vi.fn();
      timer = new DriftCorrectedTimer(onUpdate);

      rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      cafSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {}) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      performanceSpy = vi.spyOn(performance, 'now').mockReturnValue(1000) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    });

    afterEach(() => {
      rafSpy.mockRestore();
      cafSpy.mockRestore();
      performanceSpy.mockRestore();
    });

    describe('start', () => {
      it('starts timer from zero', () => {
        const initialState: TimerState = {
          startTime: null,
          pausedAt: null,
          elapsed: 0,
          isRunning: false,
          speedMultiplier: 1
        };

        const newState = timer.start(initialState);

        expect(newState.isRunning).toBe(true);
        expect(newState.startTime).toBe(1000);
        expect(newState.pausedAt).toBeNull();
        expect(rafSpy).toHaveBeenCalledOnce();
      });

      it('resumes timer from paused state', () => {
        const pausedState: TimerState = {
          startTime: 500,
          pausedAt: 1000,
          elapsed: 500,
          isRunning: false,
          speedMultiplier: 1
        };

        const newState = timer.start(pausedState);

        expect(newState.isRunning).toBe(true);
        expect(newState.startTime).toBe(500);
        expect(newState.pausedAt).toBeNull();
      });

      it('does nothing if already running', () => {
        const runningState: TimerState = {
          startTime: 1000,
          pausedAt: null,
          elapsed: 500,
          isRunning: true,
          speedMultiplier: 1
        };

        const newState = timer.start(runningState);

        expect(newState).toBe(runningState);
      });
    });

    describe('pause', () => {
      it('pauses a running timer', () => {
        const initialState: TimerState = {
          startTime: null,
          pausedAt: null,
          elapsed: 0,
          isRunning: false,
          speedMultiplier: 1
        };

        const runningState = timer.start(initialState);
        const newState = timer.pause(runningState);

        expect(newState.isRunning).toBe(false);
        expect(newState.pausedAt).toBe(1000);
        expect(cafSpy).toHaveBeenCalled();
      });

      it('does nothing if already paused', () => {
        const pausedState: TimerState = {
          startTime: 500,
          pausedAt: 1000,
          elapsed: 500,
          isRunning: false,
          speedMultiplier: 1
        };

        const newState = timer.pause(pausedState);

        expect(newState).toBe(pausedState);
      });
    });

    describe('reset', () => {
      it('resets timer to initial state', () => {
        const initialState: TimerState = {
          startTime: null,
          pausedAt: null,
          elapsed: 0,
          isRunning: false,
          speedMultiplier: 1
        };

        timer.start(initialState);
        const newState = timer.reset();

        expect(newState).toEqual({
          startTime: null,
          pausedAt: null,
          elapsed: 0,
          isRunning: false,
          speedMultiplier: 1
        });

        expect(cafSpy).toHaveBeenCalled();
      });
    });

    describe('setSpeedMultiplier', () => {
      it('sets speed multiplier for stopped timer', () => {
        const stoppedState: TimerState = {
          startTime: null,
          pausedAt: null,
          elapsed: 0,
          isRunning: false,
          speedMultiplier: 1
        };

        const newState = timer.setSpeedMultiplier(stoppedState, 4);

        expect(newState.speedMultiplier).toBe(4);
        expect(newState.startTime).toBeNull();
      });

      it('adjusts start time when changing speed for running timer', () => {
        performanceSpy.mockReturnValue(2000);

        const runningState: TimerState = {
          startTime: 1000,
          pausedAt: null,
          elapsed: 1000,
          isRunning: true,
          speedMultiplier: 1
        };

        const newState = timer.setSpeedMultiplier(runningState, 4);

        expect(newState.speedMultiplier).toBe(4);
        expect(newState.startTime).toBe(1750);
      });
    });

    describe('animation frame updates', () => {
      it('calls onUpdate with adjusted elapsed time', () => {
        const initialState: TimerState = {
          startTime: null,
          pausedAt: null,
          elapsed: 0,
          isRunning: false,
          speedMultiplier: 1
        };

        timer.start(initialState);

        performanceSpy.mockReturnValue(1500);
        rafCallbacks[0]?.(1500);

        expect(onUpdate).toHaveBeenCalledWith(500);
      });

      it('applies speed multiplier correctly', () => {
        const initialState: TimerState = {
          startTime: null,
          pausedAt: null,
          elapsed: 0,
          isRunning: false,
          speedMultiplier: 4
        };

        timer.start(initialState);

        performanceSpy.mockReturnValue(1250);
        rafCallbacks[0]?.(1250);

        expect(onUpdate).toHaveBeenCalledWith(1000);
      });
    });
  });
});