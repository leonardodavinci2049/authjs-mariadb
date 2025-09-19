import { DatabaseService } from "@/services/db/dbConnection";
import { auth } from "@/utils/auth";
import { RowDataPacket } from "mysql2/promise";

// Tipo para cliente/pessoa
export interface ClientePessoa extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  // Adicione outros campos conforme sua estrutura
}

// Tipo para count queries
interface CountResult extends RowDataPacket {
  count: number;
}

// Serviço para integração user <-> tbl_pessoa
export class UserClienteService {
  private static db = DatabaseService.getInstance();

  /**
   * Buscar dados do cliente baseado na sessão do Better Auth
   */
  static async getClienteBySession(
    headers: Headers,
  ): Promise<ClientePessoa | null> {
    try {
      // Buscar sessão do Better Auth
      const session = await auth.api.getSession({ headers });

      if (!session?.user?.email) {
        return null;
      }

      // Buscar cliente na tbl_pessoa pelo email
      const result = await this.db.selectExecute<ClientePessoa>(
        "SELECT * FROM tbl_pessoa WHERE email = ?",
        [session.user.email],
      );

      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar cliente por sessão:", error);
      return null;
    }
  }

  /**
   * Buscar dados do cliente pelo email do usuário logado
   */
  static async getClienteByEmail(email: string): Promise<ClientePessoa | null> {
    try {
      const result = await this.db.selectExecute<ClientePessoa>(
        "SELECT * FROM tbl_pessoa WHERE email = ?",
        [email],
      );

      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar cliente por email:", error);
      return null;
    }
  }

  /**
   * Criar usuário no Better Auth quando cliente se registra
   */
  static async criarUserParaCliente(clienteId: number): Promise<boolean> {
    try {
      // Buscar dados do cliente
      const cliente = await this.db.selectExecute<ClientePessoa>(
        "SELECT * FROM tbl_pessoa WHERE id = ?",
        [clienteId],
      );

      if (!cliente[0]) {
        return false;
      }

      // Criar usuário no Better Auth (se não existir)
      // Isso seria feito através do formulário de registro
      // que já está integrado com Better Auth

      return true;
    } catch (error) {
      console.error("Erro ao criar user para cliente:", error);
      return false;
    }
  }

  /**
   * Verificar se usuário tem cliente associado
   */
  static async hasClienteAssociado(email: string): Promise<boolean> {
    try {
      const result = await this.db.selectExecute<CountResult>(
        "SELECT COUNT(*) as count FROM tbl_pessoa WHERE email = ?",
        [email],
      );

      return result[0].count > 0;
    } catch (error) {
      console.error("Erro ao verificar cliente associado:", error);
      return false;
    }
  }
}
