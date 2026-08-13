import { Request, Response, NextFunction } from 'express';
import LocalidadeRepository from '../repositories/LocalidadeRepository';

class LocalidadeController {
  async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const localidades = await LocalidadeRepository.listarTodas();
      return res.status(200).json(localidades);
    } catch (error) {
      next(error);
    }
  }
}

export default new LocalidadeController();