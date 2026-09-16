import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

const betterAuthURL =
  process.env.BETTER_AUTH_URL || "http://localhost:3000";
const isSecureURL = betterAuthURL.startsWith("https");

export const auth = betterAuth({
  baseURL: betterAuthURL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
  },
  plugins: [dash()],
  socialProviders: {},
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://efficient-multipolar-fritz.ngrok-free.dev",
    betterAuthURL,
  ],
  advanced: {
    cookies: {
      state: {
        attributes: {
          sameSite: isSecureURL ? "none" : "lax",
          secure: isSecureURL,
        },
      },
    },
  },
});
