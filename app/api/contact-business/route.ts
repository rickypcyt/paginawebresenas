import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;

    if (!body.businessName || !body.contactName || !body.email) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
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

    const to = process.env.CONTACT_EMAIL || "rickypcyt@gmail.com";
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@descubreloc.al";

    const html = `
      <h1>Nueva solicitud de NFCs para negocio</h1>
      <p><strong>Nombre del negocio:</strong> ${escapeHtml(body.businessName)}</p>
      <p><strong>Nombre del contacto:</strong> ${escapeHtml(body.contactName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
      ${body.phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(body.phone)}</p>` : ""}
      ${body.category ? `<p><strong>Categoría:</strong> ${escapeHtml(body.category)}</p>` : ""}
      ${body.city ? `<p><strong>Ciudad:</strong> ${escapeHtml(body.city)}</p>` : ""}
      ${body.address ? `<p><strong>Dirección:</strong> ${escapeHtml(body.address)}</p>` : ""}
      ${body.message ? `<p><strong>Mensaje:</strong></p><p>${escapeHtml(body.message)}</p>` : ""}
    `;

    await transporter.sendMail({
      from,
      to,
      subject: `Solicitud de NFCs - ${body.businessName}`,
      text: `Nueva solicitud de NFCs para negocio.\n\nNegocio: ${body.businessName}\nContacto: ${body.contactName}\nEmail: ${body.email}${body.phone ? `\nTeléfono: ${body.phone}` : ""}${body.category ? `\nCategoría: ${body.category}` : ""}${body.city ? `\nCiudad: ${body.city}` : ""}${body.address ? `\nDirección: ${body.address}` : ""}${body.message ? `\nMensaje: ${body.message}` : ""}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando email de contacto:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
