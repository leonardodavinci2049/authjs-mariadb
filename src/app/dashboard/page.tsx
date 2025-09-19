import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { UserClienteService } from "@/services/db/user-cliente.service";
import bookImg from "./book.png";

const MonthlyBook = async () => {
  // Proteção de rota movida para middleware - apenas buscar sessão para exibição
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se chegou aqui, middleware já garantiu que há sessão válida
  // Mas ainda verificamos por segurança
  const userName = session?.user?.name || "Usuário";

  // 🔗 NOVA FUNCIONALIDADE: Buscar dados do cliente
  const cliente = await UserClienteService.getClienteBySession(await headers());

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Livro do Mês</h1>
      <p className="mb-4 text-lg">Bem-vindo, {userName}!</p>

      {/* Exibir dados do cliente se encontrado */}
      {cliente && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-800">Dados do Cliente:</h3>
          <p className="text-blue-600">ID: {cliente.id}</p>
          <p className="text-blue-600">Nome: {cliente.nome}</p>
          <p className="text-blue-600">Email: {cliente.email}</p>
        </div>
      )}

      {!cliente && (
        <div className="mb-6 rounded-lg bg-yellow-50 p-4">
          <p className="text-yellow-800">
            ⚠️ Nenhum cliente associado a este usuário
          </p>
        </div>
      )}
      <Image src={bookImg} alt="Livro do mês" />
      <Link
        className={cn(
          "mt-10 flex items-center justify-center gap-4",
          buttonVariants(),
        )}
        href="/livro.pdf"
        target="_blank"
      >
        <Download className="h-4 w-4" /> Download do Pdf
      </Link>
    </>
  );
};

export default MonthlyBook;
