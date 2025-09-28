import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock the Timer component
vi.mock('@components/Timer', () => ({
  Timer: () => <div data-testid="timer">Timer Component</div>
}));

describe('App Boot Sequence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should show boot sequence initially', () => {
    render(<App />);

    expect(screen.getByText(/INITIALISING MATRIX TERMINAL/)).toBeInTheDocument();
    expect(screen.queryByTestId('timer')).not.toBeInTheDocument();
  });

  it('should transition smoothly from boot to timer without double-loading', async () => {
    const { container } = render(<App />);

    // Boot sequence should be visible
    expect(screen.getByText(/INITIALISING MATRIX TERMINAL/)).toBeInTheDocument();
    expect(screen.queryByTestId('timer')).not.toBeInTheDocument();

    // Fast-forward through boot sequence (4000ms)
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Boot should be hidden, but timer should not appear yet
    await waitFor(() => {
      expect(screen.queryByText(/INITIALISING MATRIX TERMINAL/)).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('timer')).not.toBeInTheDocument();

    // Fast-forward through transition (500ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Timer should appear with fade-in class
    await waitFor(() => {
      const timerWindow = container.querySelector('.terminal-window');
      expect(timerWindow).toBeInTheDocument();
      expect(timerWindow).toHaveClass('fade-in');
      expect(screen.getByTestId('timer')).toBeInTheDocument();
    });

    // Ensure timer stays visible and doesn't disappear/reappear
    const timerElement = screen.getByTestId('timer');

    // Advance time to check for any re-renders
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Timer should still be the same element (not re-mounted)
    expect(screen.getByTestId('timer')).toBe(timerElement);
    expect(screen.getByTestId('timer')).toBeVisible();
  });

  it('should not render timer during transition period', async () => {
    render(<App />);

    // Complete boot sequence
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Boot is hidden but timer should NOT be visible yet (transition period)
    await waitFor(() => {
      expect(screen.queryByText(/INITIALISING MATRIX TERMINAL/)).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('timer')).not.toBeInTheDocument();

    // Complete transition
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now timer should be visible
    await waitFor(() => {
      expect(screen.getByTestId('timer')).toBeInTheDocument();
    });
  });

  it('should maintain timer visibility throughout its lifecycle', async () => {
    render(<App />);

    // Complete boot sequence and transition
    act(() => {
      vi.advanceTimersByTime(4500);
    });

    await waitFor(() => {
      expect(screen.getByTestId('timer')).toBeInTheDocument();
    });

    const initialTimer = screen.getByTestId('timer');

    // Check that timer remains the same element over time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByTestId('timer')).toBe(initialTimer);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByTestId('timer')).toBe(initialTimer);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('timer')).toBe(initialTimer);
    expect(screen.getByTestId('timer')).toBeVisible();
  });
});