import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { IUsuarioInput, ILoginInput } from '../interfaces/IUsuario.js';

class AuthController {
  async registrar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { nome, email, senha }: IUsuarioInput = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
      }

      const usuarioExistente = await UsuarioRepository.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({ error: 'E-mail já cadastrado no sistema.' });
      }

      // Hash da senha com salt de 10 rounds
      const senhaHash = await bcrypt.hash(senha, 10);

      const insertId = await UsuarioRepository.criar({
        nome,
        email,
        senha: senhaHash
      });

      const novoUsuario = await UsuarioRepository.buscarPorId(insertId);
      return res.status(201).json(novoUsuario);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, senha }: ILoginInput = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      }

      const usuario = await UsuarioRepository.buscarPorEmail(email);
      if (!usuario || !usuario.senha) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // Validação da senha criptografada
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // Configuração de assinatura do Token JWT
      const secret: jwt.Secret = process.env.JWT_SECRET || 'chave_secreta_padrao_notificacao_2026';
      const options: jwt.SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN as any) || '8h'
      };

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, nome: usuario.nome },
        secret,
        options
      );

      return res.status(200).json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();