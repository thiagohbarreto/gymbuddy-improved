import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
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

const getMockHistorico = (userId: number, limit = 50): HistoricoTreino[] => {
  const historico: HistoricoTreino[] = [];
  const treinos = [
    { titulo: 'Peito e Tríceps', divisao: 'Push', identificador: 'A' },
    { titulo: 'Costas e Bíceps', divisao: 'Pull', identificador: 'B' },
    { titulo: 'Pernas', divisao: 'Legs', identificador: 'C' },
  ];

  for (let i = 0; i < Math.min(limit, 10 + (userId % 5)); i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 2);
    
    const treino = treinos[i % treinos.length];
    
    historico.push({
      id: userId * 1000 + i,
      treino_id: i % 3 + 1,
      data_execucao: date,
      tempo_total: 45 + Math.floor(Math.random() * 30),
      volume_total: 3000 + Math.floor(Math.random() * 2000),
      observacoes: i % 3 === 0 ? 'Treino intenso!' : undefined,
      Treino: treino,
    });
  }

  return historico;
};

export const useHistorico = (limit = 50, offset = 0, treino_id?: number) => {
  const { user } = useAppStore();
  
  return useQuery({
    queryKey: ['historico', user?.id, limit, offset, treino_id],
    queryFn: () => {
      const mockData = getMockHistorico(user?.id || 1, limit);
      return Promise.resolve(treino_id ? mockData.filter(h => h.treino_id === treino_id) : mockData);
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!user,
  });
};

export const useCreateHistorico = () => {
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  
  return useMutation({
    mutationFn: (data: CreateHistoricoData) => {
      const newHistorico: HistoricoTreino = {
        id: Date.now(),
        treino_id: data.treino_id,
        data_execucao: new Date(),
        tempo_total: data.tempo_total,
        volume_total: data.volume_total,
        observacoes: data.observacoes,
        Treino: {
          titulo: 'Novo Treino',
          divisao: 'Custom',
          identificador: 'X',
        },
      };
      return Promise.resolve(newHistorico);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['stats', user?.id] });
      toast.success('Treino registrado no histórico!');
    },
    onError: () => {
      toast.error('Erro ao registrar treino');
    },
  });
};