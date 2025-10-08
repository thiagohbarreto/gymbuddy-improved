import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const treinosRecentes = [
      {
        id: 1,
        titulo: 'Peito e Tríceps',
        divisao: 'A',
        data_execucao: new Date().toISOString(),
        tempo_total: 3600,
        volume_total: 2500
      }
    ];

    res.json(treinosRecentes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}