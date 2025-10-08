const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Mock data para desenvolvimento
const mockData = {
  '/api/treinos/recentes': [
    {
      id: 1,
      titulo: 'Peito e Tríceps',
      divisao: 'A',
      data_execucao: new Date().toISOString(),
      tempo_total: 3600,
      volume_total: 2500
    }
  ],
  '/api/historico/stats': {
    total_treinos: 15,
    streak_atual: 3,
    melhor_streak: 7,
    volume_total: 45000,
    tempo_total: 54000,
    exercicios_favoritos: ['Supino', 'Agachamento', 'Levantamento Terra']
  },
  '/api/auth/login': {
    user: { id: 1, nome: 'Usuario Demo', email: 'demo@gymbuddy.com' },
    token: 'demo-token-' + Date.now()
  },
  '/api/auth/register': {
    user: { id: Date.now(), nome: 'Novo Usuario', email: 'novo@gymbuddy.com' },
    token: 'demo-token-' + Date.now()
  }
};

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Em desenvolvimento, usar mock data
    if (import.meta.env.DEV) {
      const mockKey = `${this.baseURL}${endpoint}` as keyof typeof mockData;
      if (mockData[mockKey]) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Para login/register, verificar credenciais
        if (endpoint.includes('/auth/login')) {
          const body = JSON.parse(options.body as string || '{}');
          if (body.email === 'demo@gymbuddy.com' && body.password === 'password') {
            return mockData[mockKey] as T;
          } else {
            throw new Error('Email ou senha incorretos');
          }
        }
        
        return mockData[mockKey] as T;
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Se não conseguir fazer parse do JSON, usa mensagem padrão
        }
        
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          this.setToken(null);
          window.location.href = '/login';
          return null as T;
        }
        
        throw new Error(errorMessage);
      }
      
      if (response.status === 204) {
        return {} as T;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(BASE_URL);