import { Router } from 'express';
import { getTreinos, getTreino, createTreino, updateTreino, deleteTreino } from '../controllers/treinoController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getTreinos);
router.get('/recentes', getTreinos);
router.get('/:id', getTreino);
router.post('/', createTreino);
router.put('/:id', updateTreino);
router.delete('/:id', deleteTreino);

export default router;