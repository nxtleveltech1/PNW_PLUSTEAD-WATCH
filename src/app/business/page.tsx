import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { BusinessDirectoryFilters } from "./business-directory-filters";
import { Building2, ExternalLink, MapPin, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  RETAIL: "Retail",
  SERVICES: "Services",
  FOOD: "Food & Dining",
  HEALTH: "Health",
  OTHER: "Other",
};

export default async function BusinessDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; zone?: string; search?: string }>;
}) {
  const params = await searchParams;
  const { userId } = await auth();
  const where: Prisma.BusinessListingWhereInput = {
    status: "APPROVED",
  };

  if (params.category) where.category = params.category as "RETAIL" | "SERVICES" | "FOOD" | "HEALTH" | "OTHER";
  if (params.zone) where.zoneId = params.zone;
  if (params.search && params.search.length > 0) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [listings, zones] = await Promise.all([
    prisma.businessListing.findMany({
      where,
      include: { zone: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.zone.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Local Business Directory</p>
          <h1 className="section-heading mt-2">Business Advertising & Networking</h1>
          <p className="section-subheading">
            Discover and connect with local businesses that support the Plumstead community. List your business, network with residents, and grow together.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/business/events"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View events
            </Link>
            {userId && (
              <Link
                href="/business/messages"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </Link>
            )}
          </div>
        </div>

        <BusinessDirectoryFilters zones={zones} currentCategory={params.category} currentZone={params.zone} search={params.search} />

        {listings.length === 0 ? (
          <div className="panel mt-10 p-12 text-center text-muted-foreground">
            No businesses match your filters. Try adjusting your search or{" "}
            <Link href="/business/submit" className="font-semibold text-primary hover:underline">
              list your business
            </Link>
            .
          </div>
        ) : (
          <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/business/${listing.id}`}>
                <article className="panel group h-full transition-shadow hover:shadow-elevation-2">
                  <div className="panel-header">
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg font-semibold">{listing.name}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {CATEGORY_LABELS[listing.category] ?? listing.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4">
                    {listing.zone ? (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {listing.zone.name}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline">
                      View details
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}

        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-primary/5 p-6">
          <div>
            <p className="font-display text-xl font-semibold">List your business</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reach local residents and grow your visibility in the Plumstead community.
            </p>
          </div>
          <Link
            href="/business/submit"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Submit listing
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
