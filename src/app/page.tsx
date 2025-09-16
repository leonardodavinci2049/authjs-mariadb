import PricingCard from "@/components/ui/pricing-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Check, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.svg";
import womanImg from "@/assets/woman.svg";
import ModeToggle from "@/components/ui/header-01/mode-toggle";
import { Suspense } from "react";

export default async function Home() {
  return (
    <main>
      <section className="container mx-auto px-2 pb-20 text-center md:px-0">
        <nav className="flex items-center justify-between py-4">
          <Image src={logo} alt="Logotipo" />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <MenuIcon size={24} className="cursor-pointer md:hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Preço</DropdownMenuItem>
              <a href={"/#funcionamento"}>
                <DropdownMenuItem>Funcionamento</DropdownMenuItem>
              </a>
              <DropdownMenuItem>Preço</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/sign-in">
                  <Button variant={"default"}>Login</Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden items-center gap-1 md:flex">
            <div className="mr-4 flex items-center gap-2">
              {" "}
              <Suspense>
                <ModeToggle />
              </Suspense>
            </div>
            <Link href={"#funcionamento"}>
              <Button variant={"link"}>Funcionamento</Button>
            </Link>
            <Link href={"#preco"}>
              <Button variant={"link"}>Preço</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant={"destructive"}>Login</Button>
            </Link>
          </div>
        </nav>
        <h1 className="mt-8 text-2xl font-bold md:mt-16 md:text-6xl">
          Simplifique Seus Estudos{" "}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-500 md:text-xl">
          Deixe que nós fazemos a curadoria para você. Assine nossa plataforma e
          receba todos os meses um ebook novo de programação.
        </p>
        <form className="mt-10 md:mt-16">
          <div className="flex justify-center gap-2">
            <Input
              placeholder="Coloque seu email"
              type="text"
              className="max-w-sm border border-gray-300"
            />
            <Button>Assine Agora</Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Comece sua assinatura agora mesmo. Cancele quando quiser.{" "}
          </p>
        </form>
      </section>
      <section className="bg-white py-8 md:py-16" id="funcionamento">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl font-bold md:text-4xl">
            Como funciona?
          </h2>
          <div className="mx-24 flex flex-col items-center justify-between md:flex-row xl:mx-80">
            <Image
              src={womanImg}
              alt="Mulher carregando caixas"
              className="max-w-xs"
            />
            <ul className="text-muted-foreground flex-shrink-0 space-y-4 text-lg md:space-y-6 md:text-2xl">
              <li className="flex items-center justify-between gap-4">
                Acesso a 1 ebook por mês{" "}
                <Check size={24} className="text-green-600" />
              </li>
              <li className="flex items-center justify-between gap-4">
                Curadoria especial
                <Check size={24} className="text-green-600" />
              </li>
              <li className="flex items-center justify-between gap-4">
                Cancele quando quiser
                <Check size={24} className="text-green-600" />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="px-2 py-8 text-center md:py-16" id="preco">
        <h2 className="text-2xl font-bold md:mt-16 md:text-6xl">
          Preço Simples e Transparente
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-500 md:text-xl">
          Pra que inúmeros planos quando nós sabemos exatamente o que é melhor
          para você? Assine o nosso plano mensal Pro Premium VIP e garanta
          mensalmente um ebook novo de programação. E por menos de um café por
          dia.
        </p>

        <div className="flex justify-center">
          <PricingCard />
        </div>
      </section>
      <section className="bg-white py-10 text-center md:py-16">
        <h2 className="text-2xl font-bold md:mt-16 md:text-6xl">
          Pronto Para Mudar Sua Vida?
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-500 md:text-xl">
          Faça como milhares de outras pessoas. Assine nosso produto e tenha
          garantido seus estudos{" "}
        </p>
        <Button className="mt-14 w-96">Assine Agora</Button>
        <p className="text-muted-foreground mt-2 text-xs">
          Comece sua assinatura agora mesmo. Cancele quando quiser.{" "}
        </p>
        <footer className="mt-16 border-t border-gray-300 pt-10">
          <Image src={logo} alt="Logotipo" className="mx-auto" />
          <p className="text-muted-foreground">
            © 2024 LivroSaaS. Todos os direitos reservados.
          </p>
        </footer>
      </section>
    </main>
  );
}
