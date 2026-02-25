export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { MessageForm } from "./message-form";
import { Building2, ExternalLink, MapPin, Mail, Phone } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  RETAIL: "Retail",
  SERVICES: "Services",
  FOOD: "Food & Dining",
  HEALTH: "Health",
  OTHER: "Other",
};

export default async function BusinessListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const listing = await prisma.businessListing.findFirst({
    where: { id, status: "APPROVED" },
    include: { zone: { select: { id: true, name: true } } },
  });

  if (!listing) notFound();

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({ where: { clerkId: userId } });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link href="/business">&lt;- Back to directory</Link>
        </Button>

        <article className="panel max-w-3xl">
          <div className="panel-header">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-7 w-7 text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {listing.name}
                </h1>
                <p className="mt-1 text-sm font-medium text-primary">
                  {CATEGORY_LABELS[listing.category] ?? listing.category}
                </p>
                {listing.zone && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {listing.zone.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="whitespace-pre-wrap text-base leading-relaxed">{listing.description}</p>

            <div className="mt-6 flex flex-wrap gap-4">
              {listing.address && (
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {listing.address}
                </p>
              )}
              {listing.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {listing.phone}
                </a>
              )}
              <a
                href={`mailto:${listing.email}`}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {listing.email}
              </a>
              {listing.websiteUrl && (
                <a
                  href={listing.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Visit website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {user && (
              <div className="mt-8 flex flex-wrap gap-4 border-t border-border/60 pt-6">
                <MessageForm listingId={listing.id} listingName={listing.name} />
                <Button asChild variant="outline">
                  <Link href={`/business/referrals?listingId=${listing.id}`}>
                    Refer a friend
                  </Link>
                </Button>
              </div>
            )}

            {!user && (
              <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to message this business or refer a friend.
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
