import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Filter } from 'lucide-react';
import { useHistorico } from '../../hooks/useHistorico';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Historico = () => {
  const [filtroTreino, setFiltroTreino] = useState<number | undefined>();
  const { data: historico, isLoading } = useHistorico(50, 0, filtroTreino);

  if (isLoading) return <LoadingSpinner size="large" text="Carregando histórico..." />;

  return (
    <div className="page-container">
      <motion.div
        className="glass-card fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="page-header">
          <h1>Histórico de Treinos</h1>
          <p>Acompanhe sua evolução</p>
        </header>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <select
              value={filtroTreino || ''}
              onChange={(e) => setFiltroTreino(e.target.value ? Number(e.target.value) : undefined)}
              className="input-field"
            >
              <option value="">Todos os treinos</option>
            </select>
          </div>
        </div>

        <div className="grid cols-1 gap-4">
          {historico?.map((item) => (
            <motion.div
              key={item.id}
              className="glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ y: -2 }}
            >
              <div className="card-header">
                <div>
                  <h3>{item.Treino?.titulo || `Treino ${item.Treino?.identificador}`}</h3>
                  <p className="text-sm text-gray-600">Divisão {item.Treino?.divisao}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar size={16} />
                    {format(new Date(item.data_execucao), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                  {item.tempo_total && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock size={16} />
                      {Math.floor(item.tempo_total / 60)}min
                    </div>
                  )}
                </div>
              </div>
              
              {(item.volume_total || item.observacoes) && (
                <div className="card-content">
                  {item.volume_total && (
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-500" />
                      <span>Volume: {item.volume_total}kg</span>
                    </div>
                  )}
                  {item.observacoes && (
                    <p className="text-sm text-gray-600 mt-2">{item.observacoes}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {!historico?.length && (
          <div className="text-center py-8 text-gray-600">
            <p>Nenhum treino registrado ainda.</p>
            <p>Complete um treino para ver seu histórico aqui!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Historico;