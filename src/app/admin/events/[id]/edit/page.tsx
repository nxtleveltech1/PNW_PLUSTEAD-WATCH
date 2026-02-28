import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { AdminEventForm } from "../../event-form";

export default async function AdminEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/events">&lt;- Back</Link>
        </Button>
      </div>
      <h2 className="font-display text-xl font-semibold">Edit event</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update event details.
      </p>
      <div className="mt-6 max-w-md">
        <AdminEventForm
          event={{
            id: event.id,
            title: event.title,
            location: event.location,
            startAt: event.startAt,
            endAt: event.endAt,
            content: event.content,
          }}
        />
      </div>
    </section>
  );
}
