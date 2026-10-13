import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-utils";
import { getOwnerData } from "@/lib/toque-data";

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId") ?? undefined;

  const data = await getOwnerData(businessId);
  if (data === null) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  return NextResponse.json(data);
});
