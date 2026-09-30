import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { AwsClient } from "aws4fetch";

/**
 * Almacenamiento de imágenes subidas por admin.
 *
 * Producción: cualquier bucket S3-compatible (Cloudflare R2, AWS S3, MinIO, B2)
 * configurado vía env vars. Se sube con un PUT firmado (SigV4) — sin SDK pesado.
 *
 *   S3_ENDPOINT          https://<account-id>.r2.cloudflarestorage.com
 *   S3_BUCKET            nombre del bucket
 *   S3_ACCESS_KEY_ID     access key
 *   S3_SECRET_ACCESS_KEY secret key
 *   S3_REGION            "auto" en R2, "us-east-1" etc. en AWS
 *   S3_PUBLIC_URL        base pública (dominio R2 público / CDN / bucket website)
 *
 * Desarrollo: si faltan las env vars, escribe en public/uploads (comportamiento
 * anterior). En producción sin bucket configurado lanza error a propósito —
 * el disco efímero perdería los archivos.
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const publicUrl = process.env.S3_PUBLIC_URL;

  const s3Ready =
    endpoint && bucket && accessKeyId && secretAccessKey && publicUrl;

  if (s3Ready) {
    const client = new AwsClient({
      accessKeyId,
      secretAccessKey,
      region: process.env.S3_REGION ?? "auto",
      service: "s3",
    });

    const key = `uploads/${filename}`;
    const res = await client.fetch(`${endpoint.replace(/\/$/, "")}/${bucket}/${key}`, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: new Uint8Array(buffer),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[storage] S3 PUT falló ${res.status}: ${body.slice(0, 300)}`);
      throw new Error("No se pudo subir la imagen al almacenamiento");
    }

    return `${publicUrl.replace(/\/$/, "")}/${key}`;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Storage no configurado: define S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY y S3_PUBLIC_URL"
    );
  }

  // Fallback de desarrollo: disco local.
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}
