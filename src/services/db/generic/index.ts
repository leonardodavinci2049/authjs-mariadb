// Exportações principais do serviço genérico
export { default as genericService } from "./generic.service";
export { GenericService } from "./generic.service";

// Exportações de tipos e interfaces
export type {
  GenericSpFeedback,
  GenericSpOperationResult,
  GenericSpResult,
  GenericProcedureResponse,
  ProcedureExecutionConfig,
  ExtractDataType,
  ArrayProcedureResponse,
  ModifyProcedureResponse,
} from "./types/generic.types";

export {
  GENERIC_STATUS_CODES,
  ProcedureExecutionType,
} from "./types/generic.types";

// Exportações de utilitários
export { ResponseFormatter } from "./utils/response-formatter";
export { ProcedureValidator } from "./utils/procedure-validator";

// Re-exportação para compatibilidade com versões anteriores
export type { GenericSpFeedback as SpFeedback } from "./types/generic.types";
export type { GenericSpOperationResult as SpOperationResult } from "./types/generic.types";
