"use client";

import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            <Logo />
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
            <Button
              variant={"link"}
              className={cn(pathname === "/dashboard" ? "underline" : "")}
            >
              Livro do Mês
            </Button>
          </Link>
          <Link
            href="/dashboard/minha-assinatura"
            className="text-gray-700 hover:text-gray-900"
          >
            <Button
              variant={"link"}
              className={cn(
                pathname === "/dashboard/minha-assinatura" ? "underline" : "",
              )}
            >
              Minha Assinatura
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-700 hover:text-gray-900">
                <User size={24} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuLabel className="text-xs font-light uppercase">
                {userName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button onClick={handleLogout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
