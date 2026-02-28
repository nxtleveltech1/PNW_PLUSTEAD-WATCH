import Link from "next/link";
import { ExternalLink, Handshake } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { order: "asc" } });

  return (
    <PageShell>
      <PageHero
        eyebrow="Local Partners"
        title="Sponsors and Security Partners"
        description="Organisations that support operational continuity and neighbourhood safety programs."
      />
      {sponsors.length === 0 ? (
          <AnimateSection className="mt-section">
            <AnimateItem>
              <EmptyState
                icon={Handshake}
                heading="No sponsors listed yet"
                description="Interested in supporting community safety? Get in touch."
                actionLabel="Become a sponsor"
                actionHref="/contact"
              />
            </AnimateItem>
          </AnimateSection>
        ) : (
          <AnimateSection className="mt-section section-gradient-primary rounded-2xl px-6 py-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sponsors.map((sponsor) => (
                <AnimateItem key={sponsor.id}>
                  <article className={`card-elevated overflow-hidden rounded-2xl border-0 border-t-[3px] bg-card ${
                    sponsor.tier?.toLowerCase() === "gold" ? "border-t-amber-400" :
                    sponsor.tier?.toLowerCase() === "silver" ? "border-t-slate-400" :
                    sponsor.tier?.toLowerCase() === "bronze" ? "border-t-orange-400" :
                    "border-t-primary"
                  }`}>
                    <div className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-6 py-5">
                      <div className="flex items-start gap-3">
                        {sponsor.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            width={64}
                            height={64}
                            className="h-14 w-14 shrink-0 rounded-xl object-contain"
                          />
                        ) : (
                          <span className="icon-badge-primary">
                            <Handshake className="h-6 w-6" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-lg font-semibold">{sponsor.name}</p>
                            {sponsor.tier && (
                              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                                {sponsor.tier}
                              </span>
                            )}
                          </div>
                          {sponsor.content && (
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{sponsor.content}</p>
                          )}
                        </div>
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
                          Visit partner website
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">Community partner</p>
                      )}
                    </div>
                  </article>
                </AnimateItem>
              ))}
            </div>
          </AnimateSection>
        )}

        <AnimateSection className="mt-section">
          <AnimateItem>
            <Link
              href="/contact"
              className="card-featured flex items-center gap-4 rounded-2xl px-8 py-8 md:flex-row md:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="icon-badge-primary">
                  <Handshake className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">Become a sponsor</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Support patrol operations and community communications while building trusted local visibility.
                  </p>
                </div>
              </div>
              <span className="btn-glow mt-4 inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground md:mt-0">
                Contact us
              </span>
            </Link>
          </AnimateItem>
        </AnimateSection>
    </PageShell>
  );
}
