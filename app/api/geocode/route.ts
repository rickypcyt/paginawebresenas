import { NextResponse } from "next/server";
import { rateLimit, rateLimitResponse } from "@/lib/api-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query requerida" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (!rateLimit(`geocode:${ip}`, 5, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`,
      {
        headers: {
          "User-Agent": "paginawebresenas/1.0 (contacto@example.com)",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Nominatim error:", res.status, text);
      return NextResponse.json(
        { error: "Error en Nominatim", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ results: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
