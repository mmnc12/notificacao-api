import { Router } from 'express';
import LocalidadeController from '../controllers/LocalidadeController';

const router = Router();

// GET /api/localidades - Lista todas as localidades para o combobox
router.get('/', (req, res, next) => LocalidadeController.index(req, res, next));

export default router;