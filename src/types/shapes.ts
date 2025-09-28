/**
 * Shape type definitions for canvas drawing
 * Using discriminated unions for type safety
 */

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BaseShape {
  id: string;
  type: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface Rectangle extends BaseShape {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle extends BaseShape {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
}

export interface Line extends BaseShape {
  type: 'line';
  x: number;
  y: number;
  x2: number;
  y2: number;
}

export interface Polygon extends BaseShape {
  type: 'polygon';
  points: Point[];
}

export type Shape = Rectangle | Circle | Line | Polygon;