import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-utils";
import { getEmployeeData } from "@/lib/toque-data";

export const GET = withErrorHandler(async () => {
  const data = await getEmployeeData();
  if (data === null) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  return NextResponse.json(data);
});
