import nodemailer from "nodemailer";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP no configurado; se omite el envío a", to);
    return;
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
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  await transporter.sendMail({ from, to, subject, html, text: text || html.replace(/<[^>]+>/g, " ") });
}

export function employeeApprovedEmail(name: string, businessName: string) {
  const safeName = escapeHtml(name);
  const safeBusiness = escapeHtml(businessName);
  return {
    subject: `¡Bienvenido a ${businessName}! Tu acceso fue aprobado`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h1 style="font-size:22px">Hola ${safeName},</h1>
        <p>Tu solicitud para unirte a <strong>${safeBusiness}</strong> fue <strong>aprobada</strong>.</p>
        <p>Ya puedes entrar a tu panel para ver tu tag NFC y tus valoraciones.</p>
        <p style="margin-top:24px;color:#666;font-size:13px">Si no esperabas este correo, puedes ignorarlo.</p>
      </div>
    `,
  };
}
