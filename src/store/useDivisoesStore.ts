import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TreinoDivisao {
  identificador: string;
  titulo: string;
  foco: string;
}

export interface Divisao {
  id: string;
  nome: string;
  treinos: TreinoDivisao[];
  criadaEm: Date;
}

interface DivisoesStore {
  divisoes: Divisao[];
  currentUserId: number | null;
  adicionarDivisao: (divisao: Omit<Divisao, 'id' | 'criadaEm'>) => void;
  atualizarDivisao: (id: string, dados: Omit<Divisao, 'id' | 'criadaEm'>) => void;
  removerDivisao: (id: string) => void;
  obterDivisao: (id: string) => Divisao | undefined;
  setCurrentUser: (userId: number | null) => void;
  limparDados: () => void;
}

export const useDivisoesStore = create<DivisoesStore>()(
  persist(
    (set, get) => ({
      divisoes: [],
      currentUserId: null,
      
      adicionarDivisao: (novaDivisao) => {
        const divisao: Divisao = {
          ...novaDivisao,
          id: Date.now().toString(),
          criadaEm: new Date(),
        };
        
        set((state) => ({
          divisoes: [...state.divisoes, divisao]
        }));
      },
      
      atualizarDivisao: (id, dadosAtualizados) => {
        set((state) => ({
          divisoes: state.divisoes.map(divisao => 
            divisao.id === id 
              ? { ...divisao, ...dadosAtualizados }
              : divisao
          )
        }));
      },
      
      removerDivisao: (id) => {
        set((state) => ({
          divisoes: state.divisoes.filter(d => d.id !== id)
        }));
      },
      
      obterDivisao: (id) => {
        return get().divisoes.find(d => d.id === id);
      },
      
      setCurrentUser: (userId) => {
        set({ currentUserId: userId });
      },
      
      limparDados: () => {
        set({ divisoes: [], currentUserId: null });
      },
    }),
    {
      name: 'gym-buddy-divisoes',
      partialize: (state) => ({
        divisoes: state.currentUserId ? state.divisoes : [],
        currentUserId: state.currentUserId
      }),
      storage: {
        getItem: (name) => {
          try {
            const currentData = localStorage.getItem(name);
            if (!currentData) return null;
            const data = JSON.parse(currentData);
            const key = `${name}-${data.currentUserId || 'guest'}`;
            return localStorage.getItem(key);
          } catch {
            return localStorage.getItem(`${name}-guest`);
          }
        },
        setItem: (name, value) => {
          try {
            const data = JSON.parse(value);
            const key = `${name}-${data.currentUserId || 'guest'}`;
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
              const key = `${name}-${data.currentUserId || 'guest'}`;
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