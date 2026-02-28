import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { HeroClient } from "@/components/home/hero-client";
import { CopyButton } from "@/components/ui/copy-button";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { Phone, HeartHandshake, Shield, Calendar, AlertTriangle } from "lucide-react";

export default async function HomePage() {
  const [incidents, events, safetyTips, sponsors] = await Promise.all([
    prisma.incident.findMany({
      orderBy: { dateTime: "desc" },
      take: 5,
    }),
    prisma.event.findMany({
      where: { startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 6,
    }),
    prisma.safetyTip.findMany({ orderBy: { order: "asc" }, take: 3 }),
    prisma.sponsor.findMany({ orderBy: { order: "asc" }, take: 3 }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1">
        {/* Hero: full viewport, refined gradient, motion */}
        <section className="relative min-h-[70svh] w-full overflow-hidden ambient-grid md:min-h-[80svh] lg:min-h-[calc(100svh-4.5rem)]">
          <Image
            src="/images/hero-2.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 hero-veil" />
          <div className="absolute -left-20 top-24 h-56 w-56 rounded-full bg-primary/30 blur-3xl" aria-hidden />
          <div className="absolute -right-24 bottom-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <HeroClient />
        </section>

        {/* Emergency alert: prominent, urgent */}
        <section className="relative border-b-2 border-accent/30 bg-gradient-to-r from-alert-muted via-alert-muted/95 to-alert-muted py-5">
          <div className="container">
            <p className="text-center text-lg font-bold tracking-wide text-accent md:text-xl">
              REPORT ALL INCIDENTS TO CVIC: 0860 002 669
            </p>
            <p className="mt-2 text-center text-sm text-accent/90">
              Report crimes to SAPS 10111 - Less reported incidents = fewer resources.{" "}
              <Link href="/safety-tips" className="font-semibold underline decoration-2 underline-offset-2 hover:no-underline">
                Safety tips
              </Link>
            </p>
          </div>
        </section>

        {/* Emergency + Support */}
        <AnimateSection className="section-gradient-muted py-14 lg:py-16">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
              <AnimateItem>
                <section className="card-urgent h-full">
                  <div className="px-6 py-6 md:px-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                      Emergency
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-foreground">
                      Report incidents &amp; crimes
                    </h3>
                  </div>
                  <div className="space-y-3 px-6 pb-6 md:px-8 md:pb-8">
                    <a href="tel:0860002669" className="phone-cta">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent">
                          <Phone className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="text-sm text-muted-foreground">CVIC &middot; 24hr Crime Reporting</span>
                          <span className="phone-cta-number block">0860 002 669</span>
                        </div>
                      </div>
                    </a>
                    <a href="tel:10111" className="phone-cta">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent">
                          <Phone className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="text-sm text-muted-foreground">SAPS Flying Squad</span>
                          <span className="phone-cta-number block">10111</span>
                        </div>
                      </div>
                    </a>
                    <p className="pt-1 text-xs text-muted-foreground">
                      Less reported incidents = fewer resources.{" "}
                      <Link href="/contact" className="font-semibold text-primary hover:underline">
                        All emergency numbers
                      </Link>
                    </p>
                  </div>
                </section>
              </AnimateItem>
              <AnimateItem>
                <article className="card-warm h-full">
                  <div className="px-6 py-6 md:px-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Support
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-foreground">
                      Fund community safety
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Plumstead Neighbourhood Watch
                    </p>
                  </div>
                  <div className="px-6 pb-6 md:px-8 md:pb-8">
                    <dl className="space-y-0">
                      <div className="detail-row">
                        <dt>Bank</dt>
                        <dd>FNB</dd>
                      </div>
                      <div className="detail-row">
                        <dt>Account</dt>
                        <dd className="flex items-center gap-2">
                          <span className="font-mono text-lg">631 463 987 05</span>
                          <CopyButton value="6314639870 5" label="Account number copied" />
                        </dd>
                      </div>
                      <div className="detail-row">
                        <dt>Branch code</dt>
                        <dd className="font-mono">255355</dd>
                      </div>
                    </dl>
                    <div className="mt-6 flex items-center gap-3">
                      <Button asChild size="lg" className="btn-glow flex-1 font-semibold">
                        <Link href="/donate">
                          <HeartHandshake className="mr-2 h-4 w-4" />
                          Donate now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </AnimateItem>
            </div>
          </div>
        </AnimateSection>

        <div className="divider-gradient" />

        {/* Safety tips teaser */}
        {safetyTips.length > 0 && (
          <AnimateSection id="safety-tips" className="section-bg-muted py-14 lg:py-16">
            <div className="container">
              <AnimateItem className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-widest text-primary">Resources</span>
                  <h2 className="section-heading mt-2">
                    <span className="headline-gradient">Safety tips</span>
                  </h2>
                  <p className="section-subheading">Crime prevention advice for your home and community</p>
                </div>
                <Button asChild variant="outline" size="lg" className="w-fit border-2 border-primary/40 font-semibold text-primary hover:bg-primary/10">
                  <Link href="/safety-tips">View all tips</Link>
                </Button>
              </AnimateItem>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {safetyTips.map((tip) => (
                  <AnimateItem key={tip.id}>
                    <Link href={`/safety-tips/${tip.slug}`}>
                      <div className="card-tip group h-full">
                        <div className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-5 py-5">
                          <div className="flex items-start gap-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                              <Shield className="h-5 w-5" />
                            </span>
                            <div className="min-w-0">
                              <p className="font-display text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                                {tip.title}
                              </p>
                              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                                {tip.summary ?? tip.content.slice(0, 80)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3">
                          <span className="text-sm font-semibold text-primary">Read more</span>
                          <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">&rarr;</span>
                        </div>
                      </div>
                    </Link>
                  </AnimateItem>
                ))}
              </div>
            </div>
          </AnimateSection>
        )}

        <div className="divider-gradient" />

        {/* Upcoming events */}
        <AnimateSection id="events" className="container py-14 lg:py-16">
          <AnimateItem className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Community</span>
              <h2 className="section-heading mt-2">
                <span className="headline-gradient">Upcoming events</span>
              </h2>
              <p className="section-subheading">Gatherings and meetings</p>
            </div>
            <Button asChild variant="outline" size="lg" className="w-fit border-2 border-primary/40 font-semibold text-primary hover:bg-primary/10">
              <Link href="/events">View all</Link>
            </Button>
          </AnimateItem>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon={Calendar} heading="No upcoming events" description="Check back soon for community events." />
              </div>
            ) : (
              events.map((ev) => (
                <AnimateItem key={ev.id}>
                  <Link href={`/events/${ev.id}`}>
                    <div className="card-event group h-full">
                      <div className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-5 py-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                            <span className="text-lg font-bold leading-none">
                              {ev.startAt.getDate()}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                              {ev.startAt.toLocaleDateString("en-ZA", { month: "short" })}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                              {ev.title}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">{ev.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-sm font-semibold text-primary">
                          {ev.startAt.toLocaleDateString("en-ZA", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </AnimateItem>
              ))
            )}
          </div>
        </AnimateSection>

        <div className="divider-gradient" />

        {/* Recent incidents */}
        <AnimateSection id="incidents" className="section-bg-accent py-14 lg:py-16">
          <div className="container">
            <AnimateItem className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Updates</span>
                <h2 className="section-heading mt-2">
                  <span className="headline-gradient">Recent incidents</span>
                </h2>
                <p className="section-subheading">Stay informed about local activity</p>
              </div>
              <Button asChild variant="outline" size="lg" className="w-fit border-2 border-primary/40 font-semibold text-primary hover:bg-primary/10">
                <Link href="/incidents">View all</Link>
              </Button>
            </AnimateItem>
            <div className="mt-8 space-y-3">
              {incidents.length === 0 ? (
                <EmptyState icon={AlertTriangle} heading="No incidents recorded" description="No recent incident reports." />
              ) : (
                incidents.map((inc) => (
                  <AnimateItem key={inc.id}>
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="card-incident group"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {inc.type}
                        </span>
                        <span className="text-muted-foreground"> - {inc.location}</span>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-muted-foreground">
                        {inc.dateTime.toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </Link>
                  </AnimateItem>
                ))
              )}
            </div>
          </div>
        </AnimateSection>

        {/* Sponsors */}
        {sponsors.length > 0 && (
          <>
          <div className="divider-gradient" />
          <AnimateSection id="sponsors" className="bg-background py-10 lg:py-12">
            <div className="container">
              <AnimateItem>
                <div className="glass-card rounded-xl px-6 py-5">
                  <p className="text-center text-sm font-medium text-muted-foreground">
                    Supported by{" "}
                    {sponsors.map((s, i) => (
                      <span key={s.id}>
                        {s.linkUrl ? (
                          <a href={s.linkUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary transition-colors hover:text-primary/80">
                            {s.name}
                          </a>
                        ) : (
                          <span className="font-semibold">{s.name}</span>
                        )}
                        {i < sponsors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    {" "} | <Link href="/sponsors" className="font-semibold text-primary hover:underline">View all sponsors</Link>
                  </p>
                </div>
              </AnimateItem>
            </div>
          </AnimateSection>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
