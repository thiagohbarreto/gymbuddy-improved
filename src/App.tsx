import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/useAppStore';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { RestTimer } from './components/Timer/RestTimer';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Lazy loading das páginas
const Home = lazy(() => import('./pages/Home/Home'));
const CriarTreino = lazy(() => import('./pages/CriarTreino/CriarTreino'));
const Treino = lazy(() => import('./pages/Treino/Treino'));
const NovaDivisao = lazy(() => import('./pages/NovaDivisao/NovaDivisao'));
const EditarTreino = lazy(() => import('./pages/EditarTreino/EditarTreino'));
const Stats = lazy(() => import('./pages/Stats/Stats'));
const StatsAdvanced = lazy(() => import('./pages/Stats/StatsAdvanced'));
const Historico = lazy(() => import('./pages/Historico/Historico'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Cadastro = lazy(() => import('./pages/Auth/Cadastro'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { theme, setOffline, user, setUser } = useAppStore();

  useEffect(() => {
    // Restaurar usuário do localStorage na inicialização
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser && !user) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData && userData.id && userData.nome && userData.email) {
          setUser(userData);
        } else {
          throw new Error('Dados de usuário inválidos');
        }
      } catch (error) {
        console.warn('Dados corrompidos no localStorage, limpando...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Setup offline detection
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [theme, setOffline]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Suspense fallback={<LoadingSpinner size="large" text="Carregando..." />}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/cadastro" element={!user ? <Cadastro /> : <Navigate to="/" replace />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/nova-divisao" element={
              <ProtectedRoute>
                <Layout>
                  <NovaDivisao />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/treino/:treinoData" element={
              <ProtectedRoute>
                <Layout>
                  <Treino />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/criar-treino" element={
              <ProtectedRoute>
                <Layout>
                  <CriarTreino />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/editar-treino/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditarTreino />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/stats" element={
              <ProtectedRoute>
                <Layout>
                  <Stats />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/stats-advanced" element={
              <ProtectedRoute>
                <Layout>
                  <StatsAdvanced />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/historico" element={
              <ProtectedRoute>
                <Layout>
                  <Historico />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
        
        {user && <RestTimer />}
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;