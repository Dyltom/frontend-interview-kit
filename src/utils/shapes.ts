import type { Rectangle, Circle, Point, Shape, BoundingBox } from '@/types/shapes';

/**
 * Generate unique ID for shapes
 * Uses crypto.randomUUID() for guaranteed uniqueness
 */
export function generateShapeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers or test environments
  return `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a rectangle from two points
 * Handles dragging from any corner
 */
export function createRectangle(
  start: Point,
  end: Point,
  styles?: Partial<Rectangle>
): Rectangle {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return {
    id: generateShapeId(),
    type: 'rectangle',
    x,
    y,
    width,
    height,
    ...styles
  };
}

/**
 * Create a circle from center point and edge point
 */
export function createCircle(
  center: Point,
  edge: Point,
  styles?: Partial<Circle>
): Circle {
  const radius = Math.sqrt(
    Math.pow(edge.x - center.x, 2) +
    Math.pow(edge.y - center.y, 2)
  );

  return {
    id: generateShapeId(),
    type: 'circle',
    x: center.x,
    y: center.y,
    radius,
    ...styles
  };
}

/**
 * Calculate bounding box for any shape
 * Useful for selection, collision detection, and viewport culling
 */
export function getBoundingBox(shape: Shape): BoundingBox {
  switch (shape.type) {
    case 'rectangle':
      return {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height
      };

    case 'circle':
      return {
        x: shape.x - shape.radius,
        y: shape.y - shape.radius,
        width: shape.radius * 2,
        height: shape.radius * 2
      };

    case 'line': {
      const minX = Math.min(shape.x, shape.x2);
      const minY = Math.min(shape.y, shape.y2);
      const maxX = Math.max(shape.x, shape.x2);
      const maxY = Math.max(shape.y, shape.y2);
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }

    case 'polygon': {
      const xValues = shape.points.map(p => p.x);
      const yValues = shape.points.map(p => p.y);
      const minX = Math.min(...xValues);
      const minY = Math.min(...yValues);
      const maxX = Math.max(...xValues);
      const maxY = Math.max(...yValues);
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = shape;
      void _exhaustive; // Mark as intentionally unused
      throw new Error(`Unknown shape type: ${(shape as Shape).type}`);
    }
  }
}

/**
 * Test if a point is inside a shape
 */
export function isPointInShape(point: Point, shape: Shape): boolean {
  switch (shape.type) {
    case 'rectangle':
      return (
        point.x >= shape.x &&
        point.x <= shape.x + shape.width &&
        point.y >= shape.y &&
        point.y <= shape.y + shape.height
      );

    case 'circle': {
      const distance = Math.sqrt(
        Math.pow(point.x - shape.x, 2) +
        Math.pow(point.y - shape.y, 2)
      );
      return distance <= shape.radius;
    }

    case 'line':
      // Line hit detection requires point-to-line distance calculation
      // This is a simplified version - implement proper algorithm for production
      return false;

    case 'polygon':
      // Polygon hit detection requires ray casting algorithm
      // This is a simplified version - implement proper algorithm for production
      return false;

    default: {
      const _exhaustive: never = shape;
      void _exhaustive;
      return false;
    }
  }
}

/**
 * Optimized circle hit testing without sqrt
 */
export function isPointInCircleOptimized(point: Point, circle: Circle): boolean {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  const distanceSquared = dx * dx + dy * dy;
  const radiusSquared = circle.radius * circle.radius;
  return distanceSquared <= radiusSquared;
}