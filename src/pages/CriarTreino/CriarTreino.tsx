import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useCreateTreino } from '../../hooks/useTreinos';
import { useDivisoesStore } from '../../store/useDivisoesStore';
import toast from 'react-hot-toast';

const treinoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  divisao: z.string().min(1, 'Divisão é obrigatória'),
  identificador: z.string().min(1, 'Identificador é obrigatório')
});

type TreinoForm = z.infer<typeof treinoSchema>;

interface Exercicio {
  nome: string;
  series: number;
  repeticoes: string;
  peso?: number;
  descanso?: number;
  observacoes?: string;
}

const CriarTreino = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate: createTreino, isPending } = useCreateTreino();
  const { obterDivisao } = useDivisoesStore();
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TreinoForm>({
    resolver: zodResolver(treinoSchema)
  });

  useEffect(() => {
    const divisaoId = searchParams.get('divisao');
    const treinoId = searchParams.get('treino');
    
    if (divisaoId && treinoId) {
      const divisao = obterDivisao(divisaoId);
      if (divisao) {
        const treino = divisao.treinos.find(t => t.identificador === treinoId);
        if (treino) {
          setValue('titulo', treino.titulo);
          setValue('divisao', divisao.nome);
          setValue('identificador', treino.identificador);
        }
      }
    }
  }, [searchParams, obterDivisao, setValue]);

  const adicionarExercicio = () => {
    setExercicios([...exercicios, {
      nome: '',
      series: 3,
      repeticoes: '8-12',
      peso: 0,
      descanso: 90
    }]);
  };

  const removerExercicio = (index: number) => {
    setExercicios(exercicios.filter((_, i) => i !== index));
  };

  const atualizarExercicio = (index: number, campo: keyof Exercicio, valor: any) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index] = { ...novosExercicios[index], [campo]: valor };
    setExercicios(novosExercicios);
  };

  const onSubmit = (data: TreinoForm) => {
    if (exercicios.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }

    const exerciciosComOrdem = exercicios.map((ex, index) => ({
      id: Date.now() + index,
      ...ex,
      ordem: index + 1,
      treino_id: 0
    }));

    createTreino({
      ...data,
      exercicios: exerciciosComOrdem
    }, {
      onSuccess: () => {
        navigate('/');
      }
    });
  };

  return (
    <div className="page-container">
      <div className="glass-card fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="page-header">
          <h1>Criar Novo Treino</h1>
          <p>Configure seu treino personalizado ou escolha um template</p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-grid cols-3">
          <div className="input-group">
            <label className="input-label">Título do Treino</label>
            <input
              {...register('titulo')}
              className="input-field"
              placeholder="Ex: Peito e Tríceps"
            />
            {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>}
          </div>
          
          <div className="input-group">
            <label className="input-label">Divisão</label>
            <input
              {...register('divisao')}
              className="input-field"
              placeholder="Ex: A"
            />
            {errors.divisao && <p className="text-red-500 text-sm mt-1">{errors.divisao.message}</p>}
          </div>
          
          <div className="input-group">
            <label className="input-label">Identificador</label>
            <input
              {...register('identificador')}
              className="input-field"
              placeholder="Ex: A"
            />
            {errors.identificador && <p className="text-red-500 text-sm mt-1">{errors.identificador.message}</p>}
          </div>
        </div>

        <div>
          <div className="section-header">
            <h2 className="title">Exercícios</h2>
            <button
              type="button"
              onClick={adicionarExercicio}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} />
              Adicionar Exercício
            </button>
          </div>

          {exercicios.map((exercicio, index) => (
            <div key={index} className="glass-card mb-4">
              <div className="card-header">
                <h3>Exercício {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removerExercicio(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="form-grid cols-5">
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Nome do Exercício</label>
                  <input
                    value={exercicio.nome}
                    onChange={(e) => atualizarExercicio(index, 'nome', e.target.value)}
                    className="input-field"
                    placeholder="Ex: Supino Reto"
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Séries</label>
                  <input
                    type="number"
                    value={exercicio.series}
                    onChange={(e) => atualizarExercicio(index, 'series', parseInt(e.target.value))}
                    className="input-field"
                    min="1"
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Repetições</label>
                  <input
                    value={exercicio.repeticoes}
                    onChange={(e) => atualizarExercicio(index, 'repeticoes', e.target.value)}
                    className="input-field"
                    placeholder="8-12"
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Peso (kg)</label>
                  <input
                    type="number"
                    value={exercicio.peso || ''}
                    onChange={(e) => atualizarExercicio(index, 'peso', parseFloat(e.target.value))}
                    className="input-field"
                    step="0.5"
                  />
                </div>
              </div>
              
              <div className="form-grid cols-2 mt-4">
                <div className="input-group">
                  <label className="input-label">Descanso (segundos)</label>
                  <input
                    type="number"
                    value={exercicio.descanso || ''}
                    onChange={(e) => atualizarExercicio(index, 'descanso', parseInt(e.target.value))}
                    className="input-field"
                    step="15"
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Observações</label>
                  <input
                    value={exercicio.observacoes || ''}
                    onChange={(e) => atualizarExercicio(index, 'observacoes', e.target.value)}
                    className="input-field"
                    placeholder="Observações opcionais"
                  />
                </div>
              </div>
            </div>
          ))}

          {exercicios.length === 0 && (
            <div className="glass-card">
              <div className="card-item" style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="card-info">
                  <div className="title">Nenhum exercício adicionado ainda</div>
                  <div className="subtitle">Clique em "Adicionar Exercício" para começar</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary"
          >
            {isPending ? 'Criando...' : 'Criar Treino'}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default CriarTreino;