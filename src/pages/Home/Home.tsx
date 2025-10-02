import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, TrendingUp, Award, Calendar, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTreinos, useDeleteTreino } from '../../hooks/useTreinos';
import { useAppStore } from '../../store/useAppStore';
import { useDivisoesStore } from '../../store/useDivisoesStore';
import { useStats } from '../../hooks/useStats';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { Icon } from '../../components/Icon/Icon';
import { Treino } from '../../types';
import styles from './Home.module.scss';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const { data: treinos, isLoading, error } = useTreinos();
  const { mutate: deleteTreino } = useDeleteTreino();
  const { data: statsData } = useStats();
  const { achievements } = useAppStore();
  const { divisoes, removerDivisao } = useDivisoesStore();
  
  // Usar stats da API ou fallback para dados locais
  const stats = statsData || {
    streak_atual: 0,
    total_treinos: 0,
    conquistas: []
  };

  const handleDeleteTreino = (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este treino?')) {
      deleteTreino(id);
    }
  };

  const handleDeleteDivisao = (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja deletar a divisão "${nome}"?`)) {
      removerDivisao(id);
      toast.success('Divisão removida com sucesso!');
    }
  };

  if (isLoading) return <LoadingSpinner size="large" text="Carregando treinos..." />;
  if (error) return <div className={styles.error}>Erro ao carregar treinos</div>;

  // Agrupar treinos por divisão
  const treinosPorDivisao = treinos?.reduce((acc: { [key: string]: Treino[] }, treino) => {
    if (!acc[treino.divisao]) acc[treino.divisao] = [];
    acc[treino.divisao].push(treino);
    return acc;
  }, {}) || {};

  const recentAchievements = (stats.conquistas || []).filter(a => a.conquistado).slice(0, 3);

  return (
    <div className="page-container">
      <motion.div
        className="glass-card fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="page-header">
          <h1>Gym Buddy</h1>
          <p>Seu companheiro de treino</p>
        </header>

        <div className="grid cols-3 mb-6">
          <div className="stat-card">
            <Icon Icon={Calendar} size={24} color="white" />
            <div>
              <h3>{stats.streak_atual}</h3>
              <p>dias seguidos</p>
            </div>
          </div>
          <div className="stat-card success">
            <Icon Icon={TrendingUp} size={24} color="white" />
            <div>
              <h3>{stats.total_treinos}</h3>
              <p>treinos</p>
            </div>
          </div>
          <div className="stat-card warning">
            <Icon Icon={Award} size={24} color="white" />
            <div>
              <h3>{stats.conquistas?.filter(a => a.conquistado).length || 0}</h3>
              <p>conquistas</p>
            </div>
          </div>
        </div>

        {recentAchievements.length > 0 && (
          <div className="mb-6">
            <h2 className="section-title">Conquistas Recentes</h2>
            <div className="grid cols-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="glass-card">
                  <div className="card-item">
                    <span style={{ fontSize: '2rem' }}>{achievement.icone}</span>
                    <div className="card-info">
                      <h3 className="title">{achievement.titulo}</h3>
                      <p className="subtitle">{achievement.descricao}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {divisoes.length > 0 && (
          <div className="mb-6">
            <h2 className="section-title">Suas Divisões</h2>
            <div className="grid cols-1 md:cols-2 lg:cols-3">
              {divisoes.map((divisao) => (
                <motion.div
                  key={divisao.id}
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="card-header">
                    <h3>{divisao.nome}</h3>
                    <button
                      onClick={() => handleDeleteDivisao(divisao.id, divisao.nome)}
                      className="text-red-500 hover:text-red-700"
                      style={{ background: 'transparent', border: 'none', padding: '4px' }}
                    >
                      <Icon Icon={Trash2} size={16} color="danger" />
                    </button>
                  </div>
                  <div className="card-content">
                    {divisao.treinos.map((treino) => (
                      <div key={treino.identificador} className="card-item">
                        <div className="card-badge">
                          {treino.identificador}
                        </div>
                        <div className="card-info">
                          <div className="title">{treino.titulo}</div>
                          {treino.foco && <div className="subtitle">{treino.foco}</div>}
                        </div>
                        <button
                          onClick={() => navigate(`/criar-treino?divisao=${divisao.id}&treino=${treino.identificador}`)}
                          className="btn-small primary"
                        >
                          Criar
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="card-footer">
                    <span className="meta">
                      {divisao.treinos.length} treinos
                    </span>
                    <button
                      onClick={() => navigate(`/nova-divisao?editar=${divisao.id}`)}
                      className="btn-small secondary"
                    >
                      Editar Divisão
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="section-header">
            <h2 className="title">Seus Treinos</h2>
            <Link to="/stats" className="btn-small secondary btn-link">
              Ver Estatísticas
            </Link>
          </div>

          {Object.keys(treinosPorDivisao).length > 0 ? (
            <div className="grid cols-1 md:cols-2 lg:cols-3">
              {Object.entries(treinosPorDivisao).map(([divisao, treinosDivisao]) => (
                <motion.div
                  key={divisao}
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="card-header">
                    <h3>Divisão {divisao}</h3>
                  </div>
                  <div className="card-content">
                    {treinosDivisao.map((treino) => (
                      <div key={treino.id} className="card-item">
                        <div className="card-info">
                          <div className="title">Treino {treino.identificador}</div>
                          <div className="subtitle">{treino.titulo}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link
                            to={`/treino/${encodeURIComponent(`${treino.divisao}|${treino.identificador}`)}`}
                            className="btn-small primary btn-link"
                          >
                            Ver
                          </Link>
                          <button
                            onClick={() => navigate(`/editar-treino/${treino.id}`)}
                            className="btn-small secondary"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTreino(treino.id)}
                            className="btn-small danger"
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
              <p>Nenhum treino encontrado. Que tal criar o primeiro?</p>
            </div>
          )}
        </div>
        <div className="grid cols-2 gap-4">
          <button
            onClick={() => navigate('/criar-treino')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            Criar Treino
          </button>
          <button
            onClick={() => navigate('/nova-divisao')}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Calendar size={20} />
            Nova Divisão
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;