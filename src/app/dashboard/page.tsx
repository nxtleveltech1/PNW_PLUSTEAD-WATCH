import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Member Console</p>
          <h1 className="section-heading mt-2">Dashboard</h1>
          <p className="section-subheading">Welcome, {displayName}. View live activity and operational updates.</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-xl font-semibold">Recent incidents</h2>
            <div className="mt-4 space-y-2">
              {incidents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No incidents recorded.</p>
              ) : (
                incidents.map((inc) => (
                  <Link
                    key={inc.id}
                    href={`/incidents/${inc.id}`}
                    className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/30"
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

          <section>
            <h2 className="font-display text-xl font-semibold">Upcoming events</h2>
            <div className="mt-4 space-y-2">
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              ) : (
                events.map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.id}`}
                    className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/30"
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
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Your RSVPs</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {rsvps.map((r) => (
                <Link key={r.id} href={`/events/${r.event.id}`}>
                  <span className="inline-flex items-center rounded-full border bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {r.event.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {user?.role === "ADMIN" && (
          <div className="mt-8">
            <Button asChild>
              <Link href="/admin">Admin Console</Link>
            </Button>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/account">
              <User className="mr-2 h-4 w-4" />
              Account
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/account/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/documents">
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
