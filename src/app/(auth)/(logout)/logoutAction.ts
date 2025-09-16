"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

const logoutAction = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error("Erro ao limpar dados de autenticação:", error);
  }

  redirect("/");
};

export default logoutAction;
