import { motion } from 'framer-motion';
import { StatsCards, VolumeChart, FrequencyChart, DivisaoChart } from '../../components/Charts/AdvancedCharts';
import { useAppStore } from '../../store/useAppStore';

const StatsAdvanced = () => {
  const { achievements } = useAppStore();
  const conquistas = achievements.filter(a => a.conquistado);

  return (
    <div className="page-container">
      <motion.div
        className="glass-card fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="page-header">
          <h1>Estatísticas Avançadas</h1>
          <p>Análise completa do seu progresso</p>
        </header>

        <StatsCards />

        <div className="grid cols-1 lg:cols-2 gap-6 mb-6">
          <VolumeChart />
          <FrequencyChart />
        </div>

        <div className="mb-6">
          <DivisaoChart />
        </div>

        {conquistas.length > 0 && (
          <div>
            <h2 className="section-title">Conquistas Desbloqueadas</h2>
            <div className="grid cols-1 md:cols-2 lg:cols-3">
              {conquistas.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="glass-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="card-item">
                    <span style={{ fontSize: '2rem' }}>{achievement.icone}</span>
                    <div className="card-info">
                      <h3 className="title">{achievement.titulo}</h3>
                      <p className="subtitle">{achievement.descricao}</p>
                      {achievement.data_conquista && (
                        <p className="text-xs text-gray-500 mt-1">
                          Conquistado em {new Date(achievement.data_conquista).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StatsAdvanced;