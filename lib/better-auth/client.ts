import { createAuthClient } from "better-auth/client";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/auth",
  plugins: [anonymousClient()],
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
