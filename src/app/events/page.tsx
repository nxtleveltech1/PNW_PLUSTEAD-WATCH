import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { Calendar, MapPin } from "lucide-react";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
    take: 50,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Community Calendar</p>
          <h1 className="section-heading mt-2">Events and Coordination Meetings</h1>
          <p className="section-subheading">
            Past and upcoming events for PNW and neighbouring community watch teams.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
              No events scheduled.
            </div>
          ) : (
            events.map((ev) => (
              <Link key={ev.id} href={`/events/${ev.id}`}>
                <div className="group h-full overflow-hidden rounded-xl border-0 bg-card shadow-elevation-1 transition-all hover:shadow-elevation-2">
                  <div className="border-b border-border/50 bg-primary/5 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                        <Calendar className="h-6 w-6 text-primary" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-display font-semibold leading-tight">{ev.title}</h2>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          {ev.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <p className="font-medium text-primary">
                      {ev.startAt.toLocaleDateString("en-ZA", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
