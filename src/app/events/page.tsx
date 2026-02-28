import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { prisma } from "@/lib/db";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { Calendar, MapPin } from "lucide-react";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
    take: 50,
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Community Calendar"
        title="Events and Coordination Meetings"
        description="Past and upcoming events for PNW and neighbouring community watch teams."
      />

      <AnimateSection className="mt-section">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <AnimateItem className="col-span-full">
              <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
                No events scheduled.
              </div>
            </AnimateItem>
          ) : (
            events.map((ev) => (
              <AnimateItem key={ev.id}>
                <Link href={`/events/${ev.id}`} className="block h-full">
                  <div className="card-event group h-full">
                    <div className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-5 py-5">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                          <Calendar className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="font-display text-base font-semibold leading-tight transition-colors group-hover:text-primary">{ev.title}</h2>
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {ev.location}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-sm font-semibold text-primary">
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
              </AnimateItem>
            ))
          )}
        </div>
      </AnimateSection>
    </PageShell>
  );
}
