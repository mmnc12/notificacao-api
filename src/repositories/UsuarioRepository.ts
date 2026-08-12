import pool from '../config/database.js';
import { IUsuario, IUsuarioInput } from '../interfaces/IUsuario.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class UsuarioRepository {
  async buscarPorEmail(email: string): Promise<IUsuario | null> {
    const query = 'SELECT * FROM usuarios WHERE email = ?;';
    const [rows] = await pool.query<RowDataPacket[]>(query, [email]);
    if (rows.length === 0) return null;
    return rows[0] as IUsuario;
  }

  async buscarPorId(id: number): Promise<IUsuario | null> {
    const query = 'SELECT id, nome, email, status, created_at FROM usuarios WHERE id = ?;';
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    if (rows.length === 0) return null;
    return rows[0] as IUsuario;
  }

  async criar(dados: IUsuarioInput): Promise<number> {
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?);';
    const values = [dados.nome, dados.email, dados.senha];
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result.insertId;
  }
}

export default new UsuarioRepository();