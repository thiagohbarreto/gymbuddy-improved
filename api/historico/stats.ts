export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stats = {
    total_treinos: 15,
    streak_atual: 3,
    melhor_streak: 7,
    volume_total: 45000,
    tempo_total: 54000,
    exercicios_favoritos: ['Supino', 'Agachamento', 'Levantamento Terra']
  };

  res.json(stats);
}