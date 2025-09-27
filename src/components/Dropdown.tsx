import React, { useState, useRef, useEffect } from 'react';
import { handleKeyboardNavigation, trapFocus, announceToScreenReader } from '@utils/dom';

interface DropdownOption {
  id: string;
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label: string;
  id?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  id = 'dropdown',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const cleanup = trapFocus(dropdownRef.current!);
    return cleanup;
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      announceToScreenReader(
        `${options.length} options available. Use arrow keys to navigate.`,
        'polite'
      );
    }
  }, [isOpen, options.length]);

  const handleSelect = (index: number) => {
    const option = options[index];
    if (option) {
      onChange?.(option.value);
      setSelectedIndex(index);
      setIsOpen(false);
      buttonRef.current?.focus();
      announceToScreenReader(`Selected: ${option.label}`, 'assertive');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }

    const items = listRef.current?.querySelectorAll('[role="option"]') || [];
    const newIndex = handleKeyboardNavigation(event, {
      items: Array.from(items) as HTMLElement[],
      currentIndex: highlightedIndex,
      onSelect: handleSelect,
      onCancel: () => {
        setIsOpen(false);
        buttonRef.current?.focus();
      },
    });

    if (newIndex !== highlightedIndex) {
      setHighlightedIndex(newIndex);
      (items[newIndex] as HTMLElement)?.scrollIntoView({ block: 'nearest' });
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <label htmlFor={`${id}-button`} className="dropdown-label">
        {label}
      </label>
      <button
        ref={buttonRef}
        id={`${id}-button`}
        type="button"
        className="dropdown-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}-button`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          id={`${id}-listbox`}
          className="dropdown-list"
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              role="option"
              id={`${id}-option-${option.id}`}
              className={`dropdown-option ${
                index === highlightedIndex ? 'highlighted' : ''
              } ${option.value === value ? 'selected' : ''}`}
              aria-selected={option.value === value}
              onClick={() => handleSelect(index)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};