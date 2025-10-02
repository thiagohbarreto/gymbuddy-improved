import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Check, Timer, Weight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTreinos } from '../../hooks/useTreinos';
import { useAppStore } from '../../store/useAppStore';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface ExercicioExecutado {
  exercicio_id: number;
  series_completadas: number;
  pesos_usados: number[];
  repeticoes_executadas: number[];
  concluido: boolean;
}

const Treino = () => {
  const { treinoData } = useParams();
  const navigate = useNavigate();
  const { data: treinos, isLoading } = useTreinos();
  const { startTimer, stats, updateStats } = useAppStore();
  
  const [treinoIniciado, setTreinoIniciado] = useState(false);
  const [tempoInicio, setTempoInicio] = useState<Date | null>(null);
  const [exerciciosExecutados, setExerciciosExecutados] = useState<ExercicioExecutado[]>([]);
  const [exercicioAtual, setExercicioAtual] = useState(0);
  const [serieAtual, setSerieAtual] = useState(0);

  // Decode and parse treino data from URL
  let divisaoDecoded = '';
  let letraDecoded = '';
  
  if (treinoData) {
    try {
      const decoded = decodeURIComponent(treinoData);
      const [divisao, letra] = decoded.split('|');
      divisaoDecoded = divisao || '';
      letraDecoded = letra || '';
    } catch (error) {
      console.error('Error parsing treino data:', error);
    }
  }
  
  const treino = treinos?.find(t => t.divisao === divisaoDecoded && t.identificador === letraDecoded);

  useEffect(() => {
    if (treino) {
      const exerciciosIniciais = treino.exercicios?.map(ex => ({
        exercicio_id: ex.id,
        series_completadas: 0,
        pesos_usados: [],
        repeticoes_executadas: [],
        concluido: false
      })) || [];
      setExerciciosExecutados(exerciciosIniciais);
    }
  }, [treino]);

  const iniciarTreino = () => {
    setTreinoIniciado(true);
    setTempoInicio(new Date());
    toast.success('Treino iniciado! Boa sorte! 💪');
  };

  const finalizarTreino = () => {
    if (!tempoInicio) return;
    
    const tempoTotal = Math.floor((new Date().getTime() - tempoInicio.getTime()) / 1000 / 60);
    const exerciciosConcluidos = exerciciosExecutados.filter(ex => ex.concluido).length;
    
    updateStats({
      total_treinos: stats.total_treinos + 1,
      tempo_total: stats.tempo_total + tempoTotal
    });
    
    toast.success(`Treino finalizado! ${exerciciosConcluidos} exercícios concluídos em ${tempoTotal} minutos`);
    navigate('/');
  };

  const completarSerie = (exercicioIndex: number, peso: number, repeticoes: number) => {
    const novosExercicios = [...exerciciosExecutados];
    const exercicio = novosExercicios[exercicioIndex];
    
    exercicio.pesos_usados.push(peso);
    exercicio.repeticoes_executadas.push(repeticoes);
    exercicio.series_completadas++;
    
    const totalSeries = treino?.exercicios?.[exercicioIndex]?.series || 0;
    if (exercicio.series_completadas >= totalSeries) {
      exercicio.concluido = true;
    }
    
    setExerciciosExecutados(novosExercicios);
    
    // Iniciar timer de descanso
    const descanso = treino?.exercicios?.[exercicioIndex]?.descanso || 90;
    startTimer(descanso);
    
    toast.success('Série concluída!');
  };

  if (isLoading) return <LoadingSpinner size="large" text="Carregando treino..." />;
  if (!treino) {
    return (
      <div className="page-container">
        <div className="glass-card fade-in">
          <div className="text-center p-8">
            <h2>Treino não encontrado</h2>
            <div className="mt-4 text-left">
              <p><strong>Divisão buscada:</strong> "{divisaoDecoded}"</p>
              <p><strong>Identificador buscado:</strong> "{letraDecoded}"</p>
              <p><strong>Treinos disponíveis:</strong></p>
              <ul className="mt-2">
                {treinos?.map(t => (
                  <li key={t.id}>
                    Divisão: "{t.divisao}" | Identificador: "{t.identificador}" | Título: {t.titulo}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => navigate('/')} className="btn-primary mt-4">
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressoGeral = treino.exercicios ? 
    (exerciciosExecutados.filter(ex => ex.concluido).length / treino.exercicios.length) * 100 : 0;

  return (
    <div className="page-container">
      <div className="glass-card fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="page-header">
          <h1>{treino.titulo}</h1>
          <p>Divisão {divisaoDecoded} - Treino {letraDecoded}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progresso do Treino</span>
            <span className="text-sm text-gray-600">{Math.round(progressoGeral)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressoGeral}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {!treinoIniciado ? (
          <div className="text-center py-12">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-4">Pronto para treinar?</h2>
              <p className="text-gray-600 mb-8">
                {treino.exercicios?.length || 0} exercícios preparados para você
              </p>
              <button
                onClick={iniciarTreino}
                className="btn-primary flex items-center gap-2 mx-auto px-8 py-4"
              >
                <Play size={20} />
                Iniciar Treino
              </button>
            </div>
          </div>
      ) : (
        <div className="space-y-6">
          {treino.exercicios?.map((exercicio, index) => {
            const execucao = exerciciosExecutados[index];
            const seriesRestantes = exercicio.series - (execucao?.series_completadas || 0);
            
            return (
              <motion.div
                key={exercicio.id}
                className={`glass-card p-6 ${
                  execucao?.concluido ? 'bg-green-50 border-green-200' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{exercicio.nome}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>{exercicio.series} séries</span>
                      <span>{exercicio.repeticoes} repetições</span>
                      {exercicio.peso && (
                        <span className="flex items-center gap-1">
                          <Weight size={14} />
                          {exercicio.peso}kg
                        </span>
                      )}
                      {exercicio.descanso && (
                        <span className="flex items-center gap-1">
                          <Timer size={14} />
                          {exercicio.descanso}s
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {execucao?.concluido && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check size={20} />
                      <span className="font-medium">Concluído</span>
                    </div>
                  )}
                </div>

                {exercicio.observacoes && (
                  <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                    {exercicio.observacoes}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Séries: {execucao?.series_completadas || 0}/{exercicio.series}
                    </span>
                    <span className="text-sm text-gray-600">
                      {seriesRestantes > 0 ? `${seriesRestantes} restantes` : 'Todas concluídas'}
                    </span>
                  </div>

                  {!execucao?.concluido && (
                    <SerieForm
                      exercicio={exercicio}
                      onComplete={(peso, reps) => completarSerie(index, peso, reps)}
                    />
                  )}

                  {/* Histórico de séries */}
                  {execucao && execucao.pesos_usados.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Séries realizadas:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {execucao.pesos_usados.map((peso, serieIndex) => (
                          <div key={serieIndex} className="p-2 bg-gray-100 rounded text-sm text-center">
                            Série {serieIndex + 1}: {peso}kg x {execucao.repeticoes_executadas[serieIndex]}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          <div className="text-center pt-6">
            <button
              onClick={finalizarTreino}
              className="btn-danger px-8 py-4"
            >
              Finalizar Treino
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

interface SerieFormProps {
  exercicio: any;
  onComplete: (peso: number, repeticoes: number) => void;
}

const SerieForm = ({ exercicio, onComplete }: SerieFormProps) => {
  const [peso, setPeso] = useState(exercicio.peso || 0);
  const [repeticoes, setRepeticoes] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(peso, repeticoes);
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className="form-control">
        <label className="input-label">Peso (kg)</label>
        <input
          type="number"
          value={peso}
          onChange={(e) => setPeso(parseFloat(e.target.value))}
          className="input-field"
          step="0.5"
          required
        />
      </div>
      
      <div className="form-control">
        <label className="input-label">Reps</label>
        <input
          type="number"
          value={repeticoes}
          onChange={(e) => setRepeticoes(parseInt(e.target.value))}
          className="input-field"
          min="1"
          required
        />
      </div>
      
      <button
        type="submit"
        className="btn-primary"
      >
        Concluir Série
      </button>
    </form>
  );
};

export default Treino;