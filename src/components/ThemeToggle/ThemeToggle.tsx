import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import styles from './ThemeToggle.module.scss';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className={styles.themeToggle}
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
      <span className={styles.label}>
        {theme === 'dark' ? 'Claro' : 'Escuro'}
      </span>
    </motion.button>
  );
};