import { prisma } from "@/lib/db";
import { BroadcastForm } from "./broadcast-form";

export default async function AdminBroadcastPage() {
  const zones = await prisma.zone.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const sections = await prisma.street.findMany({
    where: { section: { not: null } },
    select: { section: true },
    distinct: ["section"],
    orderBy: { section: "asc" },
  });

  const uniqueSections = sections
    .map((s) => s.section)
    .filter((s): s is string => s !== null);

  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Broadcast Message</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Send a message to all members, or target a specific zone or section.
        Recipients will see it in their inbox.
      </p>

      <div className="mt-6 max-w-2xl">
        <BroadcastForm zones={zones} sections={uniqueSections} />
      </div>
    </section>
  );
}
