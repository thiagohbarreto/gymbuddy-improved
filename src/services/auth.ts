import { api } from '../utils/api';
import { useQueryClient } from '@tanstack/react-query';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (data: LoginData): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    api.setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response.user;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    api.setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response.user;
  },

  logout: () => {
    api.setToken(null);
    localStorage.removeItem('user');
  }
};

// Hook para invalidar queries após login
export const useAuthActions = () => {
  const queryClient = useQueryClient();
  
  const loginWithInvalidation = async (data: LoginData) => {
    const user = await authService.login(data);
    return user;
  };
  
  const registerWithInvalidation = async (data: RegisterData) => {
    const user = await authService.register(data);
    return user;
  };
  
  return { loginWithInvalidation, registerWithInvalidation };
};