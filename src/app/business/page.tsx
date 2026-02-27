import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { BusinessDirectoryFilters } from "./business-directory-filters";
import { BusinessDbUnavailable } from "./db-unavailable";
import {
  Building2,
  Calendar,
  ExternalLink,
  Handshake,
  MapPin,
  MessageSquare,
  Megaphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  RETAIL: "Retail",
  SERVICES: "Services",
  FOOD: "Food & Dining",
  HEALTH: "Health",
  OTHER: "Other",
};

const ADVERTISE_EMAIL = "info@plumsteadwatch.org.za";
const ADVERTISE_SUBJECT = "Website%20advertising";

export default async function BusinessNetworkingHubPage({
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

  type ListingWithZone = Awaited<
    ReturnType<
      typeof prisma.businessListing.findMany<{
        include: { zone: { select: { id: true; name: true } } };
      }>
    >
  >[number];

  let listings: ListingWithZone[];
  let featuredListings: ListingWithZone[];
  type EventWithListing = Awaited<
    ReturnType<
      typeof prisma.businessEvent.findMany<{
        include: { listing: { select: { id: true; name: true } } };
      }>
    >
  >[number];

  let zones: Awaited<ReturnType<typeof prisma.zone.findMany>>;
  let sponsors: Awaited<ReturnType<typeof prisma.sponsor.findMany>>;
  let upcomingEvents: EventWithListing[];

  try {
    const now = new Date();
    const [listingsRes, featuredRes, zonesRes, sponsorsRes, eventsRes] = await Promise.all([
      prisma.businessListing.findMany({
        where,
        include: { zone: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.businessListing.findMany({
        where: { status: "APPROVED", featured: true },
        include: { zone: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.zone.findMany({ orderBy: { name: "asc" } }),
      prisma.sponsor.findMany({ orderBy: { order: "asc" } }),
      prisma.businessEvent.findMany({
        where: { startAt: { gte: now } },
        include: { listing: { select: { id: true, name: true } } },
        orderBy: { startAt: "asc" },
        take: 3,
      }),
    ]);
    listings = listingsRes;
    featuredListings = featuredRes;
    zones = zonesRes;
    sponsors = sponsorsRes;
    upcomingEvents = eventsRes;
  } catch {
    return <BusinessDbUnavailable />;
  }

  const nonFeaturedIds = new Set(featuredListings.map((l) => l.id));
  const directoryListings = listings.filter((l) => !nonFeaturedIds.has(l.id));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Local Business Network</p>
          <h1 className="section-heading mt-2">Business Networking</h1>
          <p className="section-subheading">
            Discover and connect with local businesses that support the Plumstead community. List your business, network
            with residents, and grow together.
          </p>
          <nav className="mt-6 flex flex-wrap gap-4" aria-label="Business hub navigation">
            <Link href="/business#directory" className="text-sm font-semibold text-primary hover:underline">
              Directory
            </Link>
            <Link href="/business/events" className="text-sm font-semibold text-primary hover:underline">
              Events
            </Link>
            <Link href="/sponsors" className="text-sm font-semibold text-primary hover:underline">
              Sponsors
            </Link>
            <Link href="/business/submit" className="text-sm font-semibold text-primary hover:underline">
              List Your Business
            </Link>
            <a
              href={`mailto:${ADVERTISE_EMAIL}?subject=${ADVERTISE_SUBJECT}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Advertise
            </a>
            {userId && (
              <Link
                href="/business/messages"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </Link>
            )}
          </nav>
        </div>

        {/* Featured Sponsors */}
        {sponsors.length > 0 && (
          <section className="mt-12" aria-labelledby="sponsors-heading">
            <h2 id="sponsors-heading" className="text-lg font-semibold text-muted-foreground">
              Supported by
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-6">
              {sponsors.slice(0, 6).map((sponsor) => (
                <span key={sponsor.id} className="flex items-center gap-2">
                  {sponsor.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      width={80}
                      height={40}
                      className="h-10 w-20 object-contain"
                    />
                  ) : null}
                  {sponsor.linkUrl ? (
                    <a
                      href={sponsor.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      {sponsor.name}
                    </a>
                  ) : (
                    <span className="font-semibold">{sponsor.name}</span>
                  )}
                </span>
              ))}
              <Link href="/sponsors" className="text-sm font-semibold text-primary hover:underline">
                View all sponsors
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <Handshake className="h-4 w-4" />
                Become a sponsor
              </Link>
            </div>
          </section>
        )}

        {/* Featured local businesses */}
        {featuredListings.length > 0 && (
          <section className="mt-12" id="featured" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="text-lg font-semibold text-muted-foreground">
              Featured local businesses
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featuredListings.map((listing) => (
                <Link key={listing.id} href={`/business/${listing.id}`}>
                  <article className="panel group h-full transition-shadow hover:shadow-elevation-2">
                    <div className="panel-header">
                      <div className="flex items-start gap-3">
                        {listing.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={listing.logoUrl}
                            alt=""
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                          </span>
                        )}
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
            </div>
          </section>
        )}

        {/* Business Directory */}
        <section className="mt-12" id="directory" aria-labelledby="directory-heading">
          <h2 id="directory-heading" className="text-lg font-semibold text-muted-foreground">
            Business directory
          </h2>
          <BusinessDirectoryFilters
            zones={zones}
            currentCategory={params.category}
            currentZone={params.zone}
            search={params.search}
          />

          {directoryListings.length === 0 ? (
            <div className="panel mt-6 p-12 text-center text-muted-foreground">
              No businesses match your filters. Try adjusting your search or{" "}
              <Link href="/business/submit" className="font-semibold text-primary hover:underline">
                list your business
              </Link>
              .
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {directoryListings.map((listing) => (
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
            </div>
          )}
        </section>

        {/* Upcoming Events teaser */}
        {upcomingEvents.length > 0 && (
          <section className="mt-12" aria-labelledby="events-heading">
            <h2 id="events-heading" className="text-lg font-semibold text-muted-foreground">
              Upcoming events
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {upcomingEvents.map((ev) => (
                <Link key={ev.id} href={`/business/events/${ev.id}`} className="block">
                  <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card px-4 py-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">{ev.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {ev.startAt.toLocaleDateString("en-ZA", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {ev.listing && ` · ${ev.listing.name}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">View</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/business/events" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              View all events
            </Link>
          </section>
        )}

        {/* List your business CTA */}
        <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-primary/5 p-6">
          <div>
            <p className="font-display text-xl font-semibold">List your business</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reach local residents and grow your visibility in the Plumstead community.
            </p>
          </div>
          <Link
            href="/business/submit"
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Submit listing
          </Link>
        </section>

        {/* Advertising CTA */}
        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-muted/30 p-6">
          <div className="flex items-start gap-3">
            <Megaphone className="h-8 w-8 shrink-0 text-primary" />
            <div>
              <p className="font-display text-xl font-semibold">Advertise with PNW</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Support patrol logistics, outreach programs, and safety campaigns while building trusted local visibility.
                Contact us to discuss advertising opportunities.
              </p>
            </div>
          </div>
          <a
            href={`mailto:${ADVERTISE_EMAIL}?subject=${ADVERTISE_SUBJECT}`}
            className="inline-flex rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Contact to advertise
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
