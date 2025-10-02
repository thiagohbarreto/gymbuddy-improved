import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Plus, Minus, Move } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTimer } from '../../hooks/useTimer';
import styles from './RestTimer.module.scss';

export const RestTimer = () => {
  const { timerActive, startTimer, stopTimer } = useAppStore();
  const { formattedTime, timerSeconds } = useTimer();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const presetTimes = [60, 90, 120, 180]; // 1min, 1.5min, 2min, 3min

  const handleStart = (seconds: number) => {
    startTimer(seconds);
  };

  const adjustTime = (adjustment: number) => {
    const newTime = Math.max(0, timerSeconds + adjustment);
    useAppStore.setState({ timerSeconds: newTime });
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, x: position.x, y: position.y }}
        exit={{ opacity: 0, y: 50 }}
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragEnd={(_, info) => {
          setPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y
          });
        }}
        style={{
          x: position.x,
          y: position.y
        }}
      >
        <div className={styles.display}>
          <div className={styles.header}>
            <h3>Timer de Descanso</h3>
            <Move size={16} className={styles.dragIcon} />
          </div>
          <div className={styles.time}>{formattedTime}</div>
        </div>

        {!timerActive ? (
          <div className={styles.presets}>
            {presetTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleStart(time)}
                className={styles.presetBtn}
              >
                {time < 60 ? `${time}s` : `${time / 60}min`}
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.controls}>
            <button onClick={() => adjustTime(-15)} className={styles.adjustBtn}>
              <Minus size={16} />
              15s
            </button>
            <button onClick={stopTimer} className={styles.stopBtn}>
              <Square size={20} />
            </button>
            <button onClick={() => adjustTime(15)} className={styles.adjustBtn}>
              <Plus size={16} />
              15s
            </button>
          </div>
        )}

        {timerActive && (
          <motion.div
            className={styles.progress}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: timerSeconds, ease: 'linear' }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};