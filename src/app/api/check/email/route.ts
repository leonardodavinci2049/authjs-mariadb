import { NextRequest, NextResponse } from "next/server";
import checkService from "@/services/db/check/check.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.ID_LOJA || !body.ID_USUARIO || !body.TERMO) {
      return NextResponse.json(
        {
          error: "Dados obrigatórios faltando",
          required: ["ID_LOJA", "ID_USUARIO", "TERMO"],
        },
        { status: 400 },
      );
    }

    const result = await checkService.tskCheckIfEmailExist(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao verificar email:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
