/**
 * Constantes para autenticação
 * Inclui credenciais de demonstração, mensagens e configurações
 */

// Credenciais de demonstração
export const DEMO_CREDENTIALS = {
  EMAIL: "teste@comsuporte.com",
  PASSWORD: "Comsuporte@2025",
  DISPLAY_NAME: "Teste Demonstração",
} as const;

// Mensagens de erro
export const AUTH_ERROR_MESSAGES = {
  // Validação de email
  EMAIL_REQUIRED: "Email é obrigatório",
  EMAIL_INVALID: "Digite um email válido",
  EMAIL_NOT_FOUND: "Email não encontrado",

  // Validação de senha
  PASSWORD_REQUIRED: "Senha é obrigatória",
  PASSWORD_MIN_LENGTH: "Senha deve ter pelo menos 8 caracteres",
  PASSWORD_WEAK:
    "Senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número",
  PASSWORD_MISMATCH: "As senhas não coincidem",

  // Validação de nome
  NAME_REQUIRED: "Nome é obrigatório",
  NAME_MIN_LENGTH: "Nome deve ter pelo menos 2 caracteres",
  NAME_INVALID:
    "Nome deve conter pelo menos uma letra e pode incluir números, espaços e caracteres especiais básicos",

  // Erros de autenticação
  INVALID_CREDENTIALS: "Email ou senha incorretos",
  ACCOUNT_LOCKED: "Conta bloqueada. Tente novamente mais tarde",
  SERVER_ERROR: "Erro interno do servidor. Tente novamente",
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet",
  TIMEOUT_ERROR: "Tempo limite excedido. Tente novamente",

  // Cadastro
  EMAIL_ALREADY_EXISTS: "Este email já está cadastrado",
  REGISTRATION_FAILED: "Erro ao criar conta. Tente novamente",

  // Geral
  REQUIRED_FIELDS: "Preencha todos os campos obrigatórios",
  UNKNOWN_ERROR: "Erro desconhecido. Tente novamente",
} as const;

// Mensagens de sucesso
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login realizado com sucesso!",
  REGISTRATION_SUCCESS: "Conta criada com sucesso!",
  PASSWORD_CHANGED: "Senha alterada com sucesso!",
  EMAIL_VERIFIED: "Email verificado com sucesso!",
} as const;

// Configurações de validação
export const VALIDATION_CONFIG = {
  // Email
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_MAX_LENGTH: 100,

  // Senha
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,

  // Nome
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  NAME_REGEX: /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9\s\-._&()]+$/,

  // Timeouts
  DEBOUNCE_DELAY: 300,
  API_TIMEOUT: 10000,
} as const;

// Textos da interface
export const AUTH_UI_TEXTS = {
  // Login
  LOGIN_TITLE: "Entre em sua conta",
  LOGIN_SUBTITLE: "Use suas credenciais para acessar o sistema",
  LOGIN_BUTTON: "Entrar",
  LOGIN_LOADING: "Entrando...",

  // Cadastro
  REGISTER_TITLE: "Cadastre-se",
  REGISTER_SUBTITLE: "Faça seu cadastro gratuitamente",
  REGISTER_BUTTON: "Criar conta",
  REGISTER_LOADING: "Criando conta...",

  // Links
  FORGOT_PASSWORD: "Esqueceu sua senha?",
  BACK_TO_LOGIN: "Voltar para o login",
  ALREADY_HAVE_ACCOUNT: "Já possui cadastro?",
  NO_ACCOUNT: "Não possui cadastro?",
  SIGN_IN_LINK: "Faça o login",
  SIGN_UP_LINK: "Registre-se",

  // Campos
  EMAIL_LABEL: "Email",
  EMAIL_PLACEHOLDER: "seu@email.com",
  PASSWORD_LABEL: "Senha",
  PASSWORD_PLACEHOLDER: "********",
  NAME_LABEL: "Nome Completo",
  NAME_PLACEHOLDER: "Seu nome completo",
  CONFIRM_PASSWORD_LABEL: "Confirmar Senha",
  CONFIRM_PASSWORD_PLACEHOLDER: "********",

  // Credenciais de demonstração
  DEMO_TITLE: "Credenciais de Demonstração",
  DEMO_SUBTITLE: "Use estas credenciais para testar o sistema:",
  DEMO_EMAIL_LABEL: "Email",
  DEMO_PASSWORD_LABEL: "Senha",
  USE_DEMO_BUTTON: "Usar credenciais de demonstração",

  // Outros
  LOADING: "Carregando...",
  TRY_AGAIN: "Tentar novamente",
  CANCEL: "Cancelar",
  CONTINUE: "Continuar",
} as const;

// Configurações de tema
export const AUTH_THEME = {
  ANIMATION_DURATION: 200,
  FOCUS_RING_COLOR: "ring-primary",
  ERROR_COLOR: "text-red-600 dark:text-red-400",
  SUCCESS_COLOR: "text-green-600 dark:text-green-400",
  MUTED_COLOR: "text-muted-foreground",
} as const;

// Tipos para TypeScript
export type AuthErrorMessage = keyof typeof AUTH_ERROR_MESSAGES;
export type AuthSuccessMessage = keyof typeof AUTH_SUCCESS_MESSAGES;
export type AuthUIText = keyof typeof AUTH_UI_TEXTS;
