import { NextResponse } from "next/server";
import { getSession, AppSession } from "@/lib/session";
import { isAdmin } from "@/lib/roles";

export type RouteContext<T = Record<string, string>> = {
  params: Promise<T>;
};

export async function requireSession(): Promise<
  { session: NonNullable<AppSession> } | { error: NextResponse }
> {
  const session = await getSession();
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      ),
    };
  }
  return { session };
}

export async function requireAdmin(): Promise<
  { session: NonNullable<AppSession> } | { error: NextResponse }
> {
  const result = await requireSession();
  if ("error" in result) return result;
  if (!isAdmin(result.session.user.role)) {
    return {
      error: NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      ),
    };
  }
  return result;
}

type RouteHandler<TArgs extends unknown[] = unknown[]> = (
  ...args: TArgs
) => Promise<NextResponse> | NextResponse;

export function withErrorHandler<TArgs extends unknown[] = unknown[]>(
  handler: RouteHandler<TArgs>
): RouteHandler<TArgs> {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("[API Error]", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Error desconocido" },
        { status: 500 }
      );
    }
  };
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Inténtalo más tarde." },
    { status: 429 }
  );
}
