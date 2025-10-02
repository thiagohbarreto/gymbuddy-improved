export interface Exercicio {
  id: number;
  nome: string;
  series: number;
  repeticoes: string;
  peso?: number;
  descanso?: number;
  observacoes?: string;
  treino_id: number;
  ordem: number;
}

export interface Treino {
  id: number;
  titulo: string;
  divisao: string;
  identificador: string;
  exercicios?: Exercicio[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HistoricoTreino {
  id: number;
  treino_id: number;
  data_execucao: Date;
  tempo_total?: number;
  observacoes?: string;
  exercicios_executados: HistoricoExercicio[];
}

export interface HistoricoExercicio {
  id: number;
  exercicio_id: number;
  peso_usado: number;
  repeticoes_executadas: number;
  series_executadas: number;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  peso?: number;
  altura?: number;
  objetivo?: string;
}

export interface Achievement {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  conquistado: boolean;
  data_conquista?: Date;
}

export interface Stats {
  total_treinos: number;
  streak_atual: number;
  melhor_streak: number;
  volume_total: number;
  tempo_total: number;
  exercicios_favoritos: string[];
}