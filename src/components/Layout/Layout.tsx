import { ReactNode } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useDivisoesStore } from '../../store/useDivisoesStore';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { Icon } from '../Icon/Icon';
import toast from 'react-hot-toast';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, setUser } = useAppStore();
  const { limparDados } = useDivisoesStore();

  const handleLogout = () => {
    // Limpar localStorage completamente
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gymbuddy-') || key.startsWith('gym-buddy-')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    limparDados();
    toast.success('Logout realizado com sucesso!');
    window.location.reload();
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <Icon Icon={User} color="primary" size={20} />
          <span>Olá, {user?.nome || 'Usuário'}</span>
        </div>
        
        <div className={styles.brand}>
          <h1>Gym Buddy</h1>
          <p>Seu companheiro de treino</p>
        </div>
        
        <div className={styles.headerActions}>
          <ThemeToggle />
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <Icon Icon={LogOut} color="white" size={18} />
            <span>Sair</span>
          </button>
        </div>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;