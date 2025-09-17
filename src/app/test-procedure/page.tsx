"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProcedureResult {
  success: boolean;
  timestamp: string;
  procedure: string;
  type: string;
  result: {
    success: boolean;
    statusCode: number;
    message: string;
    data: unknown;
    feedback: unknown;
    operationResult: unknown;
    recordCount: number;
    rawResult: unknown;
  };
  formattedResult: string;
}

const PROCEDURE_EXAMPLES = [
  {
    name: "Check CPF Exists",
    procedure: `CALL sp_check_if_cpf_exists_V2 (
  1, -- PE_SYSTEM_CLIENT_ID INT,
  1, -- PE_STORE_ID INT,	
  1, -- PE_APP_ID INT,	
  29014, --  PE_USER_ID INT                           
  UNIX_TIMESTAMP() -- PE_TERM VARCHAR(500)  
)`,
    type: "generic",
  },
  {
    name: "Update Password",
    procedure: `CALL sp_auth_update_password_v2(
  1, -- PE_SYSTEM_CLIENT_ID INT,
  1, -- PE_STORE_ID INT,
  2, -- PE_APP_ID INT,
  47513, -- PE_USER_ID INT,     
  MD5('CstH@2052') -- bcf05ec7cc74846c875217b4bf6418b6
)`,
    type: "generic",
  },
  {
    name: "Simple Data Query",
    procedure: "CALL sp_get_all_users()",
    type: "data",
  },
];

export default function TestProcedurePage() {
  const [procedure, setProcedure] = useState("");
  const [type, setType] = useState("generic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcedureResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeProcedure = async () => {
    if (!procedure.trim()) {
      setError("Por favor, insira uma procedure para testar");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/test-procedure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          procedure: procedure.trim(),
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro na requisição");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example: (typeof PROCEDURE_EXAMPLES)[0]) => {
    setProcedure(example.procedure);
    setType(example.type);
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">
          Teste de Procedures Genéricas
        </h1>
        <p className="text-gray-600">
          Interface para testar qualquer procedure MariaDB/MySQL de forma
          interativa
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Painel de Entrada */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da Procedure</CardTitle>
              <CardDescription>
                Insira a chamada da procedure e selecione o tipo de execução
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tipo de Execução */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tipo de Execução
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="generic">Generic (Padrão)</option>
                  <option value="data">Data Only</option>
                  <option value="modify">Modify (INSERT/UPDATE/DELETE)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {type === "generic" &&
                    "Para procedures com múltiplos resultsets"}
                  {type === "data" &&
                    "Para procedures que retornam apenas dados"}
                  {type === "modify" && "Para procedures de modificação"}
                </p>
              </div>

              {/* Procedure Input */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Procedure Call
                </label>
                <textarea
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  placeholder="CALL sp_example(1, 'parameter', UNIX_TIMESTAMP())"
                  className="h-32 w-full rounded-md border border-gray-300 p-3 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Botão de Execução */}
              <Button
                onClick={executeProcedure}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Executando..." : "Executar Procedure"}
              </Button>

              {/* Error Display */}
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exemplos */}
          <Card>
            <CardHeader>
              <CardTitle>Exemplos</CardTitle>
              <CardDescription>
                Clique em um exemplo para carregar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PROCEDURE_EXAMPLES.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example)}
                    className="w-full justify-start text-left"
                  >
                    <div>
                      <div className="font-medium">{example.name}</div>
                      <div className="text-xs text-gray-500">
                        Tipo: {example.type}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel de Resultado */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>
                {result
                  ? `Executado em ${new Date(result.timestamp).toLocaleString()}`
                  : "Resultado aparecerá aqui após execução"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {/* Status Summary */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        result.result.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.result.success ? "SUCESSO" : "ERRO"}
                    </div>
                    <span className="text-sm text-gray-600">
                      Código: {result.result.statusCode}
                    </span>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="mb-1 font-medium">Mensagem</h4>
                    <p className="rounded bg-gray-50 p-2 text-sm text-gray-700">
                      {result.result.message}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Registros:</span>{" "}
                      {result.result.recordCount}
                    </div>
                    <div>
                      <span className="font-medium">Tipo:</span> {result.type}
                    </div>
                  </div>

                  {/* Formatted Result */}
                  <div>
                    <h4 className="mb-2 font-medium">Resultado Formatado</h4>
                    <pre className="max-h-96 overflow-auto rounded bg-gray-900 p-3 text-xs whitespace-pre-wrap text-green-400">
                      {result.formattedResult}
                    </pre>
                  </div>

                  {/* Raw JSON */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium">
                      Ver JSON Completo
                    </summary>
                    <pre className="mt-2 max-h-64 overflow-auto rounded bg-gray-50 p-3 text-xs">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>Nenhum resultado ainda</p>
                  <p className="text-sm">
                    Execute uma procedure para ver o resultado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
