import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock the Timer component
vi.mock('@components/Timer', () => ({
  Timer: () => <div data-testid="timer">Timer Component</div>
}));

// Mock neo-terminal-ui components with proper fake timer support
vi.mock('neo-terminal-ui', () => {
  return {
    BootSequence: ({ children, onComplete }: any) => {
      // Use useEffect with setTimeout to simulate boot sequence with fake timers
      React.useEffect(() => {
        // This setTimeout will be controlled by fake timers
        const timer = setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 4000);

        return () => clearTimeout(timer);
      }, [onComplete]);

      return (
        <div data-testid="boot-sequence">
          {children || 'Boot Sequence Component'}
        </div>
      );
    },
    CRTMonitor: ({ children }: any) => (
      <div data-testid="crt-monitor">
        {children}
      </div>
    )
  };
});

describe('App Boot Sequence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render with CRTMonitor component', () => {
    render(<App />);

    expect(screen.getByTestId('crt-monitor')).toBeInTheDocument();
  });

  it('should show BootSequence component initially', () => {
    render(<App />);

    expect(screen.getByTestId('boot-sequence')).toBeInTheDocument();
    expect(screen.queryByTestId('timer')).not.toBeInTheDocument();
  });

  it('should show boot sequence initially', () => {
    render(<App />);

    expect(screen.getByTestId('boot-sequence')).toBeInTheDocument();
    expect(screen.queryByTestId('timer')).not.toBeInTheDocument();
  });
});