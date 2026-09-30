import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, rateLimitResponse, withErrorHandler } from "@/lib/api-utils";

interface ContactBody {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  category?: string;
  city?: string;
  address?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Los headers de email no deben llevar saltos de línea (inyección de cabeceras).
function sanitizeHeader(text: string): string {
  return text.replace(/[\r\n]+/g, " ").slice(0, 200);
}

export const POST = withErrorHandler(async (request: Request) => {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "anonymous";
  if (!rateLimit(`contact-business:${ip}`, 3, 60_000)) {
    return rateLimitResponse();
  }

  const body = (await request.json()) as ContactBody;

  const businessName = clip(body.businessName, 120);
  const contactName = clip(body.contactName, 120);
  const email = clip(body.email, 200);

  if (!businessName || !contactName || !email) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("[contact-business] SMTP no configurado");
    return NextResponse.json(
      { error: "El servicio de contacto no está disponible" },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const html = `
    <h1>Nueva solicitud de NFCs para negocio</h1>
    <p><strong>Nombre del negocio:</strong> ${escapeHtml(businessName)}</p>
    <p><strong>Nombre del contacto:</strong> ${escapeHtml(contactName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${body.phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(clip(body.phone, 40))}</p>` : ""}
    ${body.category ? `<p><strong>Categoría:</strong> ${escapeHtml(clip(body.category, 80))}</p>` : ""}
    ${body.city ? `<p><strong>Ciudad:</strong> ${escapeHtml(clip(body.city, 80))}</p>` : ""}
    ${body.address ? `<p><strong>Dirección:</strong> ${escapeHtml(clip(body.address, 200))}</p>` : ""}
    ${body.message ? `<p><strong>Mensaje:</strong></p><p>${escapeHtml(clip(body.message, 4000))}</p>` : ""}
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `Solicitud de NFCs - ${sanitizeHeader(businessName)}`,
    text: `Nueva solicitud de NFCs para negocio.\n\nNegocio: ${businessName}\nContacto: ${contactName}\nEmail: ${email}${body.phone ? `\nTeléfono: ${clip(body.phone, 40)}` : ""}${body.category ? `\nCategoría: ${clip(body.category, 80)}` : ""}${body.city ? `\nCiudad: ${clip(body.city, 80)}` : ""}${body.address ? `\nDirección: ${clip(body.address, 200)}` : ""}${body.message ? `\nMensaje: ${clip(body.message, 4000)}` : ""}`,
    html,
  });

  return NextResponse.json({ success: true });
});

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
