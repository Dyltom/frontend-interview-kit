import React, { useEffect, useRef } from 'react';
import { useTimer } from '@hooks/useTimer';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';

export function Timer() {
  const {
    formattedTime,
    isRunning,
    isPaused,
    start,
    pause,
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

  const handleFastForwardUp = () => {
    if (fastForwardRef.current) {
      fastForwardRef.current = false;
      setFastForward(false);
    }
  };

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
  }, []);

  return (
    <div className="timer-container">
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

      <div className="timer-controls">
        <button
          className="control-button"
          onClick={togglePlayPause}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          aria-pressed={isRunning}
        >
          {isRunning ? '⏸️' : '▶️'}
          <span className="button-text">{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button
          className="control-button"
          onClick={reset}
          aria-label="Reset timer"
        >
          🔄
          <span className="button-text">Reset</span>
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
          ⏩
          <span className="button-text">Fast Forward (Hold)</span>
        </button>
      </div>

      <div className="keyboard-hints">
        <div className="hint">
          <kbd>Space</kbd> Start/Pause
        </div>
        <div className="hint">
          <kbd>R</kbd> Reset
        </div>
        <div className="hint">
          <kbd>F</kbd> Fast Forward (Hold)
        </div>
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