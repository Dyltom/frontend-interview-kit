import type {
  Result,
  FetchOptions,
  ThrottleOptions
} from '@/types/utilities';

export type { Result, FetchOptions } from '@/types/utilities';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const backoff = (n: number) =>
  Math.min(2000, 200 * 2 ** (n - 1)) + Math.random() * 150;

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

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  interval: number,
  options: ThrottleOptions = {}
): (...args: Args) => void {
  const { leading = true, trailing = true } = options;
  let lastTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Args | null = null;

  return (...args: Args) => {
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

export function once<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return | undefined {
  let called = false;
  let result: Return | undefined;

  return (...args: Args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

export function memoize<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  keyFn?: (...args: Args) => string
): (...args: Args) => Return {
  const cache = new Map<string, Return>();
  const getKey = keyFn || ((...args: Args) => JSON.stringify(args));

  return (...args: Args) => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}