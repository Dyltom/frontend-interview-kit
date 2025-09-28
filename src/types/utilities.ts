/**
 * Central utility types for function manipulation
 * Keeps our codebase DRY and type-safe
 */

/**
 * Generic function type with explicit args and return
 * Uses unknown[] for type safety while maintaining flexibility
 */
export type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Async function type
 */
export type AsyncFunction<
  Args extends readonly unknown[] = readonly unknown[],
  Return = unknown
> = (...args: Args) => Promise<Return>;

/**
 * Extract arguments type from a function
 */
export type ArgumentsType<T> = T extends (...args: infer Args) => unknown
  ? Args
  : never;

// Use built-in ReturnType for consistency

/**
 * Debounced function signature
 */
export type DebouncedFunction<Fn extends AnyFunction> = (
  ...args: Parameters<Fn>
) => void;

/**
 * Throttled function signature
 */
export type ThrottledFunction<Fn extends AnyFunction> = (
  ...args: Parameters<Fn>
) => void;

/**
 * Once function signature - returns value on first call, undefined after
 */
export type OnceFunction<Fn extends AnyFunction> = (
  ...args: Parameters<Fn>
) => ReturnType<Fn> | undefined;

/**
 * Memoized function signature - same as original
 */
export type MemoizedFunction<Fn extends AnyFunction> = Fn;

/**
 * Options for throttling
 */
export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Result type for error handling
 */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Options for fetch operations
 */
export interface FetchOptions {
  signal?: AbortSignal;
  retries?: number;
  timeout?: number;
}

/**
 * Type guard for error checking
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard for Result success
 */
export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}

/**
 * Type guard for Result failure
 */
export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}