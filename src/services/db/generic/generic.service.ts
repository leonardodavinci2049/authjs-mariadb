import { SpResultData } from "../auth/types/auth.type";
import dbService from "../dbConnection";
import { MESSAGES, resultQueryData } from "../utils/global.result";
import { ResultModel } from "../utils/result.model";
import { RowDataPacket } from "mysql2";

// Imports dos novos arquivos organizados
import {
  GenericProcedureResponse,
  GenericSpResult,
  ArrayProcedureResponse,
  GENERIC_STATUS_CODES
} from "./types/generic.types";
import { ResponseFormatter } from "./utils/response-formatter";
import { ProcedureValidator } from "./utils/procedure-validator";

export class GenericService {
  /**
   * Método principal para executar qualquer procedure e retornar dados formatados
   * @param callProcedureString - String da chamada da procedure (ex: "CALL sp_test(1, 2)")
   * @returns Promise com resposta formatada da procedure
   */
  async executeGenericProcedure<T extends RowDataPacket = RowDataPacket>(
    callProcedureString: string,
  ): Promise<ArrayProcedureResponse<T>> {
    // Validação da entrada
    if (!ProcedureValidator.isValidProcedureCall(callProcedureString)) {
      return ResponseFormatter.formatErrorResponse(
        "Chamada de procedure inválida. Use o formato: CALL sp_name(params)",
        GENERIC_STATUS_CODES.VALIDATION_ERROR
      );
    }

    if (!ProcedureValidator.isSafeProcedureCall(callProcedureString)) {
      return ResponseFormatter.formatErrorResponse(
        "Chamada de procedure contém comandos não permitidos",
        GENERIC_STATUS_CODES.VALIDATION_ERROR
      );
    }

    try {
      // Sanitiza a chamada
      const sanitizedCall = ProcedureValidator.sanitizeProcedureCall(callProcedureString);
      
      const resultData = (await dbService.selectExecute(
        sanitizedCall,
      )) as GenericSpResult<T>;

      return ResponseFormatter.formatProcedureResponse(resultData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return ResponseFormatter.formatErrorResponse(errorMessage);
    }
  }

  /**
   * Executa procedure que retorna apenas dados (sem feedback estruturado)
   * @param callProcedureString - String da chamada da procedure
   * @returns Promise com dados da procedure
   */
  async executeDataProcedure<T extends RowDataPacket = RowDataPacket>(
    callProcedureString: string,
  ): Promise<ArrayProcedureResponse<T>> {
    // Validação da entrada
    if (!ProcedureValidator.isValidProcedureCall(callProcedureString)) {
      return ResponseFormatter.formatErrorResponse(
        "Chamada de procedure inválida. Use o formato: CALL sp_name(params)",
        GENERIC_STATUS_CODES.VALIDATION_ERROR
      );
    }

    try {
      const sanitizedCall = ProcedureValidator.sanitizeProcedureCall(callProcedureString);
      const resultData = (await dbService.selectExecute(sanitizedCall)) as T[];

      return ResponseFormatter.formatDataResponse(resultData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return ResponseFormatter.formatErrorResponse(errorMessage);
    }
  }

  /**
   * Executa procedure de modificação (INSERT/UPDATE/DELETE)
   * @param callProcedureString - String da chamada da procedure
   * @returns Promise com resultado da operação
   */
  async executeModifyProcedure(
    callProcedureString: string,
  ): Promise<GenericProcedureResponse<unknown>> {
    // Validação da entrada
    if (!ProcedureValidator.isValidProcedureCall(callProcedureString)) {
      return ResponseFormatter.formatErrorResponse(
        "Chamada de procedure inválida. Use o formato: CALL sp_name(params)",
        GENERIC_STATUS_CODES.VALIDATION_ERROR
      );
    }

    try {
      const sanitizedCall = ProcedureValidator.sanitizeProcedureCall(callProcedureString);
      const resultData = await dbService.ModifyExecute(sanitizedCall);

      return ResponseFormatter.formatModifyResponse(resultData as unknown as { affectedRows: number; [key: string]: unknown });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return ResponseFormatter.formatErrorResponse(errorMessage);
    }
  }

  /**
   * Método utilitário para formatar e exibir resultados de forma legível
   * @param response - Resposta da procedure
   * @returns String formatada para visualização
   */
  formatResponseForDisplay(
    response: GenericProcedureResponse<unknown>,
  ): string {
    return ResponseFormatter.formatForDisplay(response);
  }

  /**
   * Valida uma chamada de procedure sem executá-la
   * @param callProcedureString - String da chamada da procedure
   * @returns Objeto com resultado da validação
   */
  validateProcedureCall(callProcedureString: string): {
    isValid: boolean;
    isSafe: boolean;
    procedureName: string | null;
    errors: string[];
  } {
    const errors: string[] = [];
    
    const isValid = ProcedureValidator.isValidProcedureCall(callProcedureString);
    if (!isValid) {
      errors.push("Formato de chamada inválido. Use: CALL sp_name(params)");
    }

    const isSafe = ProcedureValidator.isSafeProcedureCall(callProcedureString);
    if (!isSafe) {
      errors.push("Chamada contém comandos não permitidos");
    }

    const procedureName = ProcedureValidator.extractProcedureName(callProcedureString);

    return {
      isValid,
      isSafe,
      procedureName,
      errors
    };
  }

  // Método legacy mantido para compatibilidade (agora usa o novo método)
  async tskGenericStoreProcedure(
    callProcedureString: string,
  ): Promise<ResultModel> {
    try {
      const response = await this.executeGenericProcedure(callProcedureString);

      // Converte para o formato legacy
      const recordId =
        response.feedback?.sp_return_id ||
        (response.data.length > 0
          ? (response.data[0] as RowDataPacket & { USER_ID?: number })
              ?.USER_ID || response.recordCount
          : 0);

      return resultQueryData<SpResultData>(
        recordId,
        response.success ? 0 : 1,
        response.message,
        response.rawResult as SpResultData,
        response.recordCount,
        "",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }
}

// Instância singleton do serviço genérico
const genericService = new GenericService();
export default genericService;