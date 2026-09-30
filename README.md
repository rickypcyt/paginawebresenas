# Toque

Plataforma de reseñas por NFC. Un negocio coloca tags NFC físicos; el cliente acerca el teléfono, el tag abre un enlace y puede dejar una reseña — pública en Google o interna para el negocio/empleado.

## Stack

- **Next.js 16** (App Router, React Server Components, `after()`)
- **TypeScript** · Tailwind-style CSS variables (`app/globals.css`)
- **Prisma 7** + **Neon** (PostgreSQL serverless vía `@prisma/adapter-neon`)
- **Better Auth** (sesiones, Google OAuth, email/contraseña)
- **Nodemailer** (correos transaccionales: aprobación de empleados, contacto)
- **PlacetoPay WebCheckout** (pagos de tags y planes)
- **Three.js** (simulador 3D de los tags en el landing)
- Runtime de desarrollo: `bun run dev` o `npm run dev`

## Modelo de producto

Hay tres tipos de tags NFC (`NfcTag.type` en `prisma/schema.prisma`):

| Tipo | Qué hace al tocarlo |
|---|---|
| `business_google` | Redirige al enlace de reseña de Google del negocio (`googleReviewUrl`, o búsqueda de Google Maps como fallback). La reseña se publica en Google. |
| `business_review` | Redirige al formulario interno de reseña del negocio, sin empleado asociado. |
| `employee_review` | Redirige al formulario interno con el empleado preseleccionado — la reseña queda atribuida a esa persona. |

## Flujo NFC → reseña

El diseño evita que el enlace de un tag pueda compartirse para inflar reseñas.

1. **Tap**: el tag físico está programado con `https://<dominio>/nfc/<token>` donde `token` es un UUID único del `NfcTag`.
2. **`app/(app)/nfc/[token]/page.tsx`** (server component):
   - Un solo query: `nfcTag.findUnique` con el negocio y empleado asociados.
   - Si el tag no existe, está `active: false`, o su empleado está inactivo → 404.
   - `scanCount` se incrementa con `after()` de Next — **fuera del camino crítico**, el redirect no espera ese UPDATE.
   - Emite un **scan token firmado** (`lib/nfc-scan.ts`): `createScanToken(tagToken)` produce `tagToken.timestamp.hmacSHA256` con caducidad de **10 minutos**, firmado con `NFC_SCAN_SECRET` o `BETTER_AUTH_SECRET`.
   - Redirige según el tipo (ver tabla). Ej. empleado: `/business/<slug>/review?employee=<id>&nfc=<scanToken>`.
3. **Página de reseña** (`/business/[slug]/review`): formulario con nombre opcional para invitados, valoración con estrellas y texto. Funciona con o sin sesión.
4. **`POST /api/reviews`**:
   - `verifyScanToken(nfcToken)` valida firma y expiración. Si el link caducó o fue alterado → 403 "El enlace NFC expiró".
   - Del scan token se recupera el `tagToken` real (que nunca viaja en la URL compartible) y se valida que el tag exista, esté activo y pertenezca al negocio.
   - Crea la reseña con `verification: "nfc" | "qr" | "none"`, `userId` (si hay sesión) o `guestName`/`null` (anónimo).
   - `scanCount` se incrementa también al publicar.

Resultado: compartir el link no sirve — caduca en 10 min y el token real del tag nunca se expone en la URL.

## Roles y onboarding

Roles (`User.role`): `user`, `employee`, `business`, `admin`. Ojo: **el rol `employee` no implica ficha de `Employee`** — la ficha (vínculo usuario ↔ negocio) se crea al aprobar la solicitud.

- **Cliente**: puede reseñar sin cuenta (nombre opcional o anónimo). Si se registra desde el panel de reseña, queda como `user` sin onboarding de empresa.
- **Empleado**: desde `/employee/join` elige su negocio → crea `EmployeeJoinRequest` pendiente → pantalla de espera. El admin aprueba en `/admin` → se crea `Employee` + su tag NFC, `role` pasa a `employee` y se envía correo de bienvenida (`lib/email.ts`).
- **Negocio**: solicita alta en `/business-requests`; el admin lo aprueba.
- **Admin**: `/admin` gestiona usuarios, negocios, empleados (incluidos los de rol `employee` "sin asignar"), reseñas, pagos y tags NFC por negocio (`/admin/businesses/[id]`).

Autenticación: modal único (`components/auth/LoginModal.tsx`) — email+contraseña con auto-detección (login si existe, signup si no) o Google. Tras login, `/auth/redirect` decide el destino según rol/estado de solicitud.

## Pagos

Checkout en `/checkout?product=tag-a` o `?plan=…` → `POST /api/checkout` crea `Payment` + sesión PlacetoPay → retorno a `/checkout/confirmacion`. Webhook firmado: `POST /api/webhooks/placetopay`. Detalle en `AGENTS.md`.

## Desarrollo

```bash
bun run dev        # o npm run dev
```

Variables: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID/SECRET`, `SMTP_*`, `PLACETOPAY_*`, `NEXT_PUBLIC_APP_URL`.

### Cambios de schema

`prisma db push` **no funciona** aquí (Neon no expone 5432). Usa un script DDL con el driver serverless y regenera el cliente:

```bash
node scripts/apply-<nombre>-ddl.mjs
npx prisma generate
```

Reinicia el dev server tras regenerar — si Next cachea el cliente viejo, borra `.next`.
