import { Request, Response, NextFunction } from 'express';
import NotificacaoRepository from '../repositories/NotificacaoRepository.js';
import { INotificacaoInput } from '../interfaces/INotificacao.js';

class NotificacaoController {
  async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const notificacoes = await NotificacaoRepository.listarTodas();
      return res.status(200).json(notificacoes);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const notificacao = await NotificacaoRepository.buscarPorId(id);
      if (!notificacao) {
        return res.status(404).json({ error: 'Notificação não encontrada.' });
      }

      return res.status(200).json(notificacao);
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const body: INotificacaoInput = req.body;

      // 1. Validação dos campos obrigatórios
      if (
        !body.dt_primeiros_sintomas ||
        !body.nome_paciente ||
        !body.localidade ||
        !body.dt_notificacao ||
        !body.nome_mae
      ) {
        return res.status(400).json({
          error: 'Os campos dt_primeiros_sintomas, nome_paciente, localidade, dt_notificacao e nome_mae são obrigatórios.'
        });
      }

      // 2. Regra de negócio: Ao menos uma arbovirose deve ser marcada
      if (!body.dengue && !body.chikungunya && !body.zika) {
        return res.status(400).json({
          error: 'Selecione ao menos uma arbovirose (Dengue, Chikungunya ou Zika).'
        });
      }

      const insertId = await NotificacaoRepository.criar(body);
      const novaNotificacao = await NotificacaoRepository.buscarPorId(insertId);

      return res.status(201).json(novaNotificacao);
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificacaoController();