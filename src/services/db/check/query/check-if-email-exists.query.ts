import { CheckIfEmailExistsDto } from "../dto/check-if-email-exists.dto";

export function CheckIfEmailExistsQuery(
  dataJsonDto: CheckIfEmailExistsDto,
): string {
  const olIdSystem = dataJsonDto.ID_SYSTEM;
  const olIdLoja = dataJsonDto.ID_LOJA ?? 1;
  const olIdUsuario = dataJsonDto.ID_USUARIO;
  const termo = dataJsonDto.TERMO;

  const queryString = ` call sp_check_if_email_exists(
       ${olIdSystem},
       ${olIdLoja},
       ${olIdUsuario},
       '${termo}'
       ) `;

  return queryString;
}
