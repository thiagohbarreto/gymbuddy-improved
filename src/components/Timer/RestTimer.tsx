import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Square, Plus, Minus, Move } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTimer } from '../../hooks/useTimer';


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
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, x: position.x, y: position.y }}
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
        <div className="text-center mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3>Timer de Descanso</h3>
            <Move size={16} className="cursor-move" />
          </div>
          <div className="text-2xl font-bold">{formattedTime}</div>
        </div>

        {!timerActive ? (
          <div className="flex gap-2">
            {presetTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleStart(time)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {time < 60 ? `${time}s` : `${time / 60}min`}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <button onClick={() => adjustTime(-15)} className="px-2 py-1 bg-gray-200 rounded">
              <Minus size={16} />
              15s
            </button>
            <button onClick={stopTimer} className="px-3 py-2 bg-red-500 text-white rounded">
              <Square size={20} />
            </button>
            <button onClick={() => adjustTime(15)} className="px-2 py-1 bg-gray-200 rounded">
              <Plus size={16} />
              15s
            </button>
          </div>
        )}

        {timerActive && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-blue-500"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: timerSeconds, ease: 'linear' }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};