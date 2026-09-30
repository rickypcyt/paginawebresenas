import { NextResponse } from "next/server";
import { rateLimit, rateLimitResponse, withErrorHandler } from "@/lib/api-utils";

const NOMINATIM_UA =
  process.env.NOMINATIM_USER_AGENT || "paginawebresenas/1.0";

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.slice(0, 200);

  if (!q) {
    return NextResponse.json({ error: "Query requerida" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "anonymous";
  if (!rateLimit(`geocode:${ip}`, 5, 60_000)) {
    return rateLimitResponse();
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`,
    {
      headers: { "User-Agent": NOMINATIM_UA },
      signal: AbortSignal.timeout(8000),
    }
  );

  if (!res.ok) {
    console.error("Nominatim error:", res.status);
    return NextResponse.json(
      { error: "El servicio de geocodificación falló" },
      { status: 502 }
    );
  }

  const data = await res.json();
  return NextResponse.json({ results: data });
});
