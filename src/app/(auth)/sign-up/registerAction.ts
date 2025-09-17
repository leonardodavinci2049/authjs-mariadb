"use server";

import crypto from "crypto";
import authService from "@/services/db/auth/auth.service";
import { validateRegisterForm } from "@/lib/constants/validation-constants";

// Definir o tipo do estado
type RegisterState = {
  message: string;
  success: boolean;
} | null;

// Definir o tipo dos dados do formulário
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

// Função para gerar hash MD5
function generateMD5Hash(password: string): string {
  return crypto.createHash("md5").update(password).digest("hex");
}

async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const entries = Array.from(formData.entries());
  const data = Object.fromEntries(entries) as RegisterFormData;

  // Validação dos dados do formulário
  const validation = validateRegisterForm(data);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    return {
      message: firstError,
      success: false,
    };
  }

  try {
    // Gerar hash MD5 da senha (após validação)
    const passwordMD5 = generateMD5Hash(data.password);

    // Preparar dados para o serviço de autenticação
    const signUpData = {
      USER_ID: 1,
      NAME: data.name,
      EMAIL: data.email,
      PASSWORD_MD5: passwordMD5,
      INFO1: "Formulário Sign-up",
    };

    // Chamar o serviço de cadastro
    const result = await authService.tskAuthSignUp(signUpData);

    // Verificar se o cadastro foi bem-sucedido
    // StatusCode 100200 indica sucesso
    if (result.statusCode === 100200 && result.recordId > 0) {
      return {
        message: "Usuário cadastrado com sucesso!",
        success: true,
      };
    } else {
      return {
        message:
          result.message || "Erro ao cadastrar usuário. Tente novamente.",
        success: false,
      };
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);

    // Verificar se é um erro de validação específico
    if (error instanceof Error) {
      return {
        message: error.message,
        success: false,
      };
    }

    return {
      message: "Erro interno do servidor. Tente novamente.",
      success: false,
    };
  }
}

export default registerAction;
