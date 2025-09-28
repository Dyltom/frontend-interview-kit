import { useCallback, useEffect, useRef } from 'react';
import { useTimer } from '@hooks/useTimer';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';

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

const ASCII_FRAME_TOP = `┌──────────────────────────────────────┐`;
const ASCII_FRAME_BOTTOM = `└──────────────────────────────────────┘`;

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
    <div className="timer-container">
      <div className="timer-ascii-frame">
        {ASCII_HEADER}
      </div>

      <div className="terminal-status">
        <span className={isRunning ? 'status-online' : 'status-warning'}>
          {isRunning ? 'ACTIVE' : isPaused ? 'SUSPENDED' : 'STANDBY'}
        </span>
        <span className="status-indicator"></span>
      </div>

      <div className="timer-ascii-frame">{ASCII_FRAME_TOP}</div>

      <div
        className="timer-display"
        role="timer"
        aria-label={`Timer at ${formattedTime}`}
        aria-live="off"
      >
        <div className="time-text" aria-hidden="true">
          {formattedTime}
        </div>
      </div>

      <div className="timer-ascii-frame">{ASCII_FRAME_BOTTOM}</div>

      <div className="timer-controls">
        <button
          className="control-button"
          onClick={togglePlayPause}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          aria-pressed={isRunning}
        >
          <span className="button-text">
            {isRunning ? '■ PAUSE' : '▶ START'}
          </span>
        </button>

        <button
          className="control-button"
          onClick={reset}
          aria-label="Reset timer"
        >
          <span className="button-text">↺ RESET</span>
        </button>

        <button
          className="control-button fast-forward"
          onMouseDown={handleFastForwardDown}
          onMouseUp={handleFastForwardUp}
          onMouseLeave={handleFastForwardUp}
          onTouchStart={handleFastForwardDown}
          onTouchEnd={handleFastForwardUp}
          aria-label="Hold to fast forward"
          role="button"
          tabIndex={0}
        >
          <span className="button-text">≫ FAST [HOLD]</span>
        </button>
      </div>

      <div className="keyboard-hints">
        <div className="hint">
          <kbd>SPACE</kbd> START/PAUSE
        </div>
        <div className="hint">
          <kbd>R</kbd> RESET
        </div>
        <div className="hint">
          <kbd>F</kbd> FAST FORWARD
        </div>
      </div>

      <div className="timer-ascii-frame" style={{ fontSize: '0.5rem', opacity: 0.5 }}>
        {`[ SYSTEM UPTIME: ${Math.floor(Date.now() / 1000)} ] [ CPU: 2.4% ] [ MEM: 128KB ]`}
      </div>

      <div
        ref={liveRegionRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
}