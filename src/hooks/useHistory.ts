import { useState, useCallback } from 'react';

interface HistoryState<T> {
  current: T;
  history: T[];
  historyIndex: number;
  push: (state: T) => void;
  undo: () => void;
  redo: () => void;
  reset: (state: T) => void;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Generic history hook for undo/redo functionality
 *
 * @example
 * ```tsx
 * const drawingHistory = useHistory(initialShapes);
 *
 * // Push new state
 * drawingHistory.push([...shapes, newShape]);
 *
 * // Undo/redo
 * if (drawingHistory.canUndo) drawingHistory.undo();
 * if (drawingHistory.canRedo) drawingHistory.redo();
 * ```
 */
export function useHistory<T>(
  initialState: T,
  maxHistorySize: number = 50
): HistoryState<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const push = useCallback((newState: T) => {
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);

      // Add new state
      newHistory.push(newState);

      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return newHistory;
      }

      return newHistory;
    });

    setHistoryIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
  }, [historyIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history.length]);

  const reset = useCallback((newState: T) => {
    setHistory([newState]);
    setHistoryIndex(0);
  }, []);

  return {
    current: history[historyIndex] as T,
    history,
    historyIndex,
    push,
    undo,
    redo,
    reset,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
}