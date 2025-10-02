import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export interface HistoricoTreino {
  id: number;
  treino_id: number;
  data_execucao: Date;
  tempo_total?: number;
  observacoes?: string;
  volume_total?: number;
  Treino?: {
    titulo: string;
    divisao: string;
    identificador: string;
  };
}

export interface CreateHistoricoData {
  treino_id: number;
  tempo_total?: number;
  observacoes?: string;
  volume_total?: number;
}

export const useHistorico = (limit = 50, offset = 0, treino_id?: number) => {
  return useQuery({
    queryKey: ['historico', limit, offset, treino_id],
    queryFn: () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(treino_id && { treino_id: treino_id.toString() })
      });
      return api.get<HistoricoTreino[]>(`/historico?${params}`);
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateHistorico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateHistoricoData) =>
      api.post<HistoricoTreino>('/historico', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Treino registrado no histórico!');
    },
    onError: () => {
      toast.error('Erro ao registrar treino');
    },
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get<{
      total_treinos: number;
      volume_total: number;
      tempo_total: number;
      streak_atual: number;
    }>('/historico/stats'),
    staleTime: 5 * 60 * 1000,
  });
};