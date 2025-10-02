import { motion } from 'framer-motion';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingSpinner = ({ size = 'medium', text }: LoadingSpinnerProps) => {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <motion.div
        className={styles.spinner}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};