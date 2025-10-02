import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useTimer = () => {
  const { timerActive, timerSeconds, stopTimer } = useAppStore();
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        useAppStore.setState((state) => ({
          timerSeconds: state.timerSeconds - 1
        }));
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      stopTimer();
      // Play notification sound or show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Descanso terminado!', {
          body: 'Hora de continuar o treino',
          icon: '/icon-gymbuddy.png'
        });
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerActive, timerSeconds, stopTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timerActive,
    timerSeconds,
    formattedTime: formatTime(timerSeconds)
  };
};