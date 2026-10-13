import { NextResponse } from "next/server";
import {
  rateLimit,
  rateLimitResponse,
  requireSession,
  withErrorHandler,
} from "@/lib/api-utils";

// Solo hosts de Google Maps; evita usar el endpoint como proxy SSRF.
function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "maps.app.goo.gl" ||
    host === "goo.gl" ||
    host === "google.com" ||
    host.endsWith(".google.com") ||
    /^google\.[a-z.]{2,}$/.test(host) ||
    /^www\.google\.[a-z.]{2,}$/.test(host) ||
    /^maps\.google\.[a-z.]{2,}$/.test(host)
  );
}

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 8000;

// Sigue redirects manualmente revalidando el host en cada salto.
async function resolveFinalUrl(initialUrl: string): Promise<string | null> {
  let current = initialUrl;

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    let parsed: URL;
    try {
      parsed = new URL(current);
    } catch {
      return null;
    }
    if (parsed.protocol !== "https:" || !isAllowedHost(parsed.hostname)) {
      return null;
    }

    const res = await fetch(parsed, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    // No nos interesa el body — solo la URL final. Cancela el stream.
    if (res.body) await res.body.cancel().catch(() => {});

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return null;
      current = new URL(location, parsed).toString();
      continue;
    }

    if (!res.ok) return null;
    return res.url || current;
  }

  return null;
}

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ??
    "anonymous";
  if (!rateLimit(`import-gmaps:${result.session.user.id}:${ip}`, 20, 60_000)) {
    return rateLimitResponse();
  }

  const { url } = await request.json();

  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "URL requerida" }, { status: 400 });
  }

  const finalUrl = await resolveFinalUrl(url);
  if (!finalUrl) {
    return NextResponse.json(
      { error: "La URL no es un enlace de Google Maps válido" },
      { status: 400 }
    );
  }

  let latitude: number | null = null;
  let longitude: number | null = null;

  // Coordenadas exactas: !3dLAT!4dLNG
  const exactMatch = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (exactMatch) {
    latitude = parseFloat(exactMatch[1]);
    longitude = parseFloat(exactMatch[2]);
  } else {
    // Coordenadas aproximadas: @lat,lng
    const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      latitude = parseFloat(atMatch[1]);
      longitude = parseFloat(atMatch[2]);
    }
  }

  // Nombre del lugar desde /place/Nombre/
  const nameMatch = finalUrl.match(/\/place\/([^/@]+)/);
  const name = nameMatch
    ? decodeURIComponent(nameMatch[1].replace(/\+/g, " ")).replace(/_/g, " ")
    : null;

  return NextResponse.json({
    name,
    latitude,
    longitude,
    finalUrl,
  });
});
