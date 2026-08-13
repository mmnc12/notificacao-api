import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificacaoRoutes from './routes/notificacaoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';
import localidadeRoutes from './routes/localidadeRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rota pública de Autenticação (Registro e Login)
app.use('/api/auth', authRoutes);

// Rotas Protegidas (Exigem o Token JWT no cabeçalho Authorization)
app.use('/api/notificacoes', authMiddleware, notificacaoRoutes);

app.use('/api/localidades', localidadeRoutes);

// Middleware de erros
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor TypeScript rodando na porta ${PORT}`);
});