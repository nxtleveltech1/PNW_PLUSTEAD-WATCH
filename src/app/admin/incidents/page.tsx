import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { IncidentsTable } from "./incidents-table";

export default async function AdminIncidentsPage() {
  const incidents = await prisma.incident.findMany({
    orderBy: { dateTime: "desc" },
    include: { zone: { select: { name: true } } },
  });

  const rows = incidents.map((inc) => ({
    id: inc.id,
    type: inc.type,
    location: inc.location,
    dateTime: inc.dateTime.toISOString(),
    zoneName: inc.zone?.name ?? null,
  }));

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Incidents table</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All incidents in the system. Create, edit, or delete incidents.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/incidents/new">Create incident</Link>
        </Button>
      </div>
      <div className="mt-6">
        <IncidentsTable data={rows} />
      </div>
    </section>
  );
}
