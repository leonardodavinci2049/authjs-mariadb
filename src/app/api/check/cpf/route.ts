import { NextRequest, NextResponse } from "next/server";
import checkService from "@/services/db/check/check.service";
import { envs } from "@/core/config/envs";

interface CheckResultData {
  ID_CHECK: number;
  ID_RECORD: number;
}

interface FeedbackData {
  pl_id_cadastro: number;
  pl_feedback: string;
  pl_id_erro: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica - apenas TERMO é necessário do cliente
    if (!body.TERMO) {
      return NextResponse.json(
        {
          error: "Dados obrigatórios faltando",
          required: ["TERMO"],
        },
        { status: 400 },
      );
    }

    // Carregar valores das variáveis de ambiente
    const requestData = {
      ID_SYSTEM: envs.SYSTEM_ID,
      ID_LOJA: envs.STORE_ID,
      ID_USUARIO: envs.USER_ID,
      TERMO: body.TERMO,
    };

    const result = await checkService.tskCheckIfCpfExist(requestData);

    // Processar o resultado do serviço
    try {
      const data = result.data as [CheckResultData[], FeedbackData[], unknown];
      const idCheck = data[0][0]?.ID_CHECK;
      const feedback = data[1][0]?.pl_feedback;

      // ID_CHECK = 1 significa que o termo existe
      const exists = idCheck === 1;

      return NextResponse.json({
        success: true,
        exists: exists,
        message:
          feedback ||
          (exists
            ? "CPF encontrado na base de dados"
            : "CPF não encontrado na base de dados"),
        statusCode: result.statusCode,
      });
    } catch (processingError) {
      console.error("Erro ao processar resultado:", processingError);
      return NextResponse.json({
        success: false,
        message: "Erro ao processar resultado da verificação",
        rawResult: result,
      });
    }
  } catch (error) {
    console.error("Erro ao verificar CPF:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
