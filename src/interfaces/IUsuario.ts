export interface IUsuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  status?: string;
  created_at?: Date;
}

export interface IUsuarioInput {
  nome: string;
  email: string;
  senha: string;
}

export interface ILoginInput {
  email: string;
  senha: string;
}