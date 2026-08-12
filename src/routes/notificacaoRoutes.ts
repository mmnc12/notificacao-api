import { Router } from 'express';
import NotificacaoController from '../controllers/NotificacaoController.js';

const router = Router();

router.get('/', (req, res, next) => NotificacaoController.index(req, res, next));
router.get('/:id', (req, res, next) => NotificacaoController.show(req, res, next));
router.post('/', (req, res, next) => NotificacaoController.store(req, res, next));

export default router;