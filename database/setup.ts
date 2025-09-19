import "dotenv/config";
import { DatabaseService } from "@/services/db/dbConnection";
import fs from "fs";
import path from "path";

async function setupDatabase() {
  const dbService = DatabaseService.getInstance();
  dbService.connect();

  try {
    // Ler o arquivo SQL de migration
    const migrationPath = path.join(
      process.cwd(),
      "better-auth_migrations",
      "2025-09-19T12-04-03.334Z.sql",
    );
    const sqlContent = fs.readFileSync(migrationPath, "utf8");

    // Dividir as queries por ponto e vírgula
    const queries = sqlContent
      .split(";")
      .map((query) => query.trim())
      .filter((query) => query.length > 0);

    console.log("Executando migrations do Better Auth...");

    for (const query of queries) {
      try {
        await dbService.ModifyExecute(query);
        console.log("✅ Query executada:", query.substring(0, 50) + "...");
      } catch (error: unknown) {
        // Ignorar erro se a tabela já existir
        if (
          error instanceof Error &&
          error.message.includes("already exists")
        ) {
          console.log("⚠️  Tabela já existe:", query.substring(0, 50) + "...");
        } else if (
          error &&
          typeof error === "object" &&
          "erroOriginal" in error
        ) {
          // Tratar erro customizado da classe ErroExecucaoConsulta
          const customError = error as { erroOriginal?: { message?: string } };
          if (customError.erroOriginal?.message?.includes("already exists")) {
            console.log(
              "⚠️  Tabela já existe:",
              query.substring(0, 50) + "...",
            );
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

    console.log("✅ Setup do banco concluído!");
  } catch (error) {
    console.error("❌ Erro no setup do banco:", error);
    throw error;
  } finally {
    await dbService.closeConnection();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  setupDatabase().catch(console.error);
}

export { setupDatabase };
