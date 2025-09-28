import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Timer } from './Timer';
import * as useTimerModule from '@hooks/useTimer';

const mockToggle = vi.fn();
const mockReset = vi.fn();
const mockSetFastForward = vi.fn();

vi.mock('@hooks/useTimer', () => ({
  useTimer: vi.fn()
}));

vi.mock('@hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: vi.fn()
}));

beforeEach(() => {
  vi.clearAllMocks();
  (useTimerModule.useTimer as any).mockReturnValue({
    formattedTime: '00:00.00',
    isRunning: false,
    isPaused: false,
    start: vi.fn(),
    pause: vi.fn(),
    reset: mockReset,
    togglePlayPause: mockToggle,
    setFastForward: mockSetFastForward,
    announcement: 'Timer reset'
  });
});

describe('Timer Component', () => {
  describe('Accessibility', () => {
    it('renders timer with correct ARIA attributes', () => {
      render(<Timer />);

      const timerDisplay = screen.getByRole('timer');
      expect(timerDisplay).toBeInTheDocument();
      expect(timerDisplay).toHaveAttribute('aria-label', 'Timer at 00:00.00');
      expect(timerDisplay).toHaveAttribute('aria-live', 'off');
    });

    it('renders control buttons with correct labels', () => {
      render(<Timer />);

      const startButton = screen.getByLabelText('Start timer');
      expect(startButton).toBeInTheDocument();
      expect(startButton).toHaveAttribute('aria-pressed', 'false');

      const resetButton = screen.getByLabelText('Reset timer');
      expect(resetButton).toBeInTheDocument();

      const fastForwardButton = screen.getByLabelText('Hold to fast forward');
      expect(fastForwardButton).toBeInTheDocument();
    });

    it('includes keyboard hints', () => {
      const { container } = render(<Timer />);

      expect(screen.getByText('Space')).toBeInTheDocument();
      expect(screen.getByText('Start/Pause')).toBeInTheDocument();
      expect(screen.getByText('R')).toBeInTheDocument();

      const hintsSection = container.querySelector('.keyboard-hints');
      expect(hintsSection).toBeInTheDocument();
      expect(hintsSection).toHaveTextContent('Reset');
      expect(hintsSection).toHaveTextContent('Fast Forward (Hold)');

      expect(screen.getByText('F')).toBeInTheDocument();
    });

    it('has live region for announcements', () => {
      render(<Timer />);

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
      expect(liveRegion).toHaveClass('sr-only');
    });
  });

  describe('Running state', () => {
    it('shows pause button when running', () => {
      (useTimerModule.useTimer as any).mockReturnValue({
        formattedTime: '00:05.00',
        isRunning: true,
        isPaused: false,
        start: vi.fn(),
        pause: vi.fn(),
        reset: vi.fn(),
        togglePlayPause: vi.fn(),
        setFastForward: vi.fn(),
        announcement: 'Timer running at 5 seconds'
      });

      render(<Timer />);

      const pauseButton = screen.getByLabelText('Pause timer');
      expect(pauseButton).toBeInTheDocument();
      expect(pauseButton).toHaveAttribute('aria-pressed', 'true');
      expect(pauseButton).toHaveTextContent('Pause');
    });
  });

  describe('Button interactions', () => {
    it('responds to button clicks', () => {
      render(<Timer />);

      fireEvent.click(screen.getByLabelText('Start timer'));
      expect(mockToggle).toHaveBeenCalled();

      fireEvent.click(screen.getByLabelText('Reset timer'));
      expect(mockReset).toHaveBeenCalled();
    });

    it('handles fast forward mouse events', () => {
      render(<Timer />);

      const ffButton = screen.getByLabelText('Hold to fast forward');

      fireEvent.mouseDown(ffButton);
      expect(mockSetFastForward).toHaveBeenCalledWith(true);

      fireEvent.mouseUp(ffButton);
      expect(mockSetFastForward).toHaveBeenCalledWith(false);
    });
  });
});