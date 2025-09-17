export interface AuthSignInDto {
  EMAIL: string;
  PASSWORD_MD5: string
}

// Função de validação para CNPJ
export function validateAuthSignInDto(data: unknown): AuthSignInDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação do EMAIL
  if (
    typeof dto.EMAIL !== "string" ||
    dto.EMAIL.trim() === "" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.EMAIL)
  ) {
    throw new Error("EMAIL deve ser um endereço de email válido");
  }

  // Validação da PASSWORD_MD5
  if (
    typeof dto.PASSWORD_MD5 !== "string" ||
    dto.PASSWORD_MD5.trim() === "" ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      dto.PASSWORD_MD5,
    )
  ) {
    throw new Error(
      "SENHA deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial",
    );
  }

  return {
    EMAIL: dto.EMAIL.trim(),
    PASSWORD_MD5: dto.PASSWORD_MD5.trim(),
  };
}
