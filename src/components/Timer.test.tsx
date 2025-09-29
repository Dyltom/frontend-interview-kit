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

// Mock neo-terminal-ui components
vi.mock('neo-terminal-ui', () => ({
  Button: ({ children, onClick, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, ...props }: any) => (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      data-testid="neo-terminal-button"
      {...props}
    >
      {children}
    </button>
  ),
  TerminalStatus: ({ customLabel, status, unstyled }: any) => (
    unstyled ? (
      <>
        <span className={status === 'online' ? 'status-online' : 'status-warning'}>
          {customLabel}
        </span>
        <span className="status-indicator" />
      </>
    ) : (
      <div data-testid="terminal-status">
        {customLabel}
      </div>
    )
  ),
  SystemInfo: ({ uptime, cpu, memory, className }: any) => (
    <div data-testid="system-info" className={className}>
      {`[ SYSTEM UPTIME: ${uptime} ] [ CPU: ${cpu}% ] [ MEM: ${memory} ]`}
    </div>
  ),
  ASCIIBorder: ({ children, className }: any) => (
    <>
      <div className={className}>┌──────────────────────────────────────┐</div>
      {children}
      <div className={className}>└──────────────────────────────────────┘</div>
    </>
  ),
  ASCIIHeader: ({ children, className }: any) => (
    <div className={className} data-testid="ascii-header">
      {children}
    </div>
  ),
  TimerDisplay: ({ time, className }: any) => (
    <div className={className} role="timer" aria-label={`Timer at ${time}`} data-testid="timer-display">
      <div className="time-text">
        {time}
      </div>
    </div>
  ),
  KeyboardHints: ({ hints, className }: any) => (
    <div className={className} data-testid="keyboard-hints">
      {hints.map((hint: any, i: number) => (
        <div key={i} className="hint">
          <kbd>{hint.key}</kbd> {hint.label}
        </div>
      ))}
    </div>
  ),
  TimerContainer: ({ children, className }: any) => (
    <div className={className} data-testid="timer-container">
      {children}
    </div>
  )
}));

beforeEach(() => {
  vi.clearAllMocks();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  describe('Component Integration', () => {
    it('uses neo-terminal-ui Button components for controls', () => {
      render(<Timer />);

      // Check that all control buttons use neo-terminal-ui Button
      const buttons = screen.getAllByTestId('neo-terminal-button');
      expect(buttons).toHaveLength(3); // Start/Pause, Reset, Fast Forward
    });
  });

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

      expect(screen.getByText('SPACE')).toBeInTheDocument();
      expect(screen.getByText('START/PAUSE')).toBeInTheDocument();
      expect(screen.getByText('R')).toBeInTheDocument();

      const hintsSection = container.querySelector('.keyboard-hints');
      expect(hintsSection).toBeInTheDocument();
      expect(hintsSection).toHaveTextContent('RESET');
      expect(hintsSection).toHaveTextContent('FAST FORWARD');

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      expect(pauseButton).toHaveTextContent('■ PAUSE');
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