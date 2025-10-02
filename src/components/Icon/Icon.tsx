import { LucideIcon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface IconProps {
  Icon: LucideIcon;
  size?: number;
  className?: string;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'text' | 'white';
}

export const Icon = ({ Icon, size = 20, className = '', color = 'text' }: IconProps) => {
  const { theme } = useAppStore();
  
  const getColor = () => {
    if (color === 'white') return '#ffffff';
    if (color === 'primary') return theme === 'dark' ? '#60a5fa' : '#3b82f6';
    if (color === 'secondary') return theme === 'dark' ? '#e2e8f0' : '#64748b';
    if (color === 'danger') return theme === 'dark' ? '#f87171' : '#ef4444';
    if (color === 'success') return '#10b981';
    if (color === 'warning') return '#f59e0b';
    if (color === 'text') return theme === 'dark' ? '#ffffff' : '#1e293b';
    return theme === 'dark' ? '#e2e8f0' : '#64748b';
  };

  return (
    <Icon 
      size={size} 
      className={`icon ${className}`}
      style={{ 
        color: getColor(),
        background: 'none',
        backgroundColor: 'transparent',
        fill: 'none',
        stroke: 'currentColor'
      }}
    />
  );
};