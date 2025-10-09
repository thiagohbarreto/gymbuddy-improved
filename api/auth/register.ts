module.exports = (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    res.status(201).json({ 
      user: { 
        id: Date.now(), 
        nome: 'Novo Usuario', 
        email: 'novo@gymbuddy.com' 
      }, 
      token: 'demo-token-' + Date.now()
    });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};