export function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface Text {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
}

export type Shape = Rect | Circle | Text;

export function hitTestRect(rect: Rect, point: Point): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function hitTestCircle(circle: Circle, point: Point): boolean {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

export function hitTestShape(shape: Shape, point: Point): boolean {
  if ('width' in shape) {
    return hitTestRect(shape as Rect, point);
  }
  if ('radius' in shape) {
    return hitTestCircle(shape as Circle, point);
  }
  // Text hit testing - simplified bounding box
  if ('text' in shape) {
    const text = shape as Text;
    const fontSize = text.fontSize || 16;
    const width = text.text.length * fontSize * 0.6; // Rough approximation
    const height = fontSize;
    return (
      point.x >= text.x &&
      point.x <= text.x + width &&
      point.y >= text.y - height &&
      point.y <= text.y
    );
  }
  return false;
}

export function drawRect(ctx: CanvasRenderingContext2D, rect: Rect): void {
  if (rect.fill) {
    ctx.fillStyle = rect.fill;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }
  if (rect.stroke) {
    ctx.strokeStyle = rect.stroke;
    ctx.lineWidth = rect.strokeWidth || 1;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }
}

export function drawCircle(ctx: CanvasRenderingContext2D, circle: Circle): void {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  if (circle.fill) {
    ctx.fillStyle = circle.fill;
    ctx.fill();
  }
  if (circle.stroke) {
    ctx.strokeStyle = circle.stroke;
    ctx.lineWidth = circle.strokeWidth || 1;
    ctx.stroke();
  }
}

export function drawText(ctx: CanvasRenderingContext2D, text: Text): void {
  ctx.font = `${text.fontSize || 16}px ${text.fontFamily || 'sans-serif'}`;
  ctx.fillStyle = text.fill || '#000';
  ctx.fillText(text.text, text.x, text.y);
}

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape): void {
  if ('width' in shape) {
    drawRect(ctx, shape as Rect);
  } else if ('radius' in shape) {
    drawCircle(ctx, shape as Circle);
  } else if ('text' in shape) {
    drawText(ctx, shape as Text);
  }
}

export function exportCanvasToImage(
  canvas: HTMLCanvasElement,
  type: 'png' | 'jpeg' = 'png'
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      type === 'png' ? 'image/png' : 'image/jpeg'
    );
  });
}