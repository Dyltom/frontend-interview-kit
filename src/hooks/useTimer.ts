import { useState, useEffect, useRef, useCallback } from 'react';
import { DriftCorrectedTimer, TimerState, formatTime, getTimeAnnouncement } from '@utils/timer';

export interface UseTimerReturn {
  elapsed: number;
  isRunning: boolean;
  isPaused: boolean;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  togglePlayPause: () => void;
  setFastForward: (enabled: boolean) => void;
  announcement: string;
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<TimerState>({
    startTime: null,
    pausedAt: null,
    elapsed: 0,
    isRunning: false,
    speedMultiplier: 1
  });

  const timerRef = useRef<DriftCorrectedTimer | null>(null);
  const announcementRef = useRef<string>('');

  useEffect(() => {
    timerRef.current = new DriftCorrectedTimer((elapsed) => {
      setState(prev => ({ ...prev, elapsed }));
    });

    return () => {
      timerRef.current?.stop();
    };
  }, []);

  const start = useCallback(() => {
    if (!timerRef.current || state.isRunning) return;

    const newState = timerRef.current.start(state);
    setState(newState);
    announcementRef.current = 'Timer started';
  }, [state]);

  const pause = useCallback(() => {
    if (!timerRef.current || !state.isRunning) return;

    const newState = timerRef.current.pause(state);
    setState(newState);
    announcementRef.current = getTimeAnnouncement(newState.elapsed, false, true);
  }, [state]);

  const reset = useCallback(() => {
    if (!timerRef.current) return;

    const newState = timerRef.current.reset();
    setState(newState);
    announcementRef.current = 'Timer reset';
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isRunning) {
      pause();
    } else {
      start();
    }
  }, [state.isRunning, start, pause]);

  const setFastForward = useCallback((enabled: boolean) => {
    if (!timerRef.current) return;

    const multiplier = enabled ? 4 : 1;
    const newState = timerRef.current.setSpeedMultiplier(state, multiplier);
    setState(newState);

    if (enabled) {
      announcementRef.current = 'Fast forward enabled';
    } else {
      announcementRef.current = 'Normal speed resumed';
    }
  }, [state]);

  const isPaused = !state.isRunning && state.pausedAt !== null;
  const formattedTime = formatTime(state.elapsed);
  const announcement = announcementRef.current || getTimeAnnouncement(state.elapsed, state.isRunning, isPaused);

  return {
    elapsed: state.elapsed,
    isRunning: state.isRunning,
    isPaused,
    formattedTime,
    start,
    pause,
    reset,
    togglePlayPause,
    setFastForward,
    announcement
  };
}