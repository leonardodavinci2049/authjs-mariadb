import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "./login-form";

export default async function LoginPage() {
  return (
    <>
      <Card className="mt-12 w-full max-w-sm rounded-2xl">
        <CardHeader>
          <h2 className="text-xl font-bold">Boas Vindas</h2>
          <CardDescription>Faça seu login com email e senha.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-3 text-sm">
        Não possui cadastro?{" "}
        <Link className="text-gray-800 hover:underline" href="/sign-up">
          Registre-se
        </Link>
        .
      </p>
    </>
  );
}
