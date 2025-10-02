import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Achievement, Stats } from '../types';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Timer
  timerActive: boolean;
  timerSeconds: number;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  
  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  
  // Stats
  stats: Stats;
  updateStats: (stats: Partial<Stats>) => void;
  
  // Offline
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Timer
      timerActive: false,
      timerSeconds: 0,
      startTimer: (seconds) => set({ timerActive: true, timerSeconds: seconds }),
      stopTimer: () => set({ timerActive: false, timerSeconds: 0 }),
      
      // Achievements
      achievements: [
        {
          id: 'first-workout',
          titulo: 'Primeiro Treino',
          descricao: 'Complete seu primeiro treino',
          icone: '🏋️',
          conquistado: false
        },
        {
          id: 'week-streak',
          titulo: 'Semana Consistente',
          descricao: 'Treine por 7 dias consecutivos',
          icone: '🔥',
          conquistado: false
        }
      ],
      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map(achievement =>
          achievement.id === id 
            ? { ...achievement, conquistado: true, data_conquista: new Date() }
            : achievement
        )
      })),
      
      // Stats
      stats: {
        total_treinos: 0,
        streak_atual: 0,
        melhor_streak: 0,
        volume_total: 0,
        tempo_total: 0,
        exercicios_favoritos: []
      },
      updateStats: (newStats) => set((state) => ({
        stats: { ...state.stats, ...newStats }
      })),
      
      // Offline
      isOffline: false,
      setOffline: (offline) => set({ isOffline: offline })
    }),
    {
      name: 'gymbuddy-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        achievements: state.user ? state.achievements : [],
        stats: state.user ? state.stats : {
          total_treinos: 0,
          streak_atual: 0,
          melhor_streak: 0,
          volume_total: 0,
          tempo_total: 0,
          exercicios_favoritos: []
        }
      }),
      storage: {
        getItem: (name) => {
          try {
            const currentData = localStorage.getItem(name);
            if (!currentData) return null;
            const data = JSON.parse(currentData);
            const key = `${name}-${data.user?.id || 'guest'}`;
            return localStorage.getItem(key);
          } catch {
            return localStorage.getItem(`${name}-guest`);
          }
        },
        setItem: (name, value) => {
          try {
            const data = JSON.parse(value);
            const key = `${name}-${data.user?.id || 'guest'}`;
            localStorage.setItem(key, value);
          } catch {
            localStorage.setItem(`${name}-guest`, value);
          }
        },
        removeItem: (name) => {
          try {
            const currentData = localStorage.getItem(name);
            if (currentData) {
              const data = JSON.parse(currentData);
              const key = `${name}-${data.user?.id || 'guest'}`;
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(`${name}-guest`);
          }
        }
      }
    }
  )
);