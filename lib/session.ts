import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
};

export type AppSession = { user: SessionUser; session: Record<string, unknown> } | null;

export async function getSession(): Promise<AppSession> {
  const h = await headers();
  const session = (await auth.api.getSession({ headers: h })) as AppSession;

  if (!session?.user?.id) return session;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  return {
    ...session,
    user: {
      ...session.user,
      role: dbUser?.role || "user",
    },
  };
}
