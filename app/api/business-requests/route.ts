import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const requests = await prisma.businessRequest.findMany({
    where: { status: { not: "rejected" } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { supporters: true } },
      requester: { select: { name: true } },
      supporters: { select: { userId: true } },
    },
  });

  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { name, address, city, categoryId, categoryName, description } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const businessRequest = await prisma.businessRequest.create({
      data: {
        name: name.trim(),
        address: address?.trim() || null,
        city: city?.trim() || null,
        categoryId: categoryId || null,
        categoryName: categoryName?.trim() || null,
        description: description?.trim() || null,
        requesterId: session.user.id,
      },
    });

    return NextResponse.json({ businessRequest });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
