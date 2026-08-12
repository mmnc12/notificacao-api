import { Request, Response, NextFunction } from 'express';
import NotificacaoRepository from '../repositories/NotificacaoRepository.js';
import { INotificacaoInput, INotificacaoFiltros } from '../interfaces/INotificacao.js';
import RelatorioService from '../services/RelatorioService.js';

class NotificacaoController {
  async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { nome, localidade, status, ano, mes, dataInicio, dataFim, resultado } = req.query;

      const filtros: INotificacaoFiltros = {
        nome: nome ? String(nome) : undefined,
        localidade: localidade ? String(localidade) : undefined,
        status: status ? String(status) : undefined,
        ano: ano ? Number(ano) : undefined,
        mes: mes ? Number(mes) : undefined,
        dataInicio: dataInicio ? String(dataInicio) : undefined,
        dataFim: dataFim ? String(dataFim) : undefined,
        resultado: resultado ? String(resultado) : undefined
      };

      const notificacoes = await NotificacaoRepository.listarComFiltros(filtros);
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

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const body: INotificacaoInput = req.body;

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

      if (!body.dengue && !body.chikungunya && !body.zika) {
        return res.status(400).json({
          error: 'Selecione ao menos uma arbovirose (Dengue, Chikungunya ou Zika).'
        });
      }

      const atualizado = await NotificacaoRepository.atualizar(id, body);
      if (!atualizado) {
        return res.status(404).json({ error: 'Notificação não encontrada para atualização.' });
      }

      const notificacaoAtualizada = await NotificacaoRepository.buscarPorId(id);
      return res.status(200).json(notificacaoAtualizada);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const deletado = await NotificacaoRepository.deletar(id);
      if (!deletado) {
        return res.status(404).json({ error: 'Notificação não encontrada para exclusão.' });
      }

      return res.status(200).json({ message: 'Notificação excluída com sucesso.' });
    } catch (error) {
      next(error);
    }
  }

  async exportarExcel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome, localidade, status, ano, mes, dataInicio, dataFim, resultado } = req.query;

      const filtros: INotificacaoFiltros = {
        nome: nome ? String(nome) : undefined,
        localidade: localidade ? String(localidade) : undefined,
        status: status ? String(status) : undefined,
        ano: ano ? Number(ano) : undefined,
        mes: mes ? Number(mes) : undefined,
        dataInicio: dataInicio ? String(dataInicio) : undefined,
        dataFim: dataFim ? String(dataFim) : undefined,
        resultado: resultado ? String(resultado) : undefined
      };

      const notificacoes = await NotificacaoRepository.listarComFiltros(filtros);
      await RelatorioService.gerarExcel(notificacoes, res);
    } catch (error) {
      next(error);
    }
  }

  async exportarPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome, localidade, status, ano, mes, dataInicio, dataFim, resultado } = req.query;

      const filtros: INotificacaoFiltros = {
        nome: nome ? String(nome) : undefined,
        localidade: localidade ? String(localidade) : undefined,
        status: status ? String(status) : undefined,
        ano: ano ? Number(ano) : undefined,
        mes: mes ? Number(mes) : undefined,
        dataInicio: dataInicio ? String(dataInicio) : undefined,
        dataFim: dataFim ? String(dataFim) : undefined,
        resultado: resultado ? String(resultado) : undefined
      };

      const notificacoes = await NotificacaoRepository.listarComFiltros(filtros);
      RelatorioService.gerarPDF(notificacoes, res);
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificacaoController();