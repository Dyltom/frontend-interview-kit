export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const backoff = (n: number) =>
  Math.min(2000, 200 * 2 ** (n - 1)) + Math.random() * 150;

export interface FetchOptions {
  signal?: AbortSignal;
  retries?: number;
  timeout?: number;
}

export async function fetchJSON<T>(
  url: string,
  opts: FetchOptions = {}
): Promise<Result<T>> {
  const { signal, retries = 2, timeout = 8000 } = opts;
  let attempt = 0;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    while (true) {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          if (res.status >= 500 && attempt < retries) {
            attempt++;
            await wait(backoff(attempt));
            continue;
          }
          return { ok: false, error: new Error(`HTTP ${res.status}`) };
        }
        return { ok: true, value: (await res.json()) as T };
      } catch (e: unknown) {
        if (controller.signal.aborted) {
          return { ok: false, error: new Error('aborted') };
        }
        if (attempt < retries) {
          attempt++;
          await wait(backoff(attempt));
          continue;
        }
        return {
          ok: false,
          error: e instanceof Error ? e : new Error(String(e)),
        };
      }
    }
  } finally {
    clearTimeout(timer);
  }
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options;
  let lastTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (!lastTime && !leading) {
      lastTime = now;
    }

    const remaining = interval - (now - lastTime);

    if (remaining <= 0 || remaining > interval) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn(...args);
    } else if (!timeoutId && trailing) {
      lastArgs = args;
      timeoutId = setTimeout(() => {
        lastTime = leading ? Date.now() : 0;
        timeoutId = null;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, remaining);
    }
  };
}

export function once<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let called = false;
  let result: ReturnType<T>;

  return (...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  const getKey = keyFn || ((...args: Parameters<T>) => JSON.stringify(args));

  return ((...args: Parameters<T>) => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}