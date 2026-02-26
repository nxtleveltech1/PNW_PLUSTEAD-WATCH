import { prisma } from "@/lib/db";
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
      <h2 className="font-display text-xl font-semibold">Incidents table</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        All incidents in the system. Click a row to view details.
      </p>
      <div className="mt-6">
        <IncidentsTable data={rows} />
      </div>
    </section>
  );
}
