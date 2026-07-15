import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/dashboard", roles: ["business", "admin"] },
  { prefix: "/profile", roles: ["user", "business", "admin"] },
  { prefix: "/favorites", roles: ["user", "business", "admin"] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = protectedPaths.find((p) => pathname.startsWith(p.prefix));
  if (!match) return NextResponse.next();

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    const loginUrl = new URL("/home", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*", "/favorites/:path*"],
};
