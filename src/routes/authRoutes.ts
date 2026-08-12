import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

router.post('/registrar', (req, res, next) => AuthController.registrar(req, res, next));
router.post('/login', (req, res, next) => AuthController.login(req, res, next));

export default router;