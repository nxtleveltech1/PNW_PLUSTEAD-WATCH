import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { AdminIncidentForm } from "../../incident-form";

export default async function AdminEditIncidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) notFound();

  const zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });

  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/incidents">&lt;- Back</Link>
        </Button>
      </div>
      <h2 className="font-display text-xl font-semibold">Edit incident</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update incident details.
      </p>
      <div className="mt-6 max-w-md">
        <AdminIncidentForm
          zones={zones}
          incident={{
            id: incident.id,
            type: incident.type,
            location: incident.location,
            dateTime: incident.dateTime,
            zoneId: incident.zoneId,
          }}
        />
      </div>
    </section>
  );
}
