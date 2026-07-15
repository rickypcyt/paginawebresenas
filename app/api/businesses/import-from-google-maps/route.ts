import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      redirect: "follow",
    });

    const finalUrl = response.url;

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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
