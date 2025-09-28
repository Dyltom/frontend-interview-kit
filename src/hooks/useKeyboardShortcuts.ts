import { useEffect, useRef } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;
type ShortcutMap = Record<string, ShortcutHandler>;

/**
 * Hook for managing keyboard shortcuts
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   'ctrl+s': (e) => { e.preventDefault(); save(); },
 *   'cmd+s': (e) => { e.preventDefault(); save(); },
 *   'escape': () => clearSelection(),
 *   'delete': () => deleteSelected(),
 *   'ctrl+z': () => undo(),
 *   'cmd+z': () => undo(),
 * });
 * ```
 *
 * Supports modifiers: ctrl, cmd, alt, shift
 * Use + to combine: 'ctrl+shift+s'
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  enabled: boolean = true
) {
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Build the key combination string
      const parts: string[] = [];

      if (event.ctrlKey) parts.push('ctrl');
      if (event.metaKey) parts.push('cmd');
      if (event.altKey) parts.push('alt');
      if (event.shiftKey) parts.push('shift');

      // Normalize key name
      const key = event.key.toLowerCase();
      parts.push(key);

      const combination = parts.join('+');

      // Check if we have a handler for this combination
      const handler = shortcutsRef.current[combination];
      if (handler) {
        handler(event);
        return;
      }

      // Also check without modifiers for simple keys
      const simpleHandler = shortcutsRef.current[key];
      if (simpleHandler && parts.length === 1) {
        simpleHandler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]);
}

/**
 * Utility to check if the user is typing in an input
 * Useful to disable shortcuts while typing
 */
export function isTypingInInput(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName.toLowerCase();
  const isContentEditable = (activeElement as HTMLElement).contentEditable === 'true';

  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    isContentEditable
  );
}