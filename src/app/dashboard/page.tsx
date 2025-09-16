import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import bookImg from "./book.png";

const MonthlyBook = () => {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Livro do Mês</h1>
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
