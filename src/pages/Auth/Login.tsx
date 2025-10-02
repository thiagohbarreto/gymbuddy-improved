import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useDivisoesStore } from '../../store/useDivisoesStore';
import { Icon } from '../../components/Icon/Icon';
import toast from 'react-hot-toast';
import { useAuthActions } from '../../services/auth';
import styles from './Login.module.scss';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const { setCurrentUser } = useDivisoesStore();
  const { loginWithInvalidation } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const user = await loginWithInvalidation(data);
      setUser(user);
      setCurrentUser(user.id);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Email ou senha incorretos!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <motion.div
        className="glass-card fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        <div className="page-header">
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Icon Icon={Dumbbell} size={40} color="white" />
          </div>
          <h1>Bem-vindo de volta!</h1>
          <p>Entre na sua conta para continuar</p>
          <div className="glass-card" style={{ padding: '1rem', marginTop: '1rem' }}>
            <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem', margin: 0 }}>
              <strong>Demo:</strong> demo@gymbuddy.com / 123456
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              {...register('email')}
              type="email"
              className="input-field"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <Icon Icon={EyeOff} color="secondary" /> : <Icon Icon={Eye} color="secondary" />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            Não tem uma conta?{' '}
            <Link 
              to="/cadastro" 
              style={{ 
                color: 'var(--color-primary)', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
