export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

export function toggleClass(element: HTMLElement, className: string): void {
  element.classList.toggle(className);
}

export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

export interface KeyboardNavigationOptions {
  items: HTMLElement[];
  currentIndex: number;
  onSelect?: (index: number) => void;
  onCancel?: () => void;
  loop?: boolean;
}

export function handleKeyboardNavigation(
  event: KeyboardEvent,
  options: KeyboardNavigationOptions
): number {
  const { items, currentIndex, onSelect, onCancel, loop = true } = options;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (currentIndex < items.length - 1) {
        return currentIndex + 1;
      }
      return loop ? 0 : currentIndex;

    case 'ArrowUp':
      event.preventDefault();
      if (currentIndex > 0) {
        return currentIndex - 1;
      }
      return loop ? items.length - 1 : currentIndex;

    case 'Home':
      event.preventDefault();
      return 0;

    case 'End':
      event.preventDefault();
      return items.length - 1;

    case 'Enter':
    case ' ':
      event.preventDefault();
      onSelect?.(currentIndex);
      return currentIndex;

    case 'Escape':
      event.preventDefault();
      onCancel?.();
      return currentIndex;

    default:
      return currentIndex;
  }
}

export function focusElement(element: HTMLElement | null): void {
  if (element && 'focus' in element) {
    element.focus();
  }
}

export function trapFocus(container: HTMLElement): () => void {
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}