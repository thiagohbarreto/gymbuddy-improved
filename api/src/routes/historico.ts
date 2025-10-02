import { Router } from 'express';
import { getHistorico, createHistorico, getStats } from '../controllers/historicoController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getHistorico);
router.post('/', createHistorico);
router.get('/stats', getStats);

export default router;