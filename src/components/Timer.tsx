import { useCallback, useEffect, useRef } from 'react';
import { useTimer } from '@hooks/useTimer';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import {
  Button,
  TerminalStatus,
  SystemInfo,
  ASCIIBorder,
  ASCIIHeader,
  TimerDisplay,
  KeyboardHints,
  TimerContainer
} from 'neo-terminal-ui';

const ASCII_HEADER = `
╔═══════════════════════════════════════════════════════════╗
║  ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗        ║
║  ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝        ║
║  ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝         ║
║  ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗         ║
║  ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗        ║
║  ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝        ║
╠═══════════════════════════════════════════════════════════╣
║           TEMPORAL DISPLACEMENT MODULE v2.0              ║
╚═══════════════════════════════════════════════════════════╝`;


export function Timer() {
  const {
    formattedTime,
    isRunning,
    isPaused,
    reset,
    togglePlayPause,
    setFastForward,
    announcement
  } = useTimer();

  const liveRegionRef = useRef<HTMLDivElement>(null);
  const previousAnnouncementRef = useRef<string>('');
  const fastForwardRef = useRef<boolean>(false);

  useEffect(() => {
    if (announcement !== previousAnnouncementRef.current && liveRegionRef.current) {
      liveRegionRef.current.textContent = announcement;
      previousAnnouncementRef.current = announcement;
    }
  }, [announcement]);

  const handleFastForwardDown = () => {
    if (!fastForwardRef.current) {
      fastForwardRef.current = true;
      setFastForward(true);
    }
  };

  const handleFastForwardUp = useCallback(() => {
    if (fastForwardRef.current) {
      fastForwardRef.current = false;
      setFastForward(false);
    }
  }, [setFastForward]);

  useKeyboardShortcuts({
    ' ': (e) => {
      e.preventDefault();
      togglePlayPause();
    },
    'r': (e) => {
      e.preventDefault();
      reset();
    },
    'f': (e) => {
      e.preventDefault();
      if (e.type === 'keydown') {
        handleFastForwardDown();
      }
    }
  });

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'f') {
        handleFastForwardUp();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [handleFastForwardUp]);

  return (
    <TimerContainer className="timer-container">
      <ASCIIHeader className="timer-ascii-frame" color="green-300">
        {ASCII_HEADER}
      </ASCIIHeader>

      <div className="terminal-status">
        <TerminalStatus
          status={isRunning ? 'online' : isPaused ? 'warning' : 'idle'}
          customLabel={isRunning ? 'ACTIVE' : isPaused ? 'SUSPENDED' : 'STANDBY'}
          showIndicator={true}
          unstyled={true}
        />
      </div>

      <ASCIIBorder style="single" width={40} color="green-300" className="timer-ascii-frame">
        <TimerDisplay
          time={formattedTime}
          className="timer-display"
          showBrackets={true}
          ariaLabel={`Timer at ${formattedTime}`}
        />
      </ASCIIBorder>

      <div className="timer-controls">
        <Button
          onClick={togglePlayPause}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          aria-pressed={isRunning}
          variant="outline"
          className="control-button"
        >
          <span className="button-text">{isRunning ? '■ PAUSE' : '▶ START'}</span>
        </Button>

        <Button
          onClick={reset}
          aria-label="Reset timer"
          variant="outline"
          className="control-button"
        >
          <span className="button-text">↺ RESET</span>
        </Button>

        <Button
          onMouseDown={handleFastForwardDown}
          onMouseUp={handleFastForwardUp}
          onMouseLeave={handleFastForwardUp}
          onTouchStart={handleFastForwardDown}
          onTouchEnd={handleFastForwardUp}
          aria-label="Hold to fast forward"
          variant="outline"
          className="control-button fast-forward"
        >
          <span className="button-text">≫ FAST [HOLD]</span>
        </Button>
      </div>

      <KeyboardHints
        hints={[
          { key: 'SPACE', label: 'START/PAUSE' },
          { key: 'R', label: 'RESET' },
          { key: 'F', label: 'FAST FORWARD' }
        ]}
        className="keyboard-hints"
      />

      <div style={{ fontSize: '0.5rem', opacity: 0.5 }}>
        <SystemInfo
          uptime={Math.floor(Date.now() / 1000)}
          cpu={2.4}
          memory="128KB"
          className="timer-ascii-frame"
        />
      </div>

      <div
        ref={liveRegionRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </TimerContainer>
  );
}