import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection } from "@/components/ui/animate-section";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, FileText, Settings, User } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { zone: true },
  });
  const [incidents, events, rsvps] = await Promise.all([
    prisma.incident.findMany({ orderBy: { dateTime: "desc" }, take: 5 }),
    prisma.event.findMany({
      where: { startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 5,
    }),
    user
      ? prisma.eventRsvp.findMany({
          where: { userId: user.id },
          include: { event: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : [],
  ]);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : "Member";

  return (
    <PageShell>
      <PageHero
        eyebrow="Member Console"
        title="Dashboard"
        description={`Welcome, ${displayName}. View live activity and operational updates.`}
      />

      <AnimateSection className="mt-section">
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="card-elevated rounded-2xl border-0 bg-card p-5">
            <h2 className="block-title">Recent incidents</h2>
            <div className="mt-4 space-y-3">
              {incidents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No incidents recorded.</p>
              ) : (
                incidents.map((inc) => (
                  <Link
                    key={inc.id}
                    href={`/incidents/${inc.id}`}
                    className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 transition-colors hover:border-primary/30"
                  >
                    <AlertTriangle className="h-5 w-5 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{inc.type}</p>
                      <p className="text-sm text-muted-foreground">{inc.location}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {inc.dateTime.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </span>
                  </Link>
                ))
              )}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/incidents">View all</Link>
            </Button>
          </section>

          <section className="card-elevated rounded-2xl border-0 bg-card p-5">
            <h2 className="block-title">Upcoming events</h2>
            <div className="mt-4 space-y-3">
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              ) : (
                events.map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.id}`}
                    className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 transition-colors hover:border-primary/30"
                  >
                    <Calendar className="h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{ev.title}</p>
                      <p className="text-sm text-muted-foreground">{ev.location}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {ev.startAt.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </span>
                  </Link>
                ))
              )}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/events">View all</Link>
            </Button>
          </section>
        </div>

        {rsvps.length > 0 && (
          <section className="mt-section">
            <h2 className="block-title">Your RSVPs</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {rsvps.map((r) => (
                <Link key={r.id} href={`/events/${r.event.id}`}>
                  <span className="inline-flex items-center rounded-full border bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                    {r.event.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {user?.role === "ADMIN" && (
          <div className="mt-block">
            <Button asChild>
              <Link href="/admin">Admin Console</Link>
            </Button>
          </div>
        )}

        <div className="mt-block flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm" className="min-h-[44px]">
            <Link href="/account">
              <User className="mr-2 h-4 w-4" />
              Account
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-h-[44px]">
            <Link href="/account/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-h-[44px]">
            <Link href="/documents">
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-h-[44px]">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </AnimateSection>
    </PageShell>
  );
}
