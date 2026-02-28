export const dynamic = "force-dynamic";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { prisma } from "@/lib/db";
import { BusinessDbUnavailable } from "../db-unavailable";
import { Calendar, MapPin } from "lucide-react";

export default async function BusinessEventsPage() {
  let events;
  try {
    events = await prisma.businessEvent.findMany({
      include: { listing: { select: { id: true, name: true } } },
      orderBy: { startAt: "asc" },
      take: 50,
    });
  } catch {
    return <BusinessDbUnavailable />;
  }

  return (
    <PageShell>
      <BreadcrumbNav items={[{ label: "Business", href: "/business" }, { label: "Events" }]} />

      <div className="page-hero">
        <p className="eyebrow">Business events</p>
        <h1 className="section-heading mt-2">Networking & events</h1>
        <p className="section-subheading">
          Meetups, workshops, and events hosted by local businesses. Connect with the community and grow your network.
        </p>
      </div>

      <div className="mt-section grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
            No business events scheduled.
          </div>
        ) : (
          events.map((ev) => (
            <Link key={ev.id} href={`/business/events/${ev.id}`}>
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
                      {ev.listing && (
                        <p className="mt-1 text-xs text-primary">{ev.listing.name}</p>
                      )}
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
    </PageShell>
  );
}
