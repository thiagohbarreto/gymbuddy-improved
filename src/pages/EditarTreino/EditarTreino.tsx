import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useTreino, useUpdateTreino } from '../../hooks/useTreinos';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const treinoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  divisao: z.string().min(1, 'Divisão é obrigatória'),
  identificador: z.string().min(1, 'Identificador é obrigatório')
});

type TreinoForm = z.infer<typeof treinoSchema>;

interface ExercicioForm {
  id?: number;
  nome: string;
  series: number;
  repeticoes: string;
  peso?: number;
  descanso?: number;
  observacoes?: string;
  ordem: number;
}

const EditarTreino = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const treinoId = parseInt(id || '0');
  
  const { data: treino, isLoading } = useTreino(treinoId);
  const { mutate: updateTreino, isPending } = useUpdateTreino();
  
  const [exercicios, setExercicios] = useState<ExercicioForm[]>([]);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TreinoForm>({
    resolver: zodResolver(treinoSchema)
  });

  useEffect(() => {
    if (treino) {
      setValue('titulo', treino.titulo);
      setValue('divisao', treino.divisao);
      setValue('identificador', treino.identificador);
      
      if (treino.exercicios) {
        setExercicios(treino.exercicios.map(ex => ({
          id: ex.id,
          nome: ex.nome,
          series: ex.series,
          repeticoes: ex.repeticoes,
          peso: ex.peso,
          descanso: ex.descanso,
          observacoes: ex.observacoes,
          ordem: ex.ordem
        })));
      }
    }
  }, [treino, setValue]);

  const adicionarExercicio = () => {
    const novoExercicio: ExercicioForm = {
      nome: '',
      series: 3,
      repeticoes: '8-12',
      peso: 0,
      descanso: 90,
      ordem: exercicios.length + 1
    };
    setExercicios([...exercicios, novoExercicio]);
  };

  const removerExercicio = (index: number) => {
    const novosExercicios = exercicios.filter((_, i) => i !== index);
    // Reordenar
    const exerciciosReordenados = novosExercicios.map((ex, i) => ({ ...ex, ordem: i + 1 }));
    setExercicios(exerciciosReordenados);
  };

  const atualizarExercicio = (index: number, campo: keyof ExercicioForm, valor: any) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index] = { ...novosExercicios[index], [campo]: valor };
    setExercicios(novosExercicios);
  };

  const moverExercicio = (index: number, direcao: 'up' | 'down') => {
    if ((direcao === 'up' && index === 0) || (direcao === 'down' && index === exercicios.length - 1)) {
      return;
    }

    const novosExercicios = [...exercicios];
    const novoIndex = direcao === 'up' ? index - 1 : index + 1;
    
    [novosExercicios[index], novosExercicios[novoIndex]] = 
    [novosExercicios[novoIndex], novosExercicios[index]];
    
    // Atualizar ordem
    novosExercicios.forEach((ex, i) => {
      ex.ordem = i + 1;
    });
    
    setExercicios(novosExercicios);
  };

  const onSubmit = (data: TreinoForm) => {
    if (exercicios.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }

    const exerciciosValidados = exercicios.filter(ex => ex.nome.trim());
    if (exerciciosValidados.length === 0) {
      toast.error('Preencha o nome de pelo menos um exercício');
      return;
    }

    updateTreino({
      id: treinoId,
      ...data,
      exercicios: exerciciosValidados
    }, {
      onSuccess: () => {
        navigate('/');
      }
    });
  };

  if (isLoading) return <LoadingSpinner size="large" text="Carregando treino..." />;
  if (!treino) return <div className="text-center p-8">Treino não encontrado</div>;

  return (
    <div className="page-container">
      <div className="glass-card fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="page-header">
          <h1>Editar Treino</h1>
          <p>Modifique os detalhes do seu treino</p>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Exercícios</h2>
            <button
              type="button"
              onClick={adicionarExercicio}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus size={16} />
              Adicionar Exercício
            </button>
          </div>

          {exercicios.map((exercicio, index) => (
            <div key={index} className="glass-card p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Exercício {index + 1}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moverExercicio(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moverExercicio(index, 'down')}
                      disabled={index === exercicios.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>
                </div>
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
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              <p>Nenhum exercício adicionado ainda.</p>
              <p>Clique em "Adicionar Exercício" para começar.</p>
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
            className="btn-primary flex items-center gap-2"
          >
            <Save size={16} />
            {isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EditarTreino;