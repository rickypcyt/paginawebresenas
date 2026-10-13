import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { getCheckoutProduct, checkoutTotal, validQuantity, isPlan } from "@/lib/checkout";
import {
  createSession,
  placetopayMockMode,
} from "@/lib/placetopay";
import { withErrorHandler, rateLimit, rateLimitResponse } from "@/lib/api-utils";

function appBaseUrl(req: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    req.nextUrl.origin
  ).replace(/\/$/, "");
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const headersList = await headers();
  // Último IP de la cadena: el que añade el proxy confiable (el primero lo puede falsificar el cliente).
  const ip =
    headersList.get("x-forwarded-for")?.split(",").pop()?.trim() ??
    headersList.get("x-real-ip") ??
    "127.0.0.1";
  const userAgent = headersList.get("user-agent") ?? "Toque Checkout";

  if (!rateLimit(`checkout:${ip}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const productKey = typeof payload.product === "string" ? payload.product : undefined;
  const buyerName = typeof payload.buyerName === "string" ? payload.buyerName.trim().slice(0, 120) : "";
  const buyerEmail = typeof payload.buyerEmail === "string" ? payload.buyerEmail.trim().toLowerCase().slice(0, 254) : "";
  const buyerPhone = typeof payload.buyerPhone === "string" ? payload.buyerPhone.trim().slice(0, 40) : "";
  const businessName = typeof payload.businessName === "string" ? payload.businessName.trim().slice(0, 120) : "";
  const quantity = Number(payload.quantity ?? 1);

  const product = getCheckoutProduct(productKey);
  if (!product) {
    return NextResponse.json({ error: "Producto inválido" }, { status: 400 });
  }
  if (!validQuantity(product, quantity)) {
    return NextResponse.json(
      {
        error: `Cantidad de empleados inválida (rango: ${product.minEmployees}–${product.maxEmployees})`,
      },
      { status: 400 }
    );
  }
  if (!buyerName || !buyerEmail || !businessName) {
    return NextResponse.json(
      { error: "Nombre, email y negocio son obligatorios" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const reference = `TQ-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

  const baseUrl = appBaseUrl(req);
  const returnUrl = `${baseUrl}/checkout/confirmacion?reference=${reference}`;
  const currency = process.env.PLACETOPAY_CURRENCY ?? "USD";
  const total = checkoutTotal(product, quantity);
  const description = isPlan(product)
    ? `${product.name} · ${quantity} empleados`
    : product.name;

  const payment = await prisma.payment.create({
    data: {
      reference,
      product: product.product,
      description,
      quantity,
      amount: total,
      currency,
      buyerName,
      buyerEmail,
      buyerPhone: buyerPhone || null,
      businessName,
    },
  });

  if (placetopayMockMode()) {
    const requestId = `mock-${payment.id}`;
    const processUrl = `${baseUrl}/checkout/mock?reference=${reference}`;
    await prisma.payment.update({
      where: { id: payment.id },
      data: { requestId, processUrl },
    });
    return NextResponse.json({ processUrl, mock: true });
  }

  let session: Awaited<ReturnType<typeof createSession>>;
  try {
    session = await createSession({
      reference,
      description,
      total,
      currency,
      returnUrl,
      cancelUrl: returnUrl,
      ipAddress: ip,
      userAgent,
      buyer: { name: buyerName, email: buyerEmail, mobile: buyerPhone },
    });
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "failed" },
    });
    throw error;
  }

  if (!session.requestId || !session.processUrl) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "failed" },
    });
    return NextResponse.json(
      { error: "PlacetoPay devolvió una sesión incompleta" },
      { status: 502 }
    );
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      requestId: String(session.requestId),
      processUrl: session.processUrl,
    },
  });

  return NextResponse.json({ processUrl: session.processUrl });
});
