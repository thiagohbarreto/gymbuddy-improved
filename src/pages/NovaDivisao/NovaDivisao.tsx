import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDivisoesStore, TreinoDivisao } from '../../store/useDivisoesStore';

const NovaDivisao = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [nomeDivisao, setNomeDivisao] = useState('');
  const [treinos, setTreinos] = useState<TreinoDivisao[]>([]);
  const [tipoTreino, setTipoTreino] = useState<'personalizado' | 'template'>('template');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const templatesPopulares = [
    {
      nome: 'AB - Upper/Lower',
      divisoes: [
        { identificador: 'A', titulo: 'Upper (Membros Superiores)', foco: 'Peito, Costas, Ombros, Braços' },
        { identificador: 'B', titulo: 'Lower (Membros Inferiores)', foco: 'Pernas, Glúteos, Panturrilha' }
      ]
    },
    {
      nome: 'ABC - Push/Pull/Legs',
      divisoes: [
        { identificador: 'A', titulo: 'Push (Peito, Ombro, Tríceps)', foco: 'Empurrar' },
        { identificador: 'B', titulo: 'Pull (Costas, Bíceps)', foco: 'Puxar' },
        { identificador: 'C', titulo: 'Legs (Pernas, Glúteos)', foco: 'Membros Inferiores' }
      ]
    },
    {
      nome: 'ABCD - Upper/Lower 2x',
      divisoes: [
        { identificador: 'A', titulo: 'Upper A (Peito, Ombro)', foco: 'Membros Superiores' },
        { identificador: 'B', titulo: 'Lower A (Quadríceps, Panturrilha)', foco: 'Membros Inferiores' },
        { identificador: 'C', titulo: 'Upper B (Costas, Braços)', foco: 'Membros Superiores' },
        { identificador: 'D', titulo: 'Lower B (Posterior, Glúteos)', foco: 'Membros Inferiores' }
      ]
    },
    {
      nome: 'ABCDE - Especialização',
      divisoes: [
        { identificador: 'A', titulo: 'Peito e Tríceps', foco: 'Peito' },
        { identificador: 'B', titulo: 'Costas e Bíceps', foco: 'Costas' },
        { identificador: 'C', titulo: 'Pernas Completo', foco: 'Pernas' },
        { identificador: 'D', titulo: 'Ombros e Trapezio', foco: 'Ombros' },
        { identificador: 'E', titulo: 'Braços Completo', foco: 'Braços' }
      ]
    },
    {
      nome: 'ABCDEF - Avançado',
      divisoes: [
        { identificador: 'A', titulo: 'Peito e Tríceps', foco: 'Peito' },
        { identificador: 'B', titulo: 'Costas e Bíceps', foco: 'Costas' },
        { identificador: 'C', titulo: 'Quadríceps e Panturrilha', foco: 'Anterior Pernas' },
        { identificador: 'D', titulo: 'Ombros e Trapezio', foco: 'Ombros' },
        { identificador: 'E', titulo: 'Posterior e Glúteos', foco: 'Posterior Pernas' },
        { identificador: 'F', titulo: 'Braços Completo', foco: 'Braços' }
      ]
    }
  ];

  const adicionarTreino = () => {
    const proximaLetra = String.fromCharCode(65 + treinos.length); // A, B, C...
    setTreinos([...treinos, {
      identificador: proximaLetra,
      titulo: '',
      foco: ''
    }]);
  };

  const removerTreino = (index: number) => {
    const novosTreinos = treinos.filter((_, i) => i !== index);
    // Reajustar identificadores após remoção
    const treinosAtualizados = novosTreinos.map((treino, i) => ({
      ...treino,
      identificador: String.fromCharCode(65 + i) // A, B, C...
    }));
    setTreinos(treinosAtualizados);
  };

  const atualizarTreino = (index: number, campo: keyof TreinoDivisao, valor: string) => {
    const novosTreinos = [...treinos];
    novosTreinos[index] = { ...novosTreinos[index], [campo]: valor };
    setTreinos(novosTreinos);
  };

  const aplicarTemplate = (template: typeof templatesPopulares[0]) => {
    setTreinos(template.divisoes);
    setNomeDivisao(template.nome);
    setTipoTreino('template');
    toast.success(`Template "${template.nome}" aplicado!`);
  };

  const { adicionarDivisao, obterDivisao, atualizarDivisao } = useDivisoesStore();

  useEffect(() => {
    const editarId = searchParams.get('editar');
    if (editarId) {
      const divisao = obterDivisao(editarId);
      if (divisao) {
        setEditandoId(editarId);
        setNomeDivisao(divisao.nome);
        setTreinos(divisao.treinos);
        setTipoTreino('personalizado');
      }
    }
  }, [searchParams, obterDivisao]);

  const criarDivisao = () => {
    if (!nomeDivisao.trim()) {
      toast.error('Digite um nome para a divisão');
      return;
    }

    if (treinos.length === 0) {
      toast.error('Adicione pelo menos um treino');
      return;
    }

    const treinosIncompletos = treinos.filter(t => !t.titulo.trim());
    if (treinosIncompletos.length > 0) {
      toast.error('Preencha o título de todos os treinos');
      return;
    }

    if (editandoId) {
      atualizarDivisao(editandoId, {
        nome: nomeDivisao,
        treinos: treinos
      });
      toast.success(`Divisão "${nomeDivisao}" atualizada com sucesso!`);
    } else {
      adicionarDivisao({
        nome: nomeDivisao,
        treinos: treinos
      });
      toast.success(`Divisão "${nomeDivisao}" criada com sucesso!`);
    }
    
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="glass-card fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="page-header">
          <h1>{editandoId ? 'Editar Divisão' : 'Nova Divisão de Treino'}</h1>
          <p>{editandoId ? 'Modifique sua divisão existente' : 'Escolha um template ou crie sua própria divisão'}</p>
        </div>

        <div className="grid cols-1 lg:cols-2 gap-8">
        {/* Templates */}
        <div>
          <h2 className="section-title">Templates Populares</h2>
          <div className="grid cols-1 md:cols-2 gap-4">
            {templatesPopulares.map((template, index) => (
              <motion.div
                key={index}
                className="glass-card cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => aplicarTemplate(template)}
              >
                <div className="card-header">
                  <h3 style={{ color: '#3b82f6' }}>{template.nome}</h3>
                </div>
                <div className="card-content">
                  {template.divisoes.map((divisao, i) => (
                    <div key={i} className="card-item">
                      <div className="card-badge">
                        {divisao.identificador}
                      </div>
                      <div className="card-info">
                        <div className="title">{divisao.titulo}</div>
                        <div className="subtitle">{divisao.foco}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-footer">
                  <span className="meta">
                    {template.divisoes.length} treinos por semana
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Criar Personalizado */}
        <div>
          <div className="section-header">
            <h2 className="title">Criar Personalizado</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTipoTreino('template')}
                className={`px-3 py-1 rounded text-sm ${
                  tipoTreino === 'template' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Template
              </button>
              <button
                onClick={() => setTipoTreino('personalizado')}
                className={`px-3 py-1 rounded text-sm ${
                  tipoTreino === 'personalizado' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Personalizado
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="input-group">
              <label className="input-label">Nome da Divisão</label>
              <input
                value={nomeDivisao}
                onChange={(e) => setNomeDivisao(e.target.value)}
                className="input-field"
                placeholder="Ex: Push/Pull/Legs, ABC, Upper/Lower"
              />
            </div>

            <div>
              <div className="section-header">
                <label className="title">Treinos da Divisão</label>
                <button
                  onClick={adicionarTreino}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={16} />
                  Adicionar Treino
                </button>
              </div>

              {treinos.map((treino, index) => (
                <motion.div
                  key={index}
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="card-header">
                    <h3>Treino {treino.identificador}</h3>
                    <button
                      onClick={() => removerTreino(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="input-group">
                      <label className="input-label">Título do Treino</label>
                      <input
                        value={treino.titulo}
                        onChange={(e) => atualizarTreino(index, 'titulo', e.target.value)}
                        className="input-field"
                        placeholder="Ex: Peito e Tríceps"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Foco Principal</label>
                      <input
                        value={treino.foco}
                        onChange={(e) => atualizarTreino(index, 'foco', e.target.value)}
                        className="input-field"
                        placeholder="Ex: Peito, Costas, Pernas"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {treinos.length === 0 && (
                <div className="glass-card">
                  <div className="card-item" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="card-info">
                      <div className="title">Nenhum treino adicionado ainda</div>
                      <div className="subtitle">Clique em "Adicionar Treino" ou escolha um template</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {treinos.length > 0 && (
              <div className="pt-4">
                <button
                  onClick={criarDivisao}
                  className="btn-primary w-full py-3"
                >
                  {editandoId ? 'Atualizar Divisão' : 'Criar Divisão'}
                </button>
              </div>
            )}
          </div>
        </div>

        {treinos.length > 0 && (
          <motion.div
            className="mt-8 glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="card-header">
              <h3>Preview da Divisão</h3>
            </div>
            <div className="grid cols-1 md:cols-2 lg:cols-3">
              {treinos.map((treino, index) => (
                <div key={index} className="card-item">
                  <div className="card-badge">
                    {treino.identificador}
                  </div>
                  <div className="card-info">
                    <div className="title">{treino.titulo || 'Sem título'}</div>
                    {treino.foco && <div className="subtitle">{treino.foco}</div>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
};

export default NovaDivisao;