import { Response } from 'express';
import { HistoricoTreino, Treino } from '../models';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { Op } from 'sequelize';

const historicoSchema = z.object({
  treino_id: z.number(),
  data_execucao: z.string().datetime().optional(),
  tempo_total: z.number().optional(),
  observacoes: z.string().optional(),
  volume_total: z.number().optional()
});

export const getHistorico = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50, offset = 0, treino_id } = req.query;
    
    const where: any = { user_id: req.user!.userId };
    if (treino_id) where.treino_id = treino_id;

    const historico = await HistoricoTreino.findAll({
      where,
      include: [{ model: Treino, attributes: ['titulo', 'divisao', 'identificador'] }],
      order: [['data_execucao', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json(historico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};

export const createHistorico = async (req: AuthRequest, res: Response) => {
  try {
    const data = historicoSchema.parse(req.body);
    
    const treino = await Treino.findOne({
      where: { id: data.treino_id, user_id: req.user!.userId }
    });
    
    if (!treino) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    const historico = await HistoricoTreino.create({
      ...data,
      user_id: req.user!.userId,
      data_execucao: data.data_execucao ? new Date(data.data_execucao) : new Date()
    });

    res.status(201).json(historico);
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    const totalTreinos = await HistoricoTreino.count({
      where: { user_id: userId }
    });

    const volumeTotal = await HistoricoTreino.sum('volume_total', {
      where: { user_id: userId }
    });

    const tempoTotal = await HistoricoTreino.sum('tempo_total', {
      where: { user_id: userId }
    });

    // Streak atual
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    
    let streakAtual = 0;
    let dataVerificacao = new Date(hoje);
    
    while (true) {
      const inicioData = new Date(dataVerificacao);
      inicioData.setHours(0, 0, 0, 0);
      const fimData = new Date(dataVerificacao);
      fimData.setHours(23, 59, 59, 999);
      
      const treinoNoDia = await HistoricoTreino.findOne({
        where: {
          user_id: userId,
          data_execucao: {
            [Op.between]: [inicioData, fimData]
          }
        }
      });
      
      if (treinoNoDia) {
        streakAtual++;
        dataVerificacao.setDate(dataVerificacao.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({
      total_treinos: totalTreinos,
      volume_total: volumeTotal || 0,
      tempo_total: tempoTotal || 0,
      streak_atual: streakAtual
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular estatísticas' });
  }
};