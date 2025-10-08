import { motion } from 'framer-motion';


interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingSpinner = ({ size = 'medium', text }: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'}`}>
      <motion.div
        className={`border-4 border-blue-500 border-t-transparent rounded-full ${size === 'small' ? 'w-6 h-6' : size === 'large' ? 'w-12 h-12' : 'w-8 h-8'}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};