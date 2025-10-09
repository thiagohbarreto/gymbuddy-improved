module.exports = (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, password } = req.body || {};
    
    if (email === 'demo@gymbuddy.com' && password && password.length >= 6) {
      res.json({ 
        user: { 
          id: 1, 
          nome: 'Usuario Demo', 
          email: 'demo@gymbuddy.com' 
        }, 
        token: 'demo-token-' + Date.now()
      });
      return;
    }
    
    res.status(401).json({ error: 'Email ou senha incorretos' });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};