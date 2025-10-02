import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Settings, Moon, Sun, Award, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { BackupExport } from '../../components/Backup/BackupExport';
import { PushNotifications } from '../../components/Notifications/PushNotifications';
import { TestRunner } from '../../components/Tests/TestRunner';

import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, theme, toggleTheme, achievements, stats } = useAppStore();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    peso: user?.peso || '',
    altura: user?.altura || '',
    objetivo: user?.objetivo || ''
  });

  const [activeTab, setActiveTab] = useState<'perfil' | 'configuracoes' | 'conquistas' | 'calculadoras'>('perfil');

  const handleSave = () => {
    const novoUser = {
      id: user?.id || 1,
      nome: formData.nome,
      email: formData.email,
      peso: formData.peso ? parseFloat(formData.peso.toString()) : undefined,
      altura: formData.altura ? parseFloat(formData.altura.toString()) : undefined,
      objetivo: formData.objetivo
    };
    
    setUser(novoUser);
    setEditMode(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const calcularIMC = () => {
    if (formData.peso && formData.altura) {
      const peso = parseFloat(formData.peso.toString());
      const altura = parseFloat(formData.altura.toString()) / 100; // converter cm para m
      return (peso / (altura * altura)).toFixed(1);
    }
    return null;
  };

  const calcular1RM = (peso: number, reps: number) => {
    // Fórmula de Brzycki
    return (peso * (36 / (37 - reps))).toFixed(1);
  };

  const conquistasDesbloqueadas = achievements.filter(a => a.conquistado);
  const conquistasPendentes = achievements.filter(a => !a.conquistado);

  return (
    <div className="page-container">
      <div className="glass-card fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="page-header">
          <h1>Perfil</h1>
          <p>Gerencie suas informações e configurações</p>
        </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: 'perfil', label: 'Perfil', icon: User },
          { id: 'configuracoes', label: 'Configurações', icon: Settings },
          { id: 'conquistas', label: 'Conquistas', icon: Award },
          { id: 'calculadoras', label: 'Calculadoras', icon: Calculator }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo das Tabs */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <div className="section-header">
              <h2 className="title">Informações Pessoais</h2>
              <button
                onClick={() => editMode ? handleSave() : setEditMode(true)}
                className="btn-primary"
              >
                {editMode ? 'Salvar' : 'Editar'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={!editMode}
                  className="input-field disabled:opacity-60"
                  placeholder="Seu nome"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editMode}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Peso (kg)</label>
                <input
                  type="number"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  disabled={!editMode}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50"
                  placeholder="70"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Altura (cm)</label>
                <input
                  type="number"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  disabled={!editMode}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50"
                  placeholder="175"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Objetivo</label>
                <select
                  value={formData.objetivo}
                  onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                  disabled={!editMode}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50"
                >
                  <option value="">Selecione um objetivo</option>
                  <option value="perda-peso">Perda de Peso</option>
                  <option value="ganho-massa">Ganho de Massa Muscular</option>
                  <option value="definicao">Definição Muscular</option>
                  <option value="forca">Aumento de Força</option>
                  <option value="resistencia">Resistência</option>
                  <option value="saude">Saúde Geral</option>
                </select>
              </div>
            </div>

            {/* IMC */}
            {formData.peso && formData.altura && (
              <div className="glass-card">
                <div className="card-item">
                  <div className="card-badge" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                    IMC
                  </div>
                  <div className="card-info">
                    <div className="title" style={{ fontSize: '2rem', color: '#3b82f6' }}>
                      {calcularIMC()}
                    </div>
                    <div className="subtitle">
                      {(() => {
                        const imc = parseFloat(calcularIMC() || '0');
                        if (imc < 18.5) return 'Abaixo do peso';
                        if (imc < 25) return 'Peso normal';
                        if (imc < 30) return 'Sobrepeso';
                        return 'Obesidade';
                      })()} 
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'configuracoes' && (
          <div className="space-y-6">
            <h2 className="section-title">Configurações</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Tema</h3>
                  <p className="text-sm text-gray-600">Alternar entre tema claro e escuro</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === 'light' ? 'Escuro' : 'Claro'}
                </button>
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Notificações</h3>
                  <p className="text-sm text-gray-600">Receber notificações do timer</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Backup Automático</h3>
                  <p className="text-sm text-gray-600">Salvar dados automaticamente</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <PushNotifications />
            </div>
            
            <div className="mt-6">
              <BackupExport />
            </div>
            
            <div className="mt-6">
              <TestRunner />
            </div>
          </div>
        )}

        {activeTab === 'conquistas' && (
          <div className="space-y-6">
            <h2 className="section-title">Conquistas</h2>
            
            {conquistasDesbloqueadas.length > 0 && (
              <div>
                <h3 className="font-medium mb-4 text-green-600">Desbloqueadas ({conquistasDesbloqueadas.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conquistasDesbloqueadas.map(conquista => (
                    <motion.div
                      key={conquista.id}
                      className="p-4 border border-green-200 bg-green-50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{conquista.icone}</span>
                        <div>
                          <h4 className="font-medium">{conquista.titulo}</h4>
                          <p className="text-sm text-gray-600">{conquista.descricao}</p>
                          {conquista.data_conquista && (
                            <p className="text-xs text-green-600 mt-1">
                              Desbloqueada em {new Date(conquista.data_conquista).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {conquistasPendentes.length > 0 && (
              <div>
                <h3 className="font-medium mb-4 text-gray-600">Pendentes ({conquistasPendentes.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conquistasPendentes.map(conquista => (
                    <div key={conquista.id} className="p-4 border rounded-lg opacity-60">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl grayscale">{conquista.icone}</span>
                        <div>
                          <h4 className="font-medium">{conquista.titulo}</h4>
                          <p className="text-sm text-gray-600">{conquista.descricao}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calculadoras' && (
          <div className="space-y-6">
            <h2 className="section-title">Calculadoras</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calculadora 1RM */}
              <div className="p-6 border rounded-lg">
                <h3 className="font-medium mb-4">Calculadora de 1RM</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Peso usado (kg)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      placeholder="80"
                      id="peso-1rm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Repetições</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      placeholder="8"
                      id="reps-1rm"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const peso = parseFloat((document.getElementById('peso-1rm') as HTMLInputElement).value);
                      const reps = parseInt((document.getElementById('reps-1rm') as HTMLInputElement).value);
                      if (peso && reps) {
                        const resultado = calcular1RM(peso, reps);
                        toast.success(`Seu 1RM estimado: ${resultado}kg`);
                      }
                    }}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Calcular 1RM
                  </button>
                </div>
              </div>
              
              {/* Calculadora de Volume */}
              <div className="p-6 border rounded-lg">
                <h3 className="font-medium mb-4">Volume de Treino</h3>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.volume_total.toLocaleString()}kg
                    </div>
                    <p className="text-sm text-gray-600">Volume total levantado</p>
                  </div>
                </div>
              </div>
              
              {/* Estatísticas Gerais */}
              <div className="p-6 border rounded-lg md:col-span-2">
                <h3 className="font-medium mb-4">Suas Estatísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">{stats.total_treinos}</div>
                    <p className="text-sm text-gray-600">Treinos</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">{stats.streak_atual}</div>
                    <p className="text-sm text-gray-600">Dias seguidos</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">{stats.melhor_streak}</div>
                    <p className="text-sm text-gray-600">Melhor sequência</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded">
                    <div className="text-2xl font-bold text-orange-600">{Math.round(stats.tempo_total / 60)}h</div>
                    <p className="text-sm text-gray-600">Tempo total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default Profile;