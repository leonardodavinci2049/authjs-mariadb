export interface CheckIfCpfExistsDto {
  ID_SYSTEM?: number;
  ID_LOJA: number;
  ID_USUARIO: number;
  TERMO: string;
}

// Função de validação para CPF
export function validateCheckIfCpfExistsDto(
  data: unknown,
): CheckIfCpfExistsDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  if (typeof dto.ID_LOJA !== "number" || dto.ID_LOJA <= 0) {
    throw new Error("ID_LOJA deve ser um número inteiro positivo");
  }

  if (typeof dto.ID_USUARIO !== "number" || dto.ID_USUARIO <= 0) {
    throw new Error("ID_USUARIO deve ser um número inteiro positivo");
  }

  if (typeof dto.TERMO !== "string" || dto.TERMO.trim() === "") {
    throw new Error("TERMO deve ser uma string válida não vazia");
  }

  return {
    ID_SYSTEM: dto.ID_SYSTEM ? Number(dto.ID_SYSTEM) : undefined,
    ID_LOJA: dto.ID_LOJA,
    ID_USUARIO: dto.ID_USUARIO,
    TERMO: dto.TERMO.trim(),
  };
}
