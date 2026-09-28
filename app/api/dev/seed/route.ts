import { NextResponse } from "next/server";
import { requireSession, withErrorHandler } from "@/lib/api-utils";
import { seedDemoDataForUser } from "@/lib/dev/demo-data";

export const POST = withErrorHandler(async () => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible" }, { status: 404 });
  }

  const result = await requireSession();
  if ("error" in result) return result.error;

  const summary = await seedDemoDataForUser(result.session.user.id);
  return NextResponse.json(summary);
});
