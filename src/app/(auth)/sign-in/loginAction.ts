"use server";

import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Definir o tipo do estado
type LoginState = {
  message: string;
  success: boolean;
} | null;

const loginAction = async (
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, message: "Email e senha são obrigatórios!" };
    }

    // Usar Better Auth API para fazer login
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    // Se chegamos aqui, o login foi bem-sucedido, redirecionar para dashboard
    redirect("/dashboard");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.log(error);
    return { success: false, message: "Oops, algum erro aconteceu!" };
  }
};

export default loginAction;
