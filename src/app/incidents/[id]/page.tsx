import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { prisma } from "@/lib/db";
import { AnimateSection } from "@/components/ui/animate-section";

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) notFound();

  return (
    <PageShell>
      <AnimateSection>
        <BreadcrumbNav
          items={[
            { label: "Incidents", href: "/incidents" },
            { label: incident.type },
          ]}
        />
        <article className="panel max-w-3xl">
          <div className="panel-header">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {incident.type}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {incident.location} -{" "}
              {incident.dateTime.toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">
              Incident detail logs are intentionally concise. For complete report data contact the control desk.
            </p>
          </div>
        </article>
      </AnimateSection>
    </PageShell>
  );
}
