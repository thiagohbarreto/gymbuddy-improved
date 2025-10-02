import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Dumbbell, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useDivisoesStore } from '../../store/useDivisoesStore';
import { Icon } from '../../components/Icon/Icon';
import toast from 'react-hot-toast';
import { useAuthActions } from '../../services/auth';
import styles from '../Auth/Login.module.scss';

const cadastroSchema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

type CadastroForm = z.infer<typeof cadastroSchema>;

const Cadastro = () => {
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const { setCurrentUser } = useDivisoesStore();
  const { registerWithInvalidation } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
  });

  const onSubmit = async (data: CadastroForm) => {
    setIsLoading(true);

    try {
      const user = await registerWithInvalidation({
        nome: data.nome,
        email: data.email,
        password: data.password,
      });

      setUser(user);
      setCurrentUser(user.id);
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
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
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Icon Icon={UserPlus} size={40} color="white" />
          </div>
          <h1>Criar Conta</h1>
          <p>Comece sua jornada fitness hoje</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label className="input-label">Nome</label>
            <input
              {...register('nome')}
              type="text"
              className="input-field"
              placeholder="Seu nome completo"
            />
            {errors.nome && (
              <p
                style={{
                  color: 'var(--color-danger)',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem',
                }}
              >
                {errors.nome.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              {...register('email')}
              type="email"
              className="input-field"
              placeholder="Digite seu email"
            />
            {errors.email && (
              <p
                style={{
                  color: 'var(--color-danger)',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem',
                }}
              >
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
                placeholder="Digite sua senha"
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
                  padding: '0.25rem',
                }}
              >
                {showPassword ? (
                  <Icon Icon={EyeOff} color="secondary" />
                ) : (
                  <Icon Icon={Eye} color="secondary" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                style={{
                  color: 'var(--color-danger)',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem',
                }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Confirmar Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Digite sua senha"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                {showConfirmPassword ? (
                  <Icon Icon={EyeOff} color="secondary" />
                ) : (
                  <Icon Icon={Eye} color="secondary" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                style={{
                  color: 'var(--color-danger)',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem',
                }}
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            Já tem uma conta?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Faça login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Cadastro;
