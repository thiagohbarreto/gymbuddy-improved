export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    res.status(201).json({ 
      user: { 
        id: 1, 
        nome: 'Novo Usuario', 
        email: 'novo@gymbuddy.com' 
      }, 
      token: 'demo-token-123' 
    });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}