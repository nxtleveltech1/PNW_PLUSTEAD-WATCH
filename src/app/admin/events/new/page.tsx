import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminEventForm } from "../event-form";

export default function AdminNewEventPage() {
  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/events">&lt;- Back</Link>
        </Button>
      </div>
      <h2 className="font-display text-xl font-semibold">Create event</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a community event or coordination meeting.
      </p>
      <div className="mt-6 max-w-md">
        <AdminEventForm />
      </div>
    </section>
  );
}
