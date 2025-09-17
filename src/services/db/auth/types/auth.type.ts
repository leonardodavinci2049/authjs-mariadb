import { RowDataPacket } from 'mysql2';

// Adicione a interface UsuarioRow para mapear os resultados da tabela de usuários
// Adicione mais interfaces para outras tabelas
export interface IUserId extends RowDataPacket {
  ID_USUARIO: number;
}

export interface UsuarioRowV1 extends RowDataPacket {
  ID_USUARIO?: number;
  ID_SYSTEM_CLIENTE?: number;
  ID_PESSOA?: number;
  LOGIN?: string;
  NOME?: string;
  EMAIL_DE_LOGIN?: string;
  SENHA?: string;
  // Adicione outros campos conforme necessário
}

export interface UsuarioRowV2 extends RowDataPacket {
  ID_USUARIO?: number;
  ID_SYSTEM_CLIENTE?: number;
  ID_PESSOA?: number;
  LOGIN?: string;
  NOME?: string;
  EMAIL_DE_LOGIN?: string;
  SENHA?: string;
  // Adicione outros campos conforme necessário
}

// User information returned from login
export interface tblSystemUser extends RowDataPacket {
  ID_USUARIO: number;
  ID_SYSTEM_CLIENTE: number;
  ID_PESSOA?: number;
  ID_CATEGORIA?: number;
  ID_LOJA?: number;
  ID_TIPO?: number;
  ID_TIPO_CLIENTE?: number;
  ID_PESSOA_TIPO?: number;
  ID_DEPARTAMENTO?: number;
  NOME?: string;
  RAZAO_SOCIAL?: string;
  EMAIL_DE_LOGIN?: string;
  CPF?: string;
  CNPJ?: string;
  LOGIN?: string;
  FONE1?: string;
  WHATAPP1?: string;
  PATH_IMAGEM?: string;
  NIVEL?: number;
  DT_ULT_ACESSO?: string;
  DATADOCADASTRO?: string;
  ANOTACOES?: string;
}

// Login feedback information

export interface SpDefaultFeedback extends RowDataPacket {
  pl_id_cadastro: number;
  pl_feedback: string;
  pl_id_erro: number;
}

// Database operation result
export interface SpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

// Or keep the tuple type and create a related interface
export type SpResultData = [
  tblSystemUser[], // Primeiro item: array de usuários
  SpDefaultFeedback[], // Terceiro item: resultado SQL
  SpOperationResult, // Segundo item: array de feedbacks
];
