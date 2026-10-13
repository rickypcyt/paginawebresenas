import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import prisma from "@/lib/prisma";
import { requireSession, withErrorHandler, RouteContext } from "@/lib/api-utils";
import { uploadImage } from "@/lib/storage";
import { isAdmin } from "@/lib/roles";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 2 * 1024 * 1024;

function sniffType(buf: Buffer): keyof typeof ALLOWED_TYPES | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return "image/png";
  }
  if (buf.length >= 6 && buf.subarray(0, 6).toString("ascii") === "GIF87a") return "image/gif";
  if (buf.length >= 6 && buf.subarray(0, 6).toString("ascii") === "GIF89a") return "image/gif";
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

type Ctx = RouteContext<{ id: string }>;

async function canManageBusiness(userId: string, role: string, businessId: string) {
  if (isAdmin(role)) return true;
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true },
  });
  return business?.ownerId === userId;
}

export const POST = withErrorHandler(async (request: Request, { params }: Ctx) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { id } = await params;
  const { user } = result.session;

  if (!(await canManageBusiness(user.id, user.role, id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  const declared = ALLOWED_TYPES[file.type];
  if (!declared) {
    return NextResponse.json({ error: "Solo se permiten imágenes (jpg, png, webp, gif)" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "La imagen no puede superar 2 MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = sniffType(buffer);
  if (!detected || detected !== file.type) {
    return NextResponse.json({ error: "El contenido del archivo no coincide con una imagen válida" }, { status: 400 });
  }

  const filename = `${randomUUID()}.${declared}`;
  const url = await uploadImage(buffer, filename, file.type);

  await prisma.business.update({ where: { id }, data: { imageUrl: url } });

  return NextResponse.json({ url });
});
