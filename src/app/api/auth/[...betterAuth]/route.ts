// app/api/auth/[...betterAuth]/route.ts
import { auth } from "@/utils/auth";

export const { GET, POST } = auth.api;
