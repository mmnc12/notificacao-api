import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.error('Erro na aplicação:', err);
  return res.status(500).json({
    error: 'Erro interno no servidor.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}