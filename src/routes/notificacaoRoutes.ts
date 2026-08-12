import { Router } from 'express';
import NotificacaoController from '../controllers/NotificacaoController.js';

const router = Router();

router.get('/', (req, res, next) => NotificacaoController.index(req, res, next));
router.get('/:id', (req, res, next) => NotificacaoController.show(req, res, next));
router.post('/', (req, res, next) => NotificacaoController.store(req, res, next));
router.put('/:id', (req, res, next) => NotificacaoController.update(req, res, next));
router.delete('/:id', (req, res, next) => NotificacaoController.destroy(req, res, next));
router.get('/exportar/excel', (req, res, next) => NotificacaoController.exportarExcel(req, res, next));
router.get('/exportar/pdf', (req, res, next) => NotificacaoController.exportarPDF(req, res, next));

export default router;