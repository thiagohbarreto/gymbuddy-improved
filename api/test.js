export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ message: 'API funcionando!', timestamp: new Date().toISOString() });
}