import { ReactNode } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useDivisoesStore } from '../../store/useDivisoesStore';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { Icon } from '../Icon/Icon';
import toast from 'react-hot-toast';


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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon Icon={User} color="primary" size={20} />
          <span>Olá, {user?.nome || 'Usuário'}</span>
        </div>
        
        <div className="text-center">
          <h1>Gym Buddy</h1>
          <p>Seu companheiro de treino</p>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            <Icon Icon={LogOut} color="white" size={18} />
            <span>Sair</span>
          </button>
        </div>
      </header>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;