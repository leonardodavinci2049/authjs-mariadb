import { CheckIfCnpjExistsDto } from "../dto/check-if-cnpj-exists.dto";

export function CheckIfCnpjExistsQuery(
  dataJsonDto: CheckIfCnpjExistsDto,
): string {
  const olIdSystem = dataJsonDto.ID_SYSTEM;
  const olIdLoja = dataJsonDto.ID_LOJA ?? 1;
  const olIdUsuario = dataJsonDto.ID_USUARIO;
  const termo = dataJsonDto.TERMO;

  const queryString = ` call sp_check_if_cnpj_exists(
       ${olIdSystem},
       ${olIdLoja},
       ${olIdUsuario},
       '${termo}'
       ) `;

  return queryString;
}
