import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificacaoRoutes from './routes/notificacaoRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/notificacoes', notificacaoRoutes);

// Middleware de erros
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor TypeScript rodando na porta ${PORT}`);
});