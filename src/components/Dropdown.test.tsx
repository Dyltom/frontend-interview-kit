import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  const mockOptions = [
    { id: '1', label: 'Option 1', value: 'opt1' },
    { id: '2', label: 'Option 2', value: 'opt2' },
    { id: '3', label: 'Option 3', value: 'opt3' },
  ];

  it('should render with placeholder', () => {
    render(
      <Dropdown
        options={mockOptions}
        label="Select Option"
        placeholder="Choose one"
      />
    );

    expect(screen.getByRole('button')).toHaveTextContent('Choose one');
  });

  it('should open dropdown on click', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={mockOptions} label="Select Option" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    render(<Dropdown options={mockOptions} label="Select Option" />);

    const button = screen.getByRole('button');
    button.focus();

    // Open with Enter
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Navigate with arrow keys
    const listbox = screen.getByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });

    const options = screen.getAllByRole('option');
    expect(options[1]).toHaveClass('highlighted');
  });

  it('should call onChange when option is selected', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Dropdown
        options={mockOptions}
        label="Select Option"
        onChange={handleChange}
      />
    );

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Option 2'));

    expect(handleChange).toHaveBeenCalledWith('opt2');
  });

  it('should close dropdown on Escape', async () => {
    render(<Dropdown options={mockOptions} label="Select Option" />);

    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const listbox = screen.getByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'Escape' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Dropdown
        options={mockOptions}
        label="Select Option"
        value="opt2"
        id="test-dropdown"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-labelledby');

    const selectedOption = screen.getByRole('option', { name: 'Option 2' });
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });
});