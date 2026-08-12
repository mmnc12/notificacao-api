export interface INotificacao {
  id?: number;
  dt_primeiros_sintomas: string;
  nome_paciente: string;
  localidade: string;
  endereco?: string | null;
  dt_notificacao: string;
  status?: string;
  dengue: boolean | number;
  chikungunya: boolean | number;
  zika: boolean | number;
  nome_mae: string;
  resultado?: string | null;
  dt_resultado?: string | null;
  dt_recebimento?: string | null;
}

export interface INotificacaoInput {
  dt_primeiros_sintomas: string;
  nome_paciente: string;
  localidade: string;
  endereco?: string;
  dt_notificacao: string;
  dengue: boolean;
  chikungunya: boolean;
  zika: boolean;
  nome_mae: string;
  resultado?: string;
  dt_resultado?: string;
  dt_recebimento?: string;
}