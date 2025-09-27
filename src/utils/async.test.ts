import { describe, it, expect, vi } from 'vitest';
import { debounce, throttle, once, memoize } from './async';

describe('async utilities', () => {
  describe('debounce', () => {
    it('should delay function execution', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced(1);
      debounced(2);
      debounced(3);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(3);

      vi.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('should limit function execution frequency', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled(1);
      throttled(2);
      throttled(3);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });

  describe('once', () => {
    it('should only execute function once', () => {
      const fn = vi.fn((x: number) => x * 2);
      const onceFn = once(fn);

      expect(onceFn(5)).toBe(10);
      expect(onceFn(10)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(memoized(10)).toBe(20);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});