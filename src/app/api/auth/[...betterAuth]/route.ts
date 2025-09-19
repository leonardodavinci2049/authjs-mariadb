// app/api/auth/[...betterAuth]/route.ts
import { auth } from "@/utils/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
