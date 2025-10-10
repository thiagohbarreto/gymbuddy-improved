import { useQuery } from '@tanstack/react-query';
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

const getMockStats = (userId: number): StatsData => {
  const baseDate = new Date();
  const progressoSemanal = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    progressoSemanal.push({
      data: date.toISOString().split('T')[0],
      treinos: Math.floor(Math.random() * 3) + 1,
      volume: Math.floor(Math.random() * 5000) + 2000,
    });
  }

  const historicoPeso = [];
  for (let i = 30; i >= 0; i -= 5) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    historicoPeso.push({
      data: date.toISOString().split('T')[0],
      peso: 70 + Math.floor(Math.random() * 10),
    });
  }

  return {
    total_treinos: 15 + (userId % 10),
    volume_total: 45000 + (userId * 1000),
    tempo_total: 1200 + (userId * 100),
    streak_atual: 5 + (userId % 3),
    melhor_streak: 12 + (userId % 5),
    exercicios_favoritos: ['Supino', 'Agachamento', 'Levantamento Terra'],
    progresso_semanal: progressoSemanal,
    historico_peso: historicoPeso,
    conquistas: [
      {
        id: 1,
        titulo: 'Primeiro Treino',
        descricao: 'Complete seu primeiro treino',
        icone: '🏋️',
        conquistado: true,
        data_conquista: new Date().toISOString(),
      },
      {
        id: 2,
        titulo: 'Streak de 7 dias',
        descricao: 'Treine por 7 dias consecutivos',
        icone: '🔥',
        conquistado: userId % 2 === 0,
        data_conquista: userId % 2 === 0 ? new Date().toISOString() : null,
      },
      {
        id: 3,
        titulo: 'Volume Master',
        descricao: 'Levante mais de 50.000kg no total',
        icone: '💪',
        conquistado: false,
        data_conquista: null,
      },
    ],
  };
};

export const useStats = () => {
  const { user } = useAppStore();
  
  return useQuery({
    queryKey: ['stats', user?.id],
    queryFn: () => Promise.resolve(getMockStats(user?.id || 1)),
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });
};