import { describe, it, expect } from 'vitest';
import { hitTestRect, hitTestCircle, type Rect, type Circle, type Point } from './canvas';

describe('canvas utilities', () => {
  describe('hitTestRect', () => {
    it('should detect point inside rectangle', () => {
      const rect: Rect = {
        id: '1',
        x: 10,
        y: 10,
        width: 50,
        height: 30,
      };

      const insidePoint: Point = { x: 30, y: 20 };
      const outsidePoint: Point = { x: 70, y: 20 };

      expect(hitTestRect(rect, insidePoint)).toBe(true);
      expect(hitTestRect(rect, outsidePoint)).toBe(false);
    });

    it('should handle edge cases', () => {
      const rect: Rect = {
        id: '1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };

      expect(hitTestRect(rect, { x: 0, y: 0 })).toBe(true);
      expect(hitTestRect(rect, { x: 100, y: 100 })).toBe(true);
      expect(hitTestRect(rect, { x: 101, y: 101 })).toBe(false);
    });
  });

  describe('hitTestCircle', () => {
    it('should detect point inside circle', () => {
      const circle: Circle = {
        id: '1',
        x: 50,
        y: 50,
        radius: 20,
      };

      const insidePoint: Point = { x: 55, y: 55 };
      const outsidePoint: Point = { x: 80, y: 80 };

      expect(hitTestCircle(circle, insidePoint)).toBe(true);
      expect(hitTestCircle(circle, outsidePoint)).toBe(false);
    });

    it('should handle edge of circle', () => {
      const circle: Circle = {
        id: '1',
        x: 0,
        y: 0,
        radius: 10,
      };

      expect(hitTestCircle(circle, { x: 10, y: 0 })).toBe(true);
      expect(hitTestCircle(circle, { x: 11, y: 0 })).toBe(false);
    });
  });
});