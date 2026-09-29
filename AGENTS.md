<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Pagos (PlacetoPay WebCheckout)

- Checkout en `/checkout?product=tag-a` o `?plan=starter|business|business-plus|enterprise`.
- Flujo: formulario → `POST /api/checkout` → crea `Payment` + sesión PlacetoPay → redirige a `processUrl` → retorna a `/checkout/confirmacion?reference=…` (consulta estado real de la sesión).
- Webhook server-to-server: `POST /api/webhooks/placetopay` (firma SHA-1 verificada). Configurar esta URL en el panel de PlacetoPay.
- Catálogo de productos/precios: `lib/checkout.ts`. Cliente PlacetoPay: `lib/placetopay.ts`.
- Sin credenciales o con `PLACETOPAY_MOCK=true`, el checkout usa la pasarela simulada `/checkout/mock` (solo desarrollo).
- Env vars requeridas en producción: `PLACETOPAY_LOGIN`, `PLACETOPAY_TRANKEY`, `PLACETOPAY_BASE_URL` (`https://checkout-co.placetopay.dev` test / `https://checkout.placetopay.com` prod), `PLACETOPAY_CURRENCY` (default `USD`), `NEXT_PUBLIC_APP_URL`.

## Base de datos

- `prisma db push` no funciona en este entorno (el puerto 5432 de Neon no es alcanzable). Para cambios de schema: ejecutar DDL con el driver serverless — ver `scripts/apply-payment-ddl.mjs` como ejemplo — y luego `npx prisma generate`.
