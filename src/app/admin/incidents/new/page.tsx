import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { AdminIncidentForm } from "../incident-form";

export default async function AdminNewIncidentPage() {
  const zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });

  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/incidents">&lt;- Back</Link>
        </Button>
      </div>
      <h2 className="font-display text-xl font-semibold">Create incident</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add an incident (e.g. from SAPS or committee report).
      </p>
      <div className="mt-6 max-w-md">
        <AdminIncidentForm zones={zones} />
      </div>
    </section>
  );
}
