"use server";
import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Definir o tipo do estado
type RegisterState = {
  message: string;
  success: boolean;
} | null;



const loginAction = async (
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> => {

  
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: true,
      redirectTo: "/dashboard",
    });

    return {  message: 'Login Success', success: true };

  } catch (error) {
      if (isRedirectError(error)){
      throw error;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "type" in error &&
      (error as { type?: string }).type === "CredentialsSignIn"
    ) {
      return { success: false, message: "Credenciais incorretas!" };
    }

    console.log(error)
    return { success: false, message: "Oops, algum erro aconteceu!" };   

  }
};

export default loginAction;
