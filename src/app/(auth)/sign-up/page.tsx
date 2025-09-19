import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import Link from "next/link";

import RegisterForm from "./register-form";

const RegisterPage = async () => {
  return (
    <>
      <Card className="mt-12 w-full max-w-sm rounded-2xl">
        <CardHeader>
          <h2 className="text-xl font-bold">Cadastre-se</h2>
          <CardDescription>Faça seu cadastro gratuitamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-3 text-sm">
        Já possui cadastro?{" "}
        <Link className="text-gray-800 hover:underline" href="/login">
          Faça o login
        </Link>
        .
      </p>
    </>
  );
};

export default RegisterPage;
