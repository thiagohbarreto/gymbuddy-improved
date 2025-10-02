import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Treino } from '../types';
import { api } from '../utils/api';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

export const useTreinos = () => {
  const { user } = useAppStore();
  return useQuery({
    queryKey: ['treinos', user?.id],
    queryFn: () => api.get<Treino[]>('/treinos/recentes'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
  });
};

export const useTreino = (id: number) => {
  const { user } = useAppStore();
  return useQuery({
    queryKey: ['treino', id, user?.id],
    queryFn: () => api.get<Treino>(`/treinos/${id}`),
    enabled: !!id && !!user,
  });
};

export const useCreateTreino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (treino: Omit<Treino, 'id' | 'createdAt' | 'updatedAt'>) =>
      api.post<Treino>('/treinos', treino),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
      toast.success('Treino criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar treino');
    },
  });
};

export const useUpdateTreino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...treino }: Partial<Treino> & { id: number }) =>
      api.put<Treino>(`/treinos/${id}`, treino),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
      queryClient.invalidateQueries({ queryKey: ['treino', variables.id] });
      toast.success('Treino atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar treino');
    },
  });
};

export const useDeleteTreino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.delete(`/treinos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
      toast.success('Treino deletado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar treino');
    },
  });
};