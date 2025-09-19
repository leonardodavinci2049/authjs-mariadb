import { betterAuth } from "better-auth";
import { mysqlAdapter } from "./betterAuthAdapter";

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET!, // Gere algo seguro (openssl rand -base64 32)
  adapter: mysqlAdapter,
  emailAndPassword: true, // Habilita login com email/senha
});