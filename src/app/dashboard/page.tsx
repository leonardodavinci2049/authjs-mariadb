import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import bookImg from "./book.png";

const MonthlyBook = async () => {
  // Verificar se o usuário está autenticado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Livro do Mês</h1>
      <p className="mb-4 text-lg">Bem-vindo, {session.user.name}!</p>
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
