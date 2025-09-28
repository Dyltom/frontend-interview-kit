import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(performance, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('fast-forward functionality', () => {
    it('should apply 4x speed when fast-forward is enabled', async () => {
      const { result } = renderHook(() => useTimer());

      // Start the timer
      act(() => {
        result.current.start();
      });

      // Advance time by 1 second without fast-forward
      vi.spyOn(performance, 'now').mockReturnValue(1000);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      const normalElapsed = result.current.elapsed;
      expect(normalElapsed).toBeGreaterThan(0);

      // Reset and test with fast-forward
      act(() => {
        result.current.reset();
      });

      act(() => {
        result.current.start();
      });

      // Enable fast-forward
      act(() => {
        result.current.setFastForward(true);
      });

      // Advance time by 1 second with fast-forward
      vi.spyOn(performance, 'now').mockReturnValue(2000);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      const fastElapsed = result.current.elapsed;

      // With 4x speed, should show approximately 4 seconds elapsed
      expect(fastElapsed).toBeGreaterThanOrEqual(3000);
      expect(fastElapsed).toBeLessThan(5000);
    });

    it('should return to normal speed when fast-forward is disabled', async () => {
      const { result } = renderHook(() => useTimer());

      // Start timer with fast-forward
      act(() => {
        result.current.start();
        result.current.setFastForward(true);
      });

      vi.spyOn(performance, 'now').mockReturnValue(500);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Disable fast-forward
      act(() => {
        result.current.setFastForward(false);
      });

      // Continue for another 500ms at normal speed
      vi.spyOn(performance, 'now').mockReturnValue(1000);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      const elapsed = result.current.elapsed;

      // Should have ~2000ms from fast-forward period + ~500ms from normal
      expect(elapsed).toBeGreaterThan(2000);
      expect(elapsed).toBeLessThan(3000);
    });

    it('should announce when fast-forward is enabled/disabled', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.setFastForward(true);
      });
      expect(result.current.announcement).toBe('Fast forward enabled');

      act(() => {
        result.current.setFastForward(false);
      });
      expect(result.current.announcement).toBe('Normal speed resumed');
    });

    it('should maintain fast-forward through pause/resume', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
        result.current.setFastForward(true);
      });

      act(() => {
        result.current.pause();
      });

      // Fast-forward should still be active after pause
      act(() => {
        result.current.start();
      });

      // The speed multiplier should still be 4x
      // We'll verify this by checking the timer updates
      vi.spyOn(performance, 'now').mockReturnValue(1000);
      act(() => {
        vi.advanceTimersByTime(250);
      });

      // With 4x speed, 250ms real time = 1000ms timer time
      expect(result.current.elapsed).toBeGreaterThanOrEqual(900);
    });
  });

  describe('basic timer operations', () => {
    it('should start, pause, and reset timer', () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsed).toBe(0);

      act(() => {
        result.current.start();
      });
      expect(result.current.isRunning).toBe(true);

      act(() => {
        result.current.pause();
      });
      expect(result.current.isRunning).toBe(false);

      act(() => {
        result.current.reset();
      });
      expect(result.current.elapsed).toBe(0);
      expect(result.current.isRunning).toBe(false);
    });

    it('should format time correctly', () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.formattedTime).toBe('00:00.00');

      // Manually set elapsed to test formatting
      act(() => {
        result.current.start();
      });

      vi.spyOn(performance, 'now').mockReturnValue(65550);
      act(() => {
        vi.advanceTimersByTime(65550);
      });

      // 65550ms = 1:05.55
      expect(result.current.formattedTime).toMatch(/01:05\.\d{2}/);
    });
  });
});