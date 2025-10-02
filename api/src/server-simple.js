const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
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

// Mock auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  
  // Extract user ID from token (mock)
  const userId = token === 'mock-jwt-token' ? 1 : parseInt(token.split('-')[2]) || null;
  if (!userId) return res.status(401).json({ error: 'Token inválido' });
  
  req.userId = userId;
  next();
};

// Mock data - usando Map para evitar referências compartilhadas
const fs = require('fs');
const path = require('path');

// Arquivos para persistir dados
const USERS_FILE = path.join(__dirname, '../users.json');
const TREINOS_FILE = path.join(__dirname, '../treinos.json');

// Carregar usuários do arquivo ou usar padrão
let mockUsers;
try {
  if (fs.existsSync(USERS_FILE)) {
    mockUsers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } else {
    mockUsers = [{ id: 1, nome: 'Demo User', email: 'demo@gymbuddy.com', password: '123456' }];
  }
} catch {
  mockUsers = [{ id: 1, nome: 'Demo User', email: 'demo@gymbuddy.com', password: '123456' }];
}

// Salvar usuários no arquivo
const saveUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(mockUsers, null, 2));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
  }
};

// Salvar treinos no arquivo
const saveTreinos = () => {
  try {
    const treinosObj = {};
    mockTreinos.forEach((value, key) => {
      treinosObj[key] = value;
    });
    fs.writeFileSync(TREINOS_FILE, JSON.stringify(treinosObj, null, 2));
  } catch (error) {
    console.error('Erro ao salvar treinos:', error);
  }
};

// Carregar treinos do arquivo
const loadTreinos = () => {
  try {
    if (fs.existsSync(TREINOS_FILE)) {
      const data = JSON.parse(fs.readFileSync(TREINOS_FILE, 'utf8'));
      Object.entries(data).forEach(([userId, treinos]) => {
        mockTreinos.set(parseInt(userId), treinos);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar treinos:', error);
  }
};

const mockTreinos = new Map();
const mockHistorico = new Map();
const mockStats = new Map();

// Carregar treinos existentes
loadTreinos();

// Inicializar dados do usuário demo se não existir
if (!mockTreinos.has(1)) {
  mockTreinos.set(1, [{
    id: 1,
    user_id: 1,
    titulo: 'Peito e Tríceps',
    divisao: 'A',
    identificador: 'A',
    exercicios: [{
      id: 1,
      nome: 'Supino Reto',
      series: 4,
      repeticoes: '8-12',
      peso: 80,
      descanso: 120,
      treino_id: 1,
      ordem: 1
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  }]);
}
if (!mockHistorico.has(1)) mockHistorico.set(1, []);
if (!mockStats.has(1)) mockStats.set(1, { total_treinos: 0, volume_total: 0, tempo_total: 0, streak_atual: 0 });

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.' });
  const { password: _, ...userWithoutPassword } = user;
  const token = user.id === 1 ? 'mock-jwt-token' : `mock-jwt-${user.id}`;
  res.json({ user: userWithoutPassword, token });
});

app.post('/api/auth/register', (req, res) => {
  const { nome, email, password } = req.body;
  
  if (!nome || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
  }
  
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Este email já está cadastrado. Tente fazer login ou use outro email.' });
  }
  
  const newUser = { id: Date.now(), nome, email, password, createdAt: new Date().toISOString() };
  mockUsers.push(newUser);
  saveUsers(); // Salvar usuários no arquivo
  
  // Inicializar dados vazios para o novo usuário
  mockTreinos.set(newUser.id, []);
  mockHistorico.set(newUser.id, []);
  mockStats.set(newUser.id, { total_treinos: 0, volume_total: 0, tempo_total: 0, streak_atual: 0 });
  
  const { password: _, ...userWithoutPassword } = newUser;
  const token = `mock-jwt-${newUser.id}`;
  res.json({ user: userWithoutPassword, token });
});

// Treinos routes
app.get('/api/treinos', authMiddleware, (req, res) => {
  const userTreinos = mockTreinos.get(req.userId) || [];
  res.json(JSON.parse(JSON.stringify(userTreinos))); // Deep copy
});

app.get('/api/treinos/recentes', authMiddleware, (req, res) => {
  const userTreinos = mockTreinos.get(req.userId) || [];
  res.json(JSON.parse(JSON.stringify(userTreinos.slice(-5)))); // Deep copy
});

app.get('/api/treinos/:id', authMiddleware, (req, res) => {
  const userTreinos = mockTreinos.get(req.userId) || [];
  const treino = userTreinos.find(t => t.id === parseInt(req.params.id));
  if (!treino) return res.status(404).json({ error: 'Treino não encontrado' });
  res.json(JSON.parse(JSON.stringify(treino))); // Deep copy
});

app.post('/api/treinos', authMiddleware, (req, res) => {
  const { titulo, divisao, identificador, exercicios } = req.body;
  
  if (!titulo || !divisao || !identificador) {
    return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
  }
  
  if (!mockTreinos.has(req.userId)) mockTreinos.set(req.userId, []);
  const userTreinos = mockTreinos.get(req.userId);
  const novoTreino = { 
    id: Date.now(), 
    user_id: req.userId,
    titulo,
    divisao,
    identificador,
    exercicios: exercicios || [],
    createdAt: new Date(), 
    updatedAt: new Date() 
  };
  userTreinos.push(novoTreino);
  saveTreinos();
  res.status(201).json(JSON.parse(JSON.stringify(novoTreino))); // Deep copy
});

app.put('/api/treinos/:id', authMiddleware, (req, res) => {
  const userTreinos = mockTreinos.get(req.userId) || [];
  const index = userTreinos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Treino não encontrado' });
  userTreinos[index] = { ...userTreinos[index], ...req.body, updatedAt: new Date() };
  saveTreinos();
  res.json(JSON.parse(JSON.stringify(userTreinos[index]))); // Deep copy
});

app.delete('/api/treinos/:id', authMiddleware, (req, res) => {
  const userTreinos = mockTreinos.get(req.userId) || [];
  const index = userTreinos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Treino não encontrado' });
  userTreinos.splice(index, 1);
  saveTreinos();
  res.status(204).send();
});

// Historico routes
app.get('/api/historico', authMiddleware, (req, res) => {
  const userHistorico = mockHistorico.get(req.userId) || [];
  res.json(JSON.parse(JSON.stringify(userHistorico))); // Deep copy
});

app.post('/api/historico', authMiddleware, (req, res) => {
  if (!mockHistorico.has(req.userId)) mockHistorico.set(req.userId, []);
  const userHistorico = mockHistorico.get(req.userId);
  const novoHistorico = { id: Date.now(), user_id: req.userId, ...req.body };
  userHistorico.push(novoHistorico);
  res.status(201).json(JSON.parse(JSON.stringify(novoHistorico))); // Deep copy
});

app.get('/api/historico/stats', authMiddleware, (req, res) => {
  const userTreinos = mockTreinos.get(req.userId) || [];
  const user = mockUsers.find(u => u.id === req.userId);
  const totalTreinos = userTreinos.length;
  
  // Calcular volume total
  const volumeTotal = userTreinos.reduce((acc, treino) => {
    return acc + (treino.exercicios?.reduce((vol, ex) => vol + (ex.peso || 0) * ex.series, 0) || 0);
  }, 0);
  
  // Exercícios favoritos
  const exerciciosFavoritos = userTreinos
    .flatMap(t => t.exercicios?.map(e => e.nome) || [])
    .reduce((acc, nome) => {
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {})
  
  const topExercicios = Object.entries(exerciciosFavoritos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([nome]) => nome);
  
  // Data de cadastro do usuário ou hoje se não existir
  const dataCadastro = user?.createdAt ? new Date(user.createdAt) : new Date();
  const hoje = new Date();
  
  // Gerar dados de progresso semanal a partir do cadastro
  const progressoSemanal = [];
  const semanasCadastro = Math.ceil((hoje - dataCadastro) / (7 * 24 * 60 * 60 * 1000));
  const semanasParaMostrar = Math.min(8, Math.max(1, semanasCadastro));
  
  for (let i = semanasParaMostrar - 1; i >= 0; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - (i * 7));
    
    // Só mostrar dados se a data for após o cadastro
    if (data >= dataCadastro) {
      const treinosNaSemana = Math.floor(totalTreinos * (semanasParaMostrar - i) / semanasParaMostrar);
      const volumeNaSemana = Math.floor(volumeTotal * (semanasParaMostrar - i) / semanasParaMostrar);
      
      progressoSemanal.push({
        data: data.toISOString().split('T')[0],
        treinos: treinosNaSemana,
        volume: volumeNaSemana
      });
    }
  }
  
  // Gerar histórico de peso a partir do cadastro
  const historicoPeso = [];
  const mesesCadastro = Math.ceil((hoje - dataCadastro) / (30 * 24 * 60 * 60 * 1000));
  const mesesParaMostrar = Math.min(6, Math.max(1, mesesCadastro));
  let pesoInicial = 75;
  
  for (let i = mesesParaMostrar - 1; i >= 0; i--) {
    const data = new Date(dataCadastro);
    data.setMonth(data.getMonth() + (mesesParaMostrar - 1 - i));
    
    // Só mostrar dados se a data for após o cadastro
    if (data >= dataCadastro && data <= hoje) {
      pesoInicial += (Math.random() - 0.5) * 2; // Variação mais realista
      historicoPeso.push({
        data: data.toISOString().split('T')[0],
        peso: Math.round(pesoInicial * 10) / 10
      });
    }
  }
  
  // Sistema de conquistas
  const conquistas = [
    {
      id: 1,
      titulo: 'Primeiro Passo',
      descricao: 'Complete seu primeiro treino',
      icone: '🎯',
      conquistado: totalTreinos >= 1,
      data_conquista: totalTreinos >= 1 ? new Date().toISOString() : null
    },
    {
      id: 2,
      titulo: 'Consistência',
      descricao: 'Complete 5 treinos',
      icone: '💪',
      conquistado: totalTreinos >= 5,
      data_conquista: totalTreinos >= 5 ? new Date().toISOString() : null
    },
    {
      id: 3,
      titulo: 'Dedicado',
      descricao: 'Complete 10 treinos',
      icone: '🔥',
      conquistado: totalTreinos >= 10,
      data_conquista: totalTreinos >= 10 ? new Date().toISOString() : null
    }
  ];
  
  const stats = {
    total_treinos: totalTreinos,
    volume_total: volumeTotal,
    tempo_total: totalTreinos * 45,
    streak_atual: totalTreinos > 0 ? Math.min(totalTreinos, 7) : 0,
    melhor_streak: totalTreinos > 0 ? Math.max(totalTreinos, 1) : 0,
    exercicios_favoritos: topExercicios,
    progresso_semanal: progressoSemanal,
    historico_peso: historicoPeso,
    conquistas: conquistas
  };
  
  res.json(JSON.parse(JSON.stringify(stats))); // Deep copy
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: development`);
  console.log(`🔄 Modo: Mock (sem banco de dados)`);
});