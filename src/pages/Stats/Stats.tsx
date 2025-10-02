import { motion } from 'framer-motion';
import { Calendar, Award, Target, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStats } from '../../hooks/useStats';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';

import styles from './Stats.module.scss';

const Stats = () => {
  const navigate = useNavigate();
  const { data: statsData, isLoading, error } = useStats();

  if (isLoading) return <LoadingSpinner size="large" text="Carregando estatísticas..." />;
  if (error) {
    console.error('Erro ao carregar stats:', error);
    return <div className="text-center p-8">Erro ao carregar estatísticas: {error.message}</div>;
  }
  if (!statsData) return <div className="text-center p-8">Nenhuma estatística encontrada</div>;

  const statCards = [
    {
      title: 'Total de Treinos',
      value: statsData.total_treinos,
      icon: <Target size={24} />,
      color: 'primary'
    },
    {
      title: 'Streak Atual',
      value: `${statsData.streak_atual} dias`,
      icon: <Calendar size={24} />,
      color: 'success'
    },
    {
      title: 'Melhor Streak',
      value: `${statsData.melhor_streak} dias`,
      icon: <Zap size={24} />,
      color: 'warning'
    },
    {
      title: 'Conquistas',
      value: statsData.conquistas?.filter(a => a.conquistado).length || 0,
      icon: <Award size={24} />,
      color: 'primary'
    }
  ];



  return (
    <div className="page-container">
      <motion.div
        className="glass-card fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
        </div>
        <header className="page-header">
          <h1>Estatísticas</h1>
          <p>Acompanhe seu progresso e conquistas</p>
        </header>

        <section className="grid cols-2 md:cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statContent}>
              <h3>{stat.title}</h3>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>



      <section className="mb-6">
        <h2 className="section-title">Conquistas</h2>
        <div className="grid cols-1 md:cols-2 lg:cols-3">
          {(statsData.conquistas || []).map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`glass-card ${!achievement.conquistado ? 'opacity-50' : ''}`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="card-item">
                <span style={{ fontSize: '2rem' }}>{achievement.icone}</span>
                <div className="card-info">
                  <div className="title">{achievement.titulo}</div>
                  <div className="subtitle">{achievement.descricao}</div>
                  {achievement.conquistado && achievement.data_conquista && (
                    <div className="subtitle" style={{ color: '#10b981', fontWeight: '500' }}>
                      Conquistado em {new Date(achievement.data_conquista).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {!achievement.conquistado && (
                    <div className="subtitle" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      Ainda não conquistado
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {statsData.exercicios_favoritos && statsData.exercicios_favoritos.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title">Exercícios Favoritos</h2>
          <div className="glass-card">
            <div className="card-content">
              {statsData.exercicios_favoritos.map((exercicio, index) => (
                <div key={index} className="card-item">
                  <div className="card-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    #{index + 1}
                  </div>
                  <div className="card-info">
                    <div className="title">{exercicio}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      </motion.div>
    </div>
  );
};

export default Stats;