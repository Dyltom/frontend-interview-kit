import { vi } from 'vitest';

/**
 * Creates a mock canvas rendering context for testing
 * Includes all common methods with vi.fn() mocks
 *
 * @example
 * ```ts
 * import { createMockCanvasContext } from '@/utils/testHelpers';
 *
 * const mockContext = createMockCanvasContext();
 * HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext);
 *
 * // Now you can test canvas operations
 * expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
 * ```
 */
export function createMockCanvasContext(): CanvasRenderingContext2D {
  return {
    // Drawing rectangles
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),

    // Drawing paths
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    arcTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    rect: vi.fn(),
    ellipse: vi.fn(),

    // Drawing
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),

    // Text
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 } as TextMetrics)),

    // Image manipulation
    createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(), width: 0, height: 0, colorSpace: 'srgb' } as ImageData)),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(), width: 0, height: 0, colorSpace: 'srgb' } as ImageData)),
    putImageData: vi.fn(),
    drawImage: vi.fn(),

    // Transformations
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    translate: vi.fn(),
    transform: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
    getTransform: vi.fn(() => new DOMMatrix()),

    // Line styles
    setLineDash: vi.fn(),
    getLineDash: vi.fn(() => []),

    // Properties
    canvas: document.createElement('canvas'),
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    lineDashOffset: 0,
    shadowBlur: 0,
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    direction: 'ltr',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'low',

    // Other methods
    isPointInPath: vi.fn(() => false),
    isPointInStroke: vi.fn(() => false),
    createPattern: vi.fn(() => null),
    createLinearGradient: vi.fn(),
    createRadialGradient: vi.fn(),
    createConicGradient: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

/**
 * Mock ResizeObserver for tests
 *
 * @example
 * ```ts
 * import { mockResizeObserver } from '@/utils/testHelpers';
 *
 * beforeAll(() => {
 *   mockResizeObserver();
 * });
 * ```
 */
export function mockResizeObserver() {
  globalThis.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Create a mock file for testing file inputs
 */
export function createMockFile(
  name: string = 'test.txt',
  content: string = 'test content',
  type: string = 'text/plain'
): File {
  return new File([content], name, { type });
}

/**
 * Wait for async updates in tests
 */
export async function waitForAsync() {
  return new Promise(resolve => setTimeout(resolve, 0));
}