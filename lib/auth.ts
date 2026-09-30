import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

const betterAuthURL =
  process.env.BETTER_AUTH_URL || "http://localhost:3000";
const isSecureURL = betterAuthURL.startsWith("https");

// Orígenes extra de confianza vía env (ej. túnel ngrok en desarrollo), separados por coma.
const extraOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Google OAuth solo se registra si hay credenciales configuradas.
const googleCreds =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    : null;

export const auth = betterAuth({
  baseURL: betterAuthURL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  plugins: [dash()],
  socialProviders: {
    ...(googleCreds ? { google: googleCreds } : {}),
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    betterAuthURL,
    ...extraOrigins,
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
