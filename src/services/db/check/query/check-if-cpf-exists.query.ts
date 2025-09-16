import { CheckIfCpfExistsDto } from "../dto/check-if-cpf-exists.dto";

export function CheckIfCpfExistsQuery(
  dataJsonDto: CheckIfCpfExistsDto,
): string {
  const olIdSystem = dataJsonDto.ID_SYSTEM;
  const olIdLoja = dataJsonDto.ID_LOJA ?? 1;
  const olIdUsuario = dataJsonDto.ID_USUARIO;
  const termo = dataJsonDto.TERMO;

  const queryString = ` call sp_check_if_cpf_exists(
       ${olIdSystem},
       ${olIdLoja},
       ${olIdUsuario},
       '${termo}'
       ) `;

  return queryString;
}
