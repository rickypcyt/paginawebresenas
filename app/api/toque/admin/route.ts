import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-utils";
import { getAdminData } from "@/lib/toque-data";

export const GET = withErrorHandler(async () => {
  const data = await getAdminData();
  if (!data) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  return NextResponse.json(data);
});
