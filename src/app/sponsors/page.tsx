import Link from "next/link";
import { ExternalLink, Handshake } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header-server";
import { prisma } from "@/lib/db";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Local Partners</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Sponsors and Security Partners</span>
            </h1>
            <p className="section-subheading">
              Organisations that support operational continuity and neighbourhood safety programs.
            </p>
          </div>
        </AnimateSection>

        {sponsors.length === 0 ? (
          <AnimateSection className="mt-10">
            <AnimateItem>
              <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
                No sponsors listed yet.
              </div>
            </AnimateItem>
          </AnimateSection>
        ) : (
          <AnimateSection className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sponsors.map((sponsor) => (
                <AnimateItem key={sponsor.id}>
                  <article className="card-elevated overflow-hidden rounded-2xl border-0 bg-card">
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

        <AnimateSection className="mt-10">
          <AnimateItem>
            <Link
              href="/contact"
              className="card-elevated flex items-center gap-4 rounded-2xl border-l-4 border-l-primary bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-6 md:flex-row md:justify-between"
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
              <span className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:mt-0">
                Contact us
              </span>
            </Link>
          </AnimateItem>
        </AnimateSection>
      </main>
      <Footer />
    </div>
  );
}
