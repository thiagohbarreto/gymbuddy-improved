import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import { useAppStore } from '../store/useAppStore';

interface StatsData {
  total_treinos: number;
  volume_total: number;
  tempo_total: number;
  streak_atual: number;
  melhor_streak: number;
  exercicios_favoritos: string[];
  progresso_semanal: {
    data: string;
    treinos: number;
    volume: number;
  }[];
  historico_peso: {
    data: string;
    peso: number;
  }[];
  conquistas: {
    id: number;
    titulo: string;
    descricao: string;
    icone: string;
    conquistado: boolean;
    data_conquista: string | null;
  }[];
}

export const useStats = () => {
  const { user } = useAppStore();
  return useQuery({
    queryKey: ['stats', user?.id],
    queryFn: () => api.get<StatsData>('/historico/stats'),
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });
};