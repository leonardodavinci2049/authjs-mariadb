import "dotenv/config";
import { DatabaseService } from "@/services/db/dbConnection";
import { RowDataPacket } from "mysql2/promise";
import fs from "fs";
import path from "path";

interface MigrationFile {
  filename: string;
  filepath: string;
  timestamp: Date;
}

interface CountResult extends RowDataPacket {
  count: number;
}

class DatabaseMigrator {
  private db: DatabaseService;
  private migrationsDir: string;

  constructor() {
    this.db = DatabaseService.getInstance();
    this.migrationsDir = path.join(process.cwd(), "better-auth_migrations");
  }

  /**
   * Buscar todos os arquivos de migration disponíveis
   */
  private getMigrationFiles(): MigrationFile[] {
    if (!fs.existsSync(this.migrationsDir)) {
      console.log("📁 Pasta de migrations não encontrada");
      return [];
    }

    const files = fs
      .readdirSync(this.migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .map((filename) => {
        const filepath = path.join(this.migrationsDir, filename);
        // Extrair timestamp do nome do arquivo
        const timestampStr = filename.replace(".sql", "");
        const timestamp = new Date(timestampStr);

        return { filename, filepath, timestamp };
      })
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return files;
  }

  /**
   * Verificar se uma migration já foi executada
   */
  private async isMigrationExecuted(filename: string): Promise<boolean> {
    try {
      // Criar tabela de controle de migrations se não existir
      await this.db.ModifyExecute(`
        CREATE TABLE IF NOT EXISTS _better_auth_migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_filename (filename)
        )
      `);

      // Verificar se migration foi executada
      const result = await this.db.selectExecute<CountResult>(
        "SELECT COUNT(*) as count FROM _better_auth_migrations WHERE filename = ?",
        [filename],
      );

      return result[0].count > 0;
    } catch (error) {
      console.error("Erro ao verificar migration:", error);
      return false;
    }
  }

  /**
   * Marcar migration como executada
   */
  private async markMigrationAsExecuted(filename: string): Promise<void> {
    try {
      await this.db.ModifyExecute(
        "INSERT INTO _better_auth_migrations (filename) VALUES (?)",
        [filename],
      );
    } catch (error) {
      console.error("Erro ao marcar migration como executada:", error);
    }
  }

  /**
   * Executar uma migration específica
   */
  private async executeMigration(
    migrationFile: MigrationFile,
  ): Promise<boolean> {
    const { filename, filepath } = migrationFile;

    try {
      console.log(`🔄 Executando migration: ${filename}`);

      // Ler conteúdo do arquivo SQL
      const sqlContent = fs.readFileSync(filepath, "utf8");

      // Dividir as queries por ponto e vírgula
      const queries = sqlContent
        .split(";")
        .map((query) => query.trim())
        .filter((query) => query.length > 0);

      // Executar cada query
      for (const query of queries) {
        try {
          await this.db.ModifyExecute(query);
          console.log(`  ✅ Query executada: ${query.substring(0, 50)}...`);
        } catch (error: unknown) {
          // Ignorar erro se a tabela já existir
          if (this.isTableExistsError(error)) {
            console.log(`  ⚠️  Tabela já existe: ${query.substring(0, 50)}...`);
          } else {
            throw error;
          }
        }
      }

      // Marcar migration como executada
      await this.markMigrationAsExecuted(filename);
      console.log(`✅ Migration ${filename} executada com sucesso`);

      return true;
    } catch (error) {
      console.error(`❌ Erro ao executar migration ${filename}:`, error);
      return false;
    }
  }

  /**
   * Verificar se é erro de tabela já existente
   */
  private isTableExistsError(error: unknown): boolean {
    if (error instanceof Error && error.message.includes("already exists")) {
      return true;
    }

    if (error && typeof error === "object" && "erroOriginal" in error) {
      const customError = error as { erroOriginal?: { message?: string } };
      return (
        customError.erroOriginal?.message?.includes("already exists") || false
      );
    }

    return false;
  }

  /**
   * Executar todas as migrations pendentes
   */
  async runMigrations(): Promise<void> {
    console.log("🚀 Iniciando processo de migrations...");

    try {
      this.db.connect();

      const migrationFiles = this.getMigrationFiles();

      if (migrationFiles.length === 0) {
        console.log("📝 Nenhuma migration encontrada");
        return;
      }

      console.log(`📋 Encontradas ${migrationFiles.length} migration(s)`);

      let executedCount = 0;
      let skippedCount = 0;

      for (const migrationFile of migrationFiles) {
        const alreadyExecuted = await this.isMigrationExecuted(
          migrationFile.filename,
        );

        if (alreadyExecuted) {
          console.log(
            `⏭️  Migration ${migrationFile.filename} já foi executada`,
          );
          skippedCount++;
          continue;
        }

        const success = await this.executeMigration(migrationFile);
        if (success) {
          executedCount++;
        }
      }

      console.log("\n📊 Resumo das migrations:");
      console.log(`  ✅ Executadas: ${executedCount}`);
      console.log(`  ⏭️  Ignoradas: ${skippedCount}`);
      console.log("🎉 Processo de migrations concluído!");
    } catch (error) {
      console.error("❌ Erro no processo de migrations:", error);
      throw error;
    } finally {
      await this.db.closeConnection();
    }
  }

  /**
   * Listar status das migrations
   */
  async listMigrations(): Promise<void> {
    console.log("📋 Status das migrations:");

    try {
      this.db.connect();

      const migrationFiles = this.getMigrationFiles();

      if (migrationFiles.length === 0) {
        console.log("📝 Nenhuma migration encontrada");
        return;
      }

      for (const migrationFile of migrationFiles) {
        const executed = await this.isMigrationExecuted(migrationFile.filename);
        const status = executed ? "✅ Executada" : "⏳ Pendente";
        console.log(`  ${status} - ${migrationFile.filename}`);
      }
    } catch (error) {
      console.error("❌ Erro ao listar migrations:", error);
    } finally {
      await this.db.closeConnection();
    }
  }
}

// Função principal compatível com a versão anterior
async function setupDatabase(): Promise<void> {
  const migrator = new DatabaseMigrator();
  await migrator.runMigrations();
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "migrate";

  const migrator = new DatabaseMigrator();

  switch (command) {
    case "migrate":
    case "run":
      await migrator.runMigrations();
      break;

    case "status":
    case "list":
      await migrator.listMigrations();
      break;

    default:
      console.log("📖 Comandos disponíveis:");
      console.log(
        "  npx tsx database/setup-v2.ts migrate  # Executar migrations",
      );
      console.log("  npx tsx database/setup-v2.ts status   # Listar status");
      break;
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

export { setupDatabase, DatabaseMigrator };
