"use server";

import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Definir o tipo do estado
type RegisterState = {
  message: string;
  success: boolean;
} | null;

const registerAction = async (
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { success: false, message: "Todos os campos são obrigatórios!" };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "A senha deve ter pelo menos 6 caracteres!",
      };
    }

    // Usar Better Auth API para registrar usuário
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    // Se chegamos aqui, o registro foi bem-sucedido, redirecionar para dashboard
    redirect("/dashboard");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.log(error);

    // Verificar se é erro de email já existe
    if (error instanceof Error && error.message.includes("email")) {
      return { success: false, message: "Este email já está sendo usado!" };
    }

    return { success: false, message: "Oops, algum erro aconteceu!" };
  }
};

export default registerAction;
