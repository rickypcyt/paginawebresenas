import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { OfferRedeemButton } from "./OfferRedeemButton";

interface OfferPageProps {
  params: Promise<{ id: string }>;
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { id } = await params;
  const session = await getSession();

  const offer = await prisma.offer.findUnique({
    where: { id },
    include: { business: { include: { category: true } } },
  });

  if (!offer) return notFound();

  const redeemed = session?.user?.id
    ? !!(await prisma.offerRedemption.findUnique({
        where: { userId_offerId: { userId: session.user.id, offerId: offer.id } },
      }))
    : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <p className="text-5xl">🎁</p>
        <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">{offer.title}</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">{offer.description}</p>

        <div className="mt-6 text-left text-sm text-[var(--foreground)]">
          <p className="font-medium">Negocio</p>
          <Link
            href={`/business/${offer.business.slug}`}
            className="text-[var(--primary)] hover:underline"
          >
            {offer.business.name}
          </Link>
        </div>

        {offer.conditions && (
          <div className="mt-4 text-left">
            <p className="text-sm font-medium text-[var(--foreground)]">Condiciones</p>
            <p className="text-sm text-[var(--muted-foreground)]">{offer.conditions}</p>
          </div>
        )}

        {offer.endDate && (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            Finaliza el {new Date(offer.endDate).toLocaleDateString("es-ES")}
          </p>
        )}

        <div className="mt-8">
          {session?.user ? (
            <OfferRedeemButton offerId={offer.id} redeemed={redeemed} />
          ) : (
            <Link
              href="/api/auth/signin"
              className="inline-block rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              Inicia sesión para reclamar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
