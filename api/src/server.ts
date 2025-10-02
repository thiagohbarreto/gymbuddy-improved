import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(limiter);
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// File paths for data persistence
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TREINOS_FILE = path.join(DATA_DIR, 'treinos.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files or use defaults
const loadData = (filePath: string, defaultData: any) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
  }
  return defaultData;
};

// Save data to file
const saveData = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error saving data to ${filePath}:`, error);
  }
};

// Default data
const defaultUsers = [{ id: 1, nome: 'Demo User', email: 'demo@gymbuddy.com', password: '123456' }];
const defaultTreinos = [
  {
    id: 1,
    titulo: 'Peito e Tríceps',
    divisao: 'A',
    identificador: 'A',
    exercicios: [
      {
        id: 1,
        nome: 'Supino Reto',
        series: 4,
        repeticoes: '8-12',
        peso: 80,
        descanso: 120,
        treino_id: 1,
        ordem: 1
      },
      {
        id: 2,
        nome: 'Supino Inclinado',
        series: 3,
        repeticoes: '10-12',
        peso: 70,
        descanso: 90,
        treino_id: 1,
        ordem: 2
      },
      {
        id: 3,
        nome: 'Tríceps Testa',
        series: 3,
        repeticoes: '12-15',
        peso: 30,
        descanso: 60,
        treino_id: 1,
        ordem: 3
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    titulo: 'Costas e Bíceps',
    divisao: 'B',
    identificador: 'B',
    exercicios: [
      {
        id: 4,
        nome: 'Puxada Frontal',
        series: 4,
        repeticoes: '8-10',
        peso: 60,
        descanso: 120,
        treino_id: 2,
        ordem: 1
      },
      {
        id: 5,
        nome: 'Remada Curvada',
        series: 3,
        repeticoes: '10-12',
        peso: 50,
        descanso: 90,
        treino_id: 2,
        ordem: 2
      },
      {
        id: 6,
        nome: 'Rosca Direta',
        series: 3,
        repeticoes: '12-15',
        peso: 20,
        descanso: 60,
        treino_id: 2,
        ordem: 3
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Load persisted data
let mockUsers = loadData(USERS_FILE, defaultUsers);
let mockTreinos = loadData(TREINOS_FILE, defaultTreinos);

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token: 'mock-jwt-token' });
});

app.post('/api/auth/register', (req, res) => {
  const { nome, email, password } = req.body;
  const newUser = { id: Date.now(), nome, email, password };
  mockUsers.push(newUser);
  saveData(USERS_FILE, mockUsers);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword, token: 'mock-jwt-token' });
});

// Treinos routes
app.get('/api/treinos', (req, res) => res.json(mockTreinos));
app.get('/api/treinos/recentes', (req, res) => res.json(mockTreinos));
app.get('/api/treinos/:id', (req, res) => {
  const treino = mockTreinos.find(t => t.id === parseInt(req.params.id));
  if (!treino) return res.status(404).json({ error: 'Treino não encontrado' });
  res.json(treino);
});

app.post('/api/treinos', (req, res) => {
  const novoTreino = { id: Date.now(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
  mockTreinos.push(novoTreino);
  saveData(TREINOS_FILE, mockTreinos);
  res.status(201).json(novoTreino);
});

app.put('/api/treinos/:id', (req, res) => {
  const index = mockTreinos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Treino não encontrado' });
  mockTreinos[index] = { ...mockTreinos[index], ...req.body, updatedAt: new Date() };
  saveData(TREINOS_FILE, mockTreinos);
  res.json(mockTreinos[index]);
});

app.delete('/api/treinos/:id', (req, res) => {
  const index = mockTreinos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Treino não encontrado' });
  mockTreinos.splice(index, 1);
  saveData(TREINOS_FILE, mockTreinos);
  res.status(204).send();
});

// Historico routes
app.get('/api/historico', (req, res) => res.json([]));
app.post('/api/historico', (req, res) => res.status(201).json({ id: Date.now(), ...req.body }));
app.get('/api/historico/stats', (req, res) => {
  const totalTreinos = mockTreinos.length;
  const volumeTotal = mockTreinos.reduce((acc, treino) => {
    return acc + (treino.exercicios?.reduce((vol, ex) => vol + (ex.peso || 0) * ex.series, 0) || 0);
  }, 0);
  
  // Data do primeiro treino ou hoje se não houver treinos
  const primeiroTreino = mockTreinos.length > 0 ? mockTreinos[0].createdAt : new Date();
  const dataInicio = new Date(primeiroTreino);
  const hoje = new Date();
  
  // Gerar dados de progresso semanal baseados na data real
  const progressoSemanal = [];
  const semanas = Math.max(1, Math.ceil((hoje.getTime() - dataInicio.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  
  for (let i = 0; i < Math.min(semanas, 8); i++) {
    const dataAtual = new Date(dataInicio);
    dataAtual.setDate(dataAtual.getDate() + (i * 7));
    const treinosNaSemana = Math.min(totalTreinos, Math.floor(Math.random() * 3) + 1);
    const volumeNaSemana = Math.floor(volumeTotal * (i + 1) / semanas);
    
    progressoSemanal.push({
      data: dataAtual.toISOString().split('T')[0],
      treinos: treinosNaSemana,
      volume: volumeNaSemana
    });
  }
  
  // Gerar histórico de peso baseado na data do primeiro treino
  const historicoPeso = [];
  const meses = Math.max(1, Math.ceil((hoje.getTime() - dataInicio.getTime()) / (30 * 24 * 60 * 60 * 1000)));
  let pesoInicial = 75;
  
  for (let i = 0; i < Math.min(meses, 6); i++) {
    const dataAtual = new Date(dataInicio);
    dataAtual.setMonth(dataAtual.getMonth() + i);
    pesoInicial += Math.random() * 2; // Ganho gradual de peso
    
    historicoPeso.push({
      data: dataAtual.toISOString().split('T')[0],
      peso: Math.round(pesoInicial * 10) / 10
    });
  }
  
  const exerciciosFavoritos = mockTreinos
    .flatMap(t => t.exercicios?.map(e => e.nome) || [])
    .reduce((acc: {[key: string]: number}, nome) => {
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {})
    
  const topExercicios = Object.entries(exerciciosFavoritos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([nome]) => nome);
  
  // Sistema de conquistas baseado em dados reais
  const conquistas = [
    {
      id: 1,
      titulo: 'Primeiro Passo',
      descricao: 'Complete seu primeiro treino',
      icone: '🎯',
      conquistado: totalTreinos >= 1,
      data_conquista: totalTreinos >= 1 ? dataInicio.toISOString() : null
    },
    {
      id: 2,
      titulo: 'Consistência',
      descricao: 'Complete 5 treinos',
      icone: '💪',
      conquistado: totalTreinos >= 5,
      data_conquista: totalTreinos >= 5 ? new Date(dataInicio.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() : null
    },
    {
      id: 3,
      titulo: 'Dedicado',
      descricao: 'Complete 10 treinos',
      icone: '🔥',
      conquistado: totalTreinos >= 10,
      data_conquista: totalTreinos >= 10 ? new Date(dataInicio.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString() : null
    },
    {
      id: 4,
      titulo: 'Forte',
      descricao: 'Levante mais de 1000kg em volume total',
      icone: '🏋️',
      conquistado: volumeTotal >= 1000,
      data_conquista: volumeTotal >= 1000 ? new Date().toISOString() : null
    },
    {
      id: 5,
      titulo: 'Máquina',
      descricao: 'Complete 20 treinos',
      icone: '⚡',
      conquistado: totalTreinos >= 20,
      data_conquista: totalTreinos >= 20 ? new Date(dataInicio.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString() : null
    },
    {
      id: 6,
      titulo: 'Lenda',
      descricao: 'Levante mais de 5000kg em volume total',
      icone: '👑',
      conquistado: volumeTotal >= 5000,
      data_conquista: volumeTotal >= 5000 ? new Date().toISOString() : null
    }
  ];
  
  res.json({
    total_treinos: totalTreinos,
    volume_total: volumeTotal,
    tempo_total: totalTreinos * 45,
    streak_atual: Math.min(totalTreinos, 7),
    melhor_streak: Math.min(totalTreinos + 2, 14),
    exercicios_favoritos: topExercicios,
    progresso_semanal: progressoSemanal,
    historico_peso: historicoPeso,
    conquistas: conquistas
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔄 Modo: Mock (sem banco de dados)`);
});