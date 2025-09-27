import { useState, useEffect, useRef, useCallback } from 'react';

type AsyncState<T> =
  | { status: 'idle'; data?: undefined; error?: undefined }
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error };

export function useAsync<T>(
  asyncFunction: (signal: AbortSignal) => Promise<T>,
  immediate = true
): AsyncState<T> & {
  execute: () => Promise<void>;
  cancel: () => void;
} {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const execute = useCallback(async () => {
    cancel();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({ status: 'loading' });

    try {
      const data = await asyncFunction(controller.signal);
      if (!controller.signal.aborted) {
        setState({ status: 'success', data });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }
  }, [asyncFunction, cancel]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      cancel();
    };
  }, [immediate, execute, cancel]);

  return { ...state, execute, cancel };
}