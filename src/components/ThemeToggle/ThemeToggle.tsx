import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';


export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={{
        backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
        color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
      <span className="text-sm font-medium">
        {theme === 'dark' ? 'Claro' : 'Escuro'}
      </span>
    </motion.button>
  );
};