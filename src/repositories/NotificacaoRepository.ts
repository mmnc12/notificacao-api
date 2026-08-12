import pool from '../config/database.js';
import { INotificacao, INotificacaoInput } from '../interfaces/INotificacao.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class NotificacaoRepository {
  async listarTodas(): Promise<INotificacao[]> {
    const query = `
      SELECT 
        id, 
        dt_primeiros_sintomas, 
        nome_paciente, 
        localidade, 
        endereco, 
        dt_notificacao, 
        status, 
        dengue, 
        chikungunya, 
        zika, 
        nome_mae, 
        resultado, 
        dt_resultado, 
        dt_recebimento
      FROM notificacoes 
      ORDER BY id DESC;
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query);
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
        chikungunya, 
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
}

export default new NotificacaoRepository();