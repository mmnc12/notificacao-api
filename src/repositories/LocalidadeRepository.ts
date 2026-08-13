import pool from '../config/database.js';
import { ILocalidade } from '../interfaces/ILocalidade.js';
import { RowDataPacket } from 'mysql2';

class LocalidadeRepository {
  async listarTodas(): Promise<ILocalidade[]> {
    const query = `
      SELECT 
        id, 
        cod, 
        nome_localidade 
      FROM localidades 
      ORDER BY nome_localidade ASC;
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows as ILocalidade[];
  }
}

export default new LocalidadeRepository();