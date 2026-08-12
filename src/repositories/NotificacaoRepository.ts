import pool from '../config/database.js';
import { INotificacao, INotificacaoInput, INotificacaoFiltros } from '../interfaces/INotificacao.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class NotificacaoRepository {
  async listarComFiltros(filtros: INotificacaoFiltros): Promise<INotificacao[]> {
    let query = `
      SELECT 
        id, 
        dt_primeiros_sintomas, 
        nome_paciente, 
        localidade, 
        endereco, 
        dt_notificacao, 
        status, 
        dengue, 
        chick AS chikungunya, 
        zika, 
        nome_mae, 
        resultado, 
        dt_resultado, 
        dt_recebimento
      FROM notificacoes 
      WHERE 1=1
    `;
    const params: any[] = [];

    // Filtro por Nome (busca parcial)
    if (filtros.nome) {
      query += ` AND nome_paciente LIKE ?`;
      params.push(`%${filtros.nome}%`);
    }

    // Filtro por Localidade
    if (filtros.localidade) {
      query += ` AND localidade LIKE ?`;
      params.push(`%${filtros.localidade}%`);
    }

    // Filtro por Status (ATIVO / INATIVO)
    if (filtros.status) {
      query += ` AND status = ?`;
      params.push(filtros.status);
    }

    // Filtro por Ano
    if (filtros.ano) {
      query += ` AND YEAR(dt_primeiros_sintomas) = ?`;
      params.push(filtros.ano);
    }

    // Filtro por Mês (1 a 12)
    if (filtros.mes) {
      query += ` AND MONTH(dt_primeiros_sintomas) = ?`;
      params.push(filtros.mes);
    }

    // Filtro por Intervalo de Datas
    if (filtros.dataInicio && filtros.dataFim) {
      query += ` AND dt_primeiros_sintomas BETWEEN ? AND ?`;
      params.push(filtros.dataInicio, filtros.dataFim);
    } else if (filtros.dataInicio) {
      query += ` AND dt_primeiros_sintomas >= ?`;
      params.push(filtros.dataInicio);
    } else if (filtros.dataFim) {
      query += ` AND dt_primeiros_sintomas <= ?`;
      params.push(filtros.dataFim);
    }

    // Filtro por Resultado (POSITIVO / NEGATIVO / INDEFINIDO)
    if (filtros.resultado) {
      query += ` AND resultado = ?`;
      params.push(filtros.resultado);
    }

    query += ` ORDER BY id DESC;`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as INotificacao[];
  }

  async buscarPorId(id: number): Promise<INotificacao | null> {
    const query = 'SELECT * FROM notificacoes WHERE id = ?;';
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    if (rows.length === 0) return null;
    return rows[0] as INotificacao;
  }

  async criar(dados: INotificacaoInput): Promise<number> {
    const query = `
      INSERT INTO notificacoes (
        dt_primeiros_sintomas, 
        nome_paciente, 
        localidade, 
        endereco, 
        dt_notificacao, 
        dengue, 
        chick, 
        zika, 
        nome_mae, 
        resultado, 
        dt_resultado, 
        dt_recebimento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      dados.dt_primeiros_sintomas,
      dados.nome_paciente,
      dados.localidade,
      dados.endereco || null,
      dados.dt_notificacao,
      dados.dengue ? 1 : 0,
      dados.chikungunya ? 1 : 0,
      dados.zika ? 1 : 0,
      dados.nome_mae,
      dados.resultado || null,
      dados.dt_resultado || null,
      dados.dt_recebimento || null
    ];

    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result.insertId;
  }

  async atualizar(id: number, dados: INotificacaoInput): Promise<boolean> {
    const query = `
      UPDATE notificacoes SET 
        dt_primeiros_sintomas = ?, 
        nome_paciente = ?, 
        localidade = ?, 
        endereco = ?, 
        dt_notificacao = ?, 
        dengue = ?, 
        chick = ?, 
        zika = ?, 
        nome_mae = ?, 
        resultado = ?, 
        dt_resultado = ?, 
        dt_recebimento = ?
      WHERE id = ?;
    `;

    const values = [
      dados.dt_primeiros_sintomas,
      dados.nome_paciente,
      dados.localidade,
      dados.endereco || null,
      dados.dt_notificacao,
      dados.dengue ? 1 : 0,
      dados.chikungunya ? 1 : 0,
      dados.zika ? 1 : 0,
      dados.nome_mae,
      dados.resultado || null,
      dados.dt_resultado || null,
      dados.dt_recebimento || null,
      id
    ];

    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result.affectedRows > 0;
  }

  async deletar(id: number): Promise<boolean> {
    const query = 'DELETE FROM notificacoes WHERE id = ?;';
    const [result] = await pool.query<ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }
}

export default new NotificacaoRepository();