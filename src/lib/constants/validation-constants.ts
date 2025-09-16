/**
 * Funções utilitárias de validação para formulários de autenticação
 */

import { VALIDATION_CONFIG, AUTH_ERROR_MESSAGES } from "./auth-constants";

// Enum para tipos de pessoa
enum PersonType {
  JURIDICA = 1,
  FISICA = 3,
}

// Tipos para resultados de validação
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida email
 */
export function validateEmail(email: string): ValidationResult {
  // Campo obrigatório
  if (!email || email.trim() === "") {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.EMAIL_REQUIRED,
    };
  }

  // Tamanho máximo
  if (email.length > VALIDATION_CONFIG.EMAIL_MAX_LENGTH) {
    return {
      isValid: false,
      message: `Email não pode ter mais de ${VALIDATION_CONFIG.EMAIL_MAX_LENGTH} caracteres`,
    };
  }

  // Formato do email
  if (!VALIDATION_CONFIG.EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.EMAIL_INVALID,
    };
  }

  return { isValid: true };
}

/**
 * Valida senha
 */
export function validatePassword(password: string): ValidationResult {
  // Campo obrigatório
  if (!password || password.trim() === "") {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED,
    };
  }

  // Tamanho mínimo
  if (password.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.PASSWORD_MIN_LENGTH,
    };
  }

  // Tamanho máximo
  if (password.length > VALIDATION_CONFIG.PASSWORD_MAX_LENGTH) {
    return {
      isValid: false,
      message: `Senha não pode ter mais de ${VALIDATION_CONFIG.PASSWORD_MAX_LENGTH} caracteres`,
    };
  }

  // Complexidade da senha
  if (!VALIDATION_CONFIG.PASSWORD_REGEX.test(password)) {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.PASSWORD_WEAK,
    };
  }

  return { isValid: true };
}

/**
 * Valida nome
 */
export function validateName(name: string): ValidationResult {
  // Campo obrigatório
  if (!name || name.trim() === "") {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.NAME_REQUIRED,
    };
  }

  const trimmedName = name.trim();

  // Tamanho mínimo
  if (trimmedName.length < VALIDATION_CONFIG.NAME_MIN_LENGTH) {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.NAME_MIN_LENGTH,
    };
  }

  // Tamanho máximo
  if (trimmedName.length > VALIDATION_CONFIG.NAME_MAX_LENGTH) {
    return {
      isValid: false,
      message: `Nome não pode ter mais de ${VALIDATION_CONFIG.NAME_MAX_LENGTH} caracteres`,
    };
  }

  // Verificar se contém pelo menos uma letra
  if (!/[a-zA-ZÀ-ÿ]/.test(trimmedName)) {
    return {
      isValid: false,
      message: "Nome deve conter pelo menos uma letra",
    };
  }

  // Verificar se não é apenas números
  if (/^\d+\s*$/.test(trimmedName)) {
    return {
      isValid: false,
      message: "Nome não pode conter apenas números",
    };
  }

  // Formato do nome (permitindo letras, números, espaços e alguns caracteres especiais)
  if (!VALIDATION_CONFIG.NAME_REGEX.test(trimmedName)) {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.NAME_INVALID,
    };
  }

  return { isValid: true };
}

/**
 * Valida confirmação de senha
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
): ValidationResult {
  // Campo obrigatório
  if (!confirmPassword || confirmPassword.trim() === "") {
    return {
      isValid: false,
      message: "Confirmação de senha é obrigatória",
    };
  }

  // Senhas devem coincidir
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: AUTH_ERROR_MESSAGES.PASSWORD_MISMATCH,
    };
  }

  return { isValid: true };
}

/**
 * Valida formulário de login
 */
export function validateLoginForm(formData: {
  email: string;
  password: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};

  // Validar email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message!;
  }

  // Validar senha
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida CPF
 */
export function validateCPF(cpf: string): ValidationResult {
  if (!cpf || cpf.trim() === "") {
    return {
      isValid: false,
      message: "CPF é obrigatório",
    };
  }

  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length !== 11) {
    return {
      isValid: false,
      message: "CPF deve conter 11 dígitos",
    };
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return {
      isValid: false,
      message: "CPF inválido",
    };
  }

  // Validação do CPF usando algoritmo
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return {
      isValid: false,
      message: "CPF inválido",
    };
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return {
      isValid: false,
      message: "CPF inválido",
    };
  }

  return { isValid: true };
}

/**
 * Valida CNPJ
 */
export function validateCNPJ(cnpj: string): ValidationResult {
  if (!cnpj || cnpj.trim() === "") {
    return {
      isValid: false,
      message: "CNPJ é obrigatório",
    };
  }

  const cleanCNPJ = cnpj.replace(/\D/g, "");

  if (cleanCNPJ.length !== 14) {
    return {
      isValid: false,
      message: "CNPJ deve conter 14 dígitos",
    };
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return {
      isValid: false,
      message: "CNPJ inválido",
    };
  }

  // Validação do CNPJ usando algoritmo
  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return {
      isValid: false,
      message: "CNPJ inválido",
    };
  }

  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return {
      isValid: false,
      message: "CNPJ inválido",
    };
  }

  return { isValid: true };
}

/**
 * Valida telefone
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === "") {
    return {
      isValid: false,
      message: "Telefone é obrigatório",
    };
  }

  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return {
      isValid: false,
      message: "Telefone deve conter 10 ou 11 dígitos",
    };
  }

  return { isValid: true };
}

/**
 * Valida CEP
 */
export function validateCEP(cep: string): ValidationResult {
  if (!cep || cep.trim() === "") {
    return {
      isValid: false,
      message: "CEP é obrigatório",
    };
  }

  const cleanCEP = cep.replace(/\D/g, "");

  if (cleanCEP.length !== 8) {
    return {
      isValid: false,
      message: "CEP deve conter 8 dígitos",
    };
  }

  return { isValid: true };
}

/**
 * Valida endereço
 */
export function validateAddress(address: string): ValidationResult {
  if (!address || address.trim() === "") {
    return {
      isValid: false,
      message: "Endereço é obrigatório",
    };
  }

  if (address.trim().length < 5) {
    return {
      isValid: false,
      message: "Endereço deve ter pelo menos 5 caracteres",
    };
  }

  return { isValid: true };
}

/**
 * Valida número do endereço
 */
export function validateAddressNumber(number: string): ValidationResult {
  if (!number || number.trim() === "") {
    return {
      isValid: false,
      message: "Número é obrigatório",
    };
  }

  return { isValid: true };
}

/**
 * Valida cidade
 */
export function validateCity(city: string): ValidationResult {
  if (!city || city.trim() === "") {
    return {
      isValid: false,
      message: "Cidade é obrigatória",
    };
  }

  if (city.trim().length < 2) {
    return {
      isValid: false,
      message: "Nome da cidade deve ter pelo menos 2 caracteres",
    };
  }

  return { isValid: true };
}

/**
 * Valida UF (estado)
 */
export function validateUF(uf: string): ValidationResult {
  if (!uf || uf.trim() === "") {
    return {
      isValid: false,
      message: "Estado é obrigatório",
    };
  }

  if (uf.length !== 2) {
    return {
      isValid: false,
      message: "Selecione um estado válido",
    };
  }

  return { isValid: true };
}

/**
 * Valida razão social
 */
export function validateRazaoSocial(razaoSocial: string): ValidationResult {
  if (!razaoSocial || razaoSocial.trim() === "") {
    return {
      isValid: false,
      message: "Razão Social é obrigatória",
    };
  }

  if (razaoSocial.trim().length < 2) {
    return {
      isValid: false,
      message: "Razão Social deve ter pelo menos 2 caracteres",
    };
  }

  return { isValid: true };
}

/**
 * Valida formulário de cadastro
 */
export function validateRegisterForm(formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};

  // Validar nome
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message!;
  }

  // Validar email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message!;
  }

  // Validar senha
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message!;
  }

  // Validar confirmação de senha (se fornecida)
  if (formData.confirmPassword !== undefined) {
    const confirmPasswordValidation = validatePasswordConfirmation(
      formData.password,
      formData.confirmPassword,
    );
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.message!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida formulário de cadastro estendido
 */
export function validateExtendedRegisterForm(formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  personType: number;
  cnpj?: string;
  razaoSocial?: string;
  cpf?: string;
  phone?: string;
  whatsapp?: string;
  cep: string;
  endereco: string;
  numero: string;
  cidade: string;
  uf: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};

  // Validações básicas
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message!;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message!;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message!;
  }

  if (formData.confirmPassword !== undefined) {
    const confirmPasswordValidation = validatePasswordConfirmation(
      formData.password,
      formData.confirmPassword,
    );
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.message!;
    }
  }

  // Validação específica por tipo de pessoa
  if (formData.personType === PersonType.JURIDICA) {
    // Pessoa Jurídica - CNPJ obrigatório
    if (!formData.cnpj) {
      errors.cnpj = "CNPJ é obrigatório para pessoa jurídica";
    } else {
      const cnpjValidation = validateCNPJ(formData.cnpj);
      if (!cnpjValidation.isValid) {
        errors.cnpj = cnpjValidation.message!;
      }
    }

    if (!formData.razaoSocial) {
      errors.razaoSocial = "Razão Social é obrigatória para pessoa jurídica";
    }
  } else if (formData.personType === PersonType.FISICA) {
    // Pessoa Física - CPF obrigatório
    if (!formData.cpf) {
      errors.cpf = "CPF é obrigatório para pessoa física";
    } else {
      const cpfValidation = validateCPF(formData.cpf);
      if (!cpfValidation.isValid) {
        errors.cpf = cpfValidation.message!;
      }
    }
  } else {
    // Tipo de pessoa não selecionado ou inválido
    errors.personType =
      "Selecione o tipo de cadastro (Pessoa Física ou Jurídica)";
  }

  // Validações de telefone e WhatsApp (obrigatórios para ambos os tipos)
  if (formData.personType === 1 || formData.personType === 3) {
    if (formData.phone && formData.phone.trim()) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.message!;
      }
    } else {
      errors.phone = "Telefone é obrigatório";
    }

    if (formData.whatsapp && formData.whatsapp.trim()) {
      const whatsappValidation = validatePhone(formData.whatsapp);
      if (!whatsappValidation.isValid) {
        errors.whatsapp = whatsappValidation.message!;
      }
    } else {
      errors.whatsapp = "WhatsApp é obrigatório";
    }
  }

  // Validações de endereço (obrigatórias para ambos)
  const cepValidation = validateCEP(formData.cep);
  if (!cepValidation.isValid) {
    errors.cep = cepValidation.message!;
  }

  const addressValidation = validateAddress(formData.endereco);
  if (!addressValidation.isValid) {
    errors.endereco = addressValidation.message!;
  }

  const numberValidation = validateAddressNumber(formData.numero);
  if (!numberValidation.isValid) {
    errors.numero = numberValidation.message!;
  }

  const cityValidation = validateCity(formData.cidade);
  if (!cityValidation.isValid) {
    errors.cidade = cityValidation.message!;
  }

  const ufValidation = validateUF(formData.uf);
  if (!ufValidation.isValid) {
    errors.uf = ufValidation.message!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Debounce para validação em tempo real
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sanitiza input do usuário
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Verifica se o campo está vazio
 */
export function isEmpty(value: string): boolean {
  return !value || value.trim() === "";
}

/**
 * Força da senha (0-4)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  // Tamanho mínimo
  if (password.length >= 8) strength++;

  // Contém minúscula
  if (/[a-z]/.test(password)) strength++;

  // Contém maiúscula
  if (/[A-Z]/.test(password)) strength++;

  // Contém número
  if (/\d/.test(password)) strength++;

  // Contém caractere especial
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  return strength;
}

/**
 * Texto descritivo da força da senha
 */
export function getPasswordStrengthText(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return "Muito fraca";
    case 2:
      return "Fraca";
    case 3:
      return "Média";
    case 4:
      return "Forte";
    case 5:
      return "Muito forte";
    default:
      return "Muito fraca";
  }
}

/**
 * Cor da força da senha
 */
export function getPasswordStrengthColor(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return "text-red-500";
    case 2:
      return "text-orange-500";
    case 3:
      return "text-yellow-500";
    case 4:
      return "text-green-500";
    case 5:
      return "text-green-600";
    default:
      return "text-red-500";
  }
}

/**
 * Formata CPF
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata CNPJ
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "");
  return cleaned.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
}

/**
 * Formata telefone
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}

/**
 * Formata CEP
 */
export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
}

/**
 * Valida URL de imagem
 */
export function validateImageURL(url: string): ValidationResult {
  // Campo opcional - se estiver vazio, é válido
  if (!url || url.trim() === "") {
    return { isValid: true };
  }

  const trimmedUrl = url.trim();

  // Validar formato de URL
  const urlPattern = /^https?:\/\/.+/i;
  if (!urlPattern.test(trimmedUrl)) {
    return {
      isValid: false,
      message: "URL deve começar com http:// ou https://",
    };
  }

  // Validar se a URL é válida
  try {
    new URL(trimmedUrl);
  } catch {
    return {
      isValid: false,
      message: "URL inválida",
    };
  }

  // Validar extensões de imagem comuns
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;
  if (!imageExtensions.test(trimmedUrl)) {
    return {
      isValid: false,
      message:
        "URL deve apontar para uma imagem (jpg, png, gif, webp, svg, etc.)",
    };
  }

  // Validar tamanho da URL
  if (trimmedUrl.length > 500) {
    return {
      isValid: false,
      message: "URL muito longa (máximo 500 caracteres)",
    };
  }

  return { isValid: true };
}

/**
 * Valida resposta do desafio anti-spam
 * Não faz validação matemática aqui pois é feita no componente
 * Apenas verifica se foi preenchido
 */
export function validateAntiSpamChallenge(answer: string): ValidationResult {
  // Campo obrigatório
  if (!answer || answer.trim() === "") {
    return {
      isValid: false,
      message: "Por favor, resolva a operação matemática",
    };
  }

  const trimmedAnswer = answer.trim();

  // Verificar se é um número
  if (!/^\d+$/.test(trimmedAnswer)) {
    return {
      isValid: false,
      message: "Digite apenas números",
    };
  }

  // Verificar se está dentro de um range razoável (0-100)
  const numAnswer = parseInt(trimmedAnswer, 10);
  if (numAnswer < 0 || numAnswer > 100) {
    return {
      isValid: false,
      message: "Resposta deve ser um número entre 0 e 100",
    };
  }

  return { isValid: true };
}
