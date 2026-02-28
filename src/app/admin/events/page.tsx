import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { EventsTable } from "./events-table";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
  });

  const rows = events.map((ev) => ({
    id: ev.id,
    title: ev.title,
    location: ev.location,
    startAt: ev.startAt.toISOString(),
    endAt: ev.endAt?.toISOString() ?? null,
  }));

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Events</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage community events and coordination meetings.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">Create event</Link>
        </Button>
      </div>
      <div className="mt-6">
        <EventsTable data={rows} />
      </div>
    </section>
  );
}
