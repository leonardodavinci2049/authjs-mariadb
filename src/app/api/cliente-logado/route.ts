import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { UserClienteService } from "@/services/db/user-cliente.service";

export async function GET() {
  try {
    // Buscar cliente baseado na sessão
    const cliente = await UserClienteService.getClienteBySession(
      await headers(),
    );

    return NextResponse.json({
      success: true,
      cliente,
    });
  } catch (error) {
    console.error("Erro ao buscar cliente logado:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
