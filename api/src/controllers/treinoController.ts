import { Response } from 'express';
import { Treino, Exercicio } from '../models';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const treinoSchema = z.object({
  titulo: z.string().min(1),
  divisao: z.string().min(1),
  identificador: z.string().min(1),
  exercicios: z.array(z.object({
    nome: z.string().min(1),
    series: z.number().min(1),
    repeticoes: z.string().min(1),
    peso: z.number().optional(),
    descanso: z.number().optional(),
    observacoes: z.string().optional(),
    ordem: z.number().min(1)
  })).optional()
});

export const getTreinos = async (req: AuthRequest, res: Response) => {
  try {
    const treinos = await Treino.findAll({
      where: { user_id: req.user!.userId },
      include: [{ model: Exercicio, as: 'exercicios' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(treinos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar treinos' });
  }
};

export const getTreino = async (req: AuthRequest, res: Response) => {
  try {
    const treino = await Treino.findOne({
      where: { id: req.params.id, user_id: req.user!.userId },
      include: [{ model: Exercicio, as: 'exercicios' }]
    });
    
    if (!treino) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }
    
    res.json(treino);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar treino' });
  }
};

export const createTreino = async (req: AuthRequest, res: Response) => {
  try {
    const data = treinoSchema.parse(req.body);
    
    const treino = await Treino.create({
      ...data,
      user_id: req.user!.userId
    });

    if (data.exercicios) {
      await Exercicio.bulkCreate(
        data.exercicios.map(ex => ({ ...ex, treino_id: treino.id }))
      );
    }

    const treinoCompleto = await Treino.findByPk(treino.id, {
      include: [{ model: Exercicio, as: 'exercicios' }]
    });

    res.status(201).json(treinoCompleto);
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
  }
};

export const updateTreino = async (req: AuthRequest, res: Response) => {
  try {
    const data = treinoSchema.parse(req.body);
    
    const treino = await Treino.findOne({
      where: { id: req.params.id, user_id: req.user!.userId }
    });
    
    if (!treino) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    await treino.update(data);
    
    if (data.exercicios) {
      await Exercicio.destroy({ where: { treino_id: treino.id } });
      await Exercicio.bulkCreate(
        data.exercicios.map(ex => ({ ...ex, treino_id: treino.id }))
      );
    }

    const treinoAtualizado = await Treino.findByPk(treino.id, {
      include: [{ model: Exercicio, as: 'exercicios' }]
    });

    res.json(treinoAtualizado);
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
  }
};

export const deleteTreino = async (req: AuthRequest, res: Response) => {
  try {
    const treino = await Treino.findOne({
      where: { id: req.params.id, user_id: req.user!.userId }
    });
    
    if (!treino) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    await Exercicio.destroy({ where: { treino_id: treino.id } });
    await treino.destroy();
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar treino' });
  }
};