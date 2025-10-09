import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Dumbbell } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useDivisoesStore } from '../../store/useDivisoesStore';
import toast from 'react-hot-toast';
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

    setTimeout(() => {
      // Validação simples de credenciais
      if (data.email === 'demo@gymbuddy.com' && data.password === '123456') {
        const mockUser = {
          id: 1,
          nome: 'Usuário Demo',
          email: data.email,
        };

        setUser(mockUser);
        setCurrentUser(mockUser.id);
        toast.success('Login realizado com sucesso!');
        navigate('/');
      } else {
        toast.error('Email ou senha incorretos!');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Dumbbell className="text-white" size={40} />
          </div>
          <h1 className={styles.title}>Bem-vindo de volta!</h1>
          <p className={styles.subtitle}>Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              {...register('email')}
              type="email"
              className={styles.input}
              placeholder="demo@gymbuddy.com"
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Senha</label>
            <div className={styles.passwordContainer}>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="123456"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Não tem uma conta?{' '}
            <Link to="/cadastro" className={styles.link}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;