import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PageShell } from "@/components/layout/page-shell";
import { prisma } from "@/lib/db";
import { BusinessDirectoryFilters } from "./business-directory-filters";
import { BusinessDbUnavailable } from "./db-unavailable";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import {
  Building2,
  Calendar,
  ExternalLink,
  Handshake,
  MapPin,
  MessageSquare,
  Megaphone,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const hubNavLinks = [
  { href: "/business#directory", label: "Directory" },
  { href: "/business/events", label: "Events" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/business/submit", label: "List Business" },
  { href: `mailto:${ADVERTISE_EMAIL}?subject=${ADVERTISE_SUBJECT}`, label: "Advertise", external: true },
];

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
    <PageShell>
      {/* Hero with ambient gradient and headline */}
        <AnimateSection>
          <div className="hero-business px-6 py-8 md:px-8 md:py-10">
            <AnimateItem>
              <p className="eyebrow">Local Business Network</p>
              <h1 className="section-heading-gradient mt-2">Business Networking</h1>
              <p className="section-subheading mt-3">
                Discover and connect with local businesses that support the Plumstead community. List your business,
                network with residents, and grow together.
              </p>
              <nav
                className="mt-6 flex flex-wrap gap-2"
                aria-label="Business hub navigation"
              >
                {hubNavLinks.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="inline-flex items-center rounded-full border border-primary/30 bg-background/80 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/50"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="inline-flex items-center rounded-full border border-primary/30 bg-background/80 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/50"
                    >
                      {item.label}
                    </Link>
                  )
                )}
                {userId && (
                  <Link
                    href="/business/messages"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/80 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/50"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </Link>
                )}
              </nav>
            </AnimateItem>
          </div>
        </AnimateSection>

        {/* Sponsors — elevated card grid */}
        {sponsors.length > 0 && (
          <AnimateSection className="mt-section" aria-labelledby="sponsors-heading">
            <AnimateItem className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Community Partners
                </span>
                <h2 id="sponsors-heading" className="section-heading mt-2">
                  <span className="headline-gradient">Supported by</span>
                </h2>
              </div>
              <Link
                href="/sponsors"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all sponsors
              </Link>
            </AnimateItem>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sponsors.slice(0, 6).map((sponsor) => (
                <AnimateItem key={sponsor.id}>
                  <article className="card-elevated group h-full overflow-hidden rounded-2xl border-0 bg-card">
                    <div className="flex h-full flex-col">
                      <div className="flex flex-1 items-center justify-center gap-4 border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-6 py-6">
                        {sponsor.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            width={100}
                            height={50}
                            className="max-h-12 w-auto object-contain"
                          />
                        ) : (
                          <span className="icon-badge-primary">
                            <Handshake className="h-6 w-6" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-semibold">{sponsor.name}</p>
                          {sponsor.tier && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {sponsor.tier}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="px-6 py-4">
                        {sponsor.linkUrl ? (
                          <a
                            href={sponsor.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                          >
                            Visit partner
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">Community partner</span>
                        )}
                      </div>
                    </div>
                  </article>
                </AnimateItem>
              ))}
            </div>
            <AnimateItem className="mt-6">
              <Link
                href="/contact"
                className="card-elevated flex items-center gap-4 rounded-2xl border-l-4 border-l-primary bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-5"
              >
                <span className="icon-badge-primary">
                  <Handshake className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display font-semibold">Become a sponsor</p>
                  <p className="text-sm text-muted-foreground">
                    Support patrol operations and build trusted local visibility.
                  </p>
                </div>
                <span className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                  Contact us
                </span>
              </Link>
            </AnimateItem>
          </AnimateSection>
        )}

        {/* Featured local businesses */}
        {featuredListings.length > 0 && (
          <AnimateSection className="mt-section" id="featured" aria-labelledby="featured-heading">
            <AnimateItem>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Spotlight
              </span>
              <h2 id="featured-heading" className="section-heading mt-2">
                <span className="headline-gradient">Featured local businesses</span>
              </h2>
            </AnimateItem>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featuredListings.map((listing) => (
                <AnimateItem key={listing.id}>
                  <Link href={`/business/${listing.id}`} className="block h-full">
                    <article className="card-elevated group h-full overflow-hidden rounded-2xl border-0 bg-card">
                      <div className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-6 py-5">
                        <div className="flex items-start gap-3">
                          {listing.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={listing.logoUrl}
                              alt=""
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                          ) : (
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
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
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {listing.description}
                        </p>
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
                </AnimateItem>
              ))}
            </div>
          </AnimateSection>
        )}

        {/* Business Directory */}
        <AnimateSection className="mt-section" id="directory" aria-labelledby="directory-heading">
          <AnimateItem>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Browse
            </span>
            <h2 id="directory-heading" className="section-heading mt-2">
              <span className="headline-gradient">Business directory</span>
            </h2>
          </AnimateItem>
          <div className="mt-6">
            <BusinessDirectoryFilters
              zones={zones}
              currentCategory={params.category}
              currentZone={params.zone}
              search={params.search}
            />
          </div>

          {directoryListings.length === 0 ? (
            <AnimateItem>
              <div className="mt-6 rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 text-center">
                <Store className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <p className="mt-4 text-muted-foreground">
                  No businesses match your filters. Try adjusting your search or be the first to list.
                </p>
                <Button asChild className="mt-6" size="lg">
                  <Link href="/business/submit">List your business</Link>
                </Button>
              </div>
            </AnimateItem>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {directoryListings.map((listing) => (
                <AnimateItem key={listing.id}>
                  <Link href={`/business/${listing.id}`} className="block h-full">
                    <article className="card-elevated group h-full overflow-hidden rounded-2xl border-0 bg-card">
                      <div className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-6 py-5">
                        <div className="flex items-start gap-3">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-lg font-semibold">{listing.name}</p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {CATEGORY_LABELS[listing.category] ?? listing.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {listing.description}
                        </p>
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
                </AnimateItem>
              ))}
            </div>
          )}
        </AnimateSection>

        {/* Upcoming Events teaser */}
        {upcomingEvents.length > 0 && (
          <AnimateSection className="mt-section" aria-labelledby="events-heading">
            <AnimateItem className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="events-heading" className="section-heading">
                <span className="headline-gradient">Upcoming events</span>
              </h2>
              <Link
                href="/business/events"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all events
              </Link>
            </AnimateItem>
            <div className="mt-6 flex flex-col gap-3">
              {upcomingEvents.map((ev) => (
                <AnimateItem key={ev.id}>
                  <Link href={`/business/events/${ev.id}`} className="block">
                    <div className="card-elevated flex items-center justify-between rounded-2xl border-0 bg-card px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="icon-badge-primary">
                          <Calendar className="h-5 w-5" />
                        </span>
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
                </AnimateItem>
              ))}
            </div>
          </AnimateSection>
        )}

        {/* List your business CTA — card-elevated, icon-badge, gradient header */}
        <AnimateSection className="mt-section">
          <AnimateItem>
            <div className="card-elevated overflow-hidden rounded-2xl border-l-4 border-l-primary">
              <div className="border-b border-border/50 bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-6 md:flex md:items-center md:justify-between md:gap-6">
                <div className="flex items-start gap-4">
                  <span className="icon-badge-primary">
                    <Store className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold">List your business</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reach local residents and grow your visibility in the Plumstead community.
                    </p>
                  </div>
                </div>
                <Button asChild className="mt-4 md:mt-0" size="lg">
                  <Link href="/business/submit">Submit listing</Link>
                </Button>
              </div>
            </div>
          </AnimateItem>
        </AnimateSection>

        {/* Advertising CTA — card-elevated, icon-badge */}
        <AnimateSection className="mt-block">
          <AnimateItem>
            <div className="card-elevated overflow-hidden rounded-2xl border-l-4 border-l-accent">
              <div className="border-b border-border/50 bg-gradient-to-br from-alert-muted/80 to-alert-muted/40 px-6 py-6 md:flex md:items-center md:justify-between md:gap-6">
                <div className="flex items-start gap-4">
                  <span className="icon-badge-accent">
                    <Megaphone className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold">Advertise with PNW</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Support patrol logistics, outreach programs, and safety campaigns while building trusted local
                      visibility. Contact us to discuss advertising opportunities.
                    </p>
                  </div>
                </div>
                <a
                  href={`mailto:${ADVERTISE_EMAIL}?subject=${ADVERTISE_SUBJECT}`}
                  className="mt-4 inline-flex md:mt-0"
                >
                  <Button variant="outline" size="lg" className="border-2 border-primary/40 font-semibold">
                    Contact to advertise
                  </Button>
                </a>
              </div>
            </div>
          </AnimateItem>
        </AnimateSection>
    </PageShell>
  );
}
