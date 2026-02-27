import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { HeroClient } from "@/components/home/hero-client";
import { prisma } from "@/lib/db";
import { Phone, Shield, Calendar, AlertTriangle } from "lucide-react";

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
        <section className="relative min-h-[90vh] w-full overflow-hidden ambient-grid">
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
        <section className="relative border-b-2 border-accent/30 bg-gradient-to-r from-alert-muted via-alert-muted/95 to-alert-muted py-7">
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

        {/* Emergency + Banking: asymmetric grid */}
        <AnimateSection className="container py-24 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <AnimateItem>
              <Card className="card-elevated border-l-4 border-l-accent">
                <CardHeader className="border-b border-border/50 bg-gradient-to-br from-alert-muted/80 to-alert-muted/40 px-8 py-8">
                  <div className="flex items-center gap-5">
                    <span className="icon-badge-accent">
                      <Phone className="h-7 w-7" />
                    </span>
                    <div>
                      <CardTitle className="font-display text-2xl text-foreground">
                        Emergency contacts
                      </CardTitle>
                      <CardDescription className="mt-1 text-base">Report incidents and crimes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 px-8 py-8">
                  <div className="flex items-center justify-between rounded-xl bg-muted/60 px-5 py-4 transition-colors hover:bg-muted/80">
                    <span className="font-semibold">CVIC</span>
                    <a
                      href="tel:0860002669"
                      className="font-mono text-xl font-bold text-primary transition-colors hover:text-primary/80"
                    >
                      0860 002 669
                    </a>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/60 px-5 py-4 transition-colors hover:bg-muted/80">
                    <span className="font-semibold">SAPS</span>
                    <a
                      href="tel:10111"
                      className="font-mono text-xl font-bold text-primary transition-colors hover:text-primary/80"
                    >
                      10111
                    </a>
                  </div>
                </CardContent>
              </Card>
            </AnimateItem>
            <AnimateItem>
              <Card className="card-elevated border-l-4 border-l-primary">
                <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/10 to-primary/5 px-8 py-8">
                  <div className="flex items-center gap-5">
                    <span className="icon-badge-primary">
                      <Shield className="h-7 w-7" />
                    </span>
                    <div>
                      <CardTitle className="font-display text-2xl text-foreground">
                        Support our work
                      </CardTitle>
                      <CardDescription className="mt-1 text-base">Plumstead Neighbourhood Watch</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 px-8 py-8">
                  <div className="rounded-xl bg-muted/40 px-5 py-4 font-mono text-sm">
                    <p className="font-medium text-muted-foreground">Bank: FNB</p>
                    <p className="mt-1 text-lg font-bold text-foreground">ACC: 631 463 987 05</p>
                    <p className="text-muted-foreground">Code: 255355</p>
                  </div>
                  <Button asChild className="mt-2 font-semibold" size="lg">
                    <Link href="/donate">Donate now</Link>
                  </Button>
                </CardContent>
              </Card>
            </AnimateItem>
          </div>
        </AnimateSection>

        {/* Safety tips teaser */}
        {safetyTips.length > 0 && (
          <AnimateSection className="border-t border-border/60 bg-gradient-to-b from-muted/30 to-muted/10 py-24 lg:py-32">
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
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {safetyTips.map((tip) => (
                  <AnimateItem key={tip.id}>
                    <Link href={`/safety-tips/${tip.slug}`}>
                      <Card className="card-elevated group h-full">
                        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-6 py-6">
                          <div className="flex items-start gap-5">
                            <span className="icon-badge-primary group-hover:bg-primary/20 transition-colors">
                              <Shield className="h-6 w-6" />
                            </span>
                            <div className="min-w-0">
                              <CardTitle className="font-display text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                                {tip.title}
                              </CardTitle>
                              <CardDescription className="mt-2 line-clamp-2 text-sm">
                                {tip.summary ?? tip.content.slice(0, 80)}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between px-6 py-4">
                          <span className="text-sm font-semibold text-primary">Read more</span>
                          <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">-&gt;</span>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimateItem>
                ))}
              </div>
            </div>
          </AnimateSection>
        )}

        {/* Sponsors */}
        {sponsors.length > 0 && (
          <AnimateSection className="border-t border-border/60 bg-background py-16">
            <div className="container">
              <AnimateItem>
                <div className="glass-card rounded-2xl px-8 py-6">
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
        )}

        {/* Recent incidents */}
        <AnimateSection className="border-t border-border/60 bg-muted/40 py-24 lg:py-32">
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
            <div className="mt-14 space-y-4">
              {incidents.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border bg-background/80 py-20 text-center text-muted-foreground">
                  No incidents recorded yet.
                </div>
              ) : (
                incidents.map((inc) => (
                  <AnimateItem key={inc.id}>
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="group flex items-center gap-5 rounded-2xl border border-border/80 bg-card px-6 py-5 shadow-elevation-1 transition-all hover:border-primary/20 hover:shadow-elevation-2"
                    >
                      <span className="icon-badge-accent">
                        <AlertTriangle className="h-5 w-5" />
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

        {/* Upcoming events */}
        <AnimateSection className="container py-24 lg:py-32">
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
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <div className="col-span-full rounded-2xl border-2 border-dashed border-border bg-muted/20 py-20 text-center text-muted-foreground">
                No upcoming events.
              </div>
            ) : (
              events.map((ev) => (
                <AnimateItem key={ev.id}>
                  <Link href={`/events/${ev.id}`}>
                    <Card className="card-elevated group h-full">
                      <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-6 py-6">
                        <div className="flex items-start gap-5">
                          <span className="icon-badge-primary group-hover:bg-primary/20 transition-colors">
                            <Calendar className="h-6 w-6" />
                          </span>
                          <div className="min-w-0">
                            <CardTitle className="font-display text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                              {ev.title}
                            </CardTitle>
                            <CardDescription className="mt-2">{ev.location}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 py-5">
                        <p className="font-semibold text-primary">
                          {ev.startAt.toLocaleDateString("en-ZA", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimateItem>
              ))
            )}
          </div>
        </AnimateSection>
      </main>
      <Footer />
    </div>
  );
}
