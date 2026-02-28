import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { prisma } from "@/lib/db";
import { parseIncidentsSearchParams } from "@/lib/search-params";
import { AlertTriangle } from "lucide-react";
import { ReportIncidentForm } from "./report-form";
import { IncidentsFilters } from "./incidents-filters";

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<{ zone?: string; type?: string }>;
}) {
  const { userId } = await auth();
  const user = userId ? await prisma.user.findUnique({ where: { clerkId: userId } }) : null;
  const { zone: zoneId, type: typeFilter } = await parseIncidentsSearchParams(searchParams);

  const zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });
  const incidents = await prisma.incident.findMany({
    where: {
      ...(zoneId ? { zoneId } : {}),
      ...(typeFilter ? { type: { contains: typeFilter, mode: "insensitive" } } : {}),
    },
    orderBy: { dateTime: "desc" },
    take: 50,
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Incident Feed"
        title="Recent Incidents"
        description="Incident activity reported in and around Plumstead."
      />

      <div className="mt-block">
        <Suspense fallback={null}>
          <IncidentsFilters zones={zones} currentZone={zoneId} currentType={typeFilter} />
        </Suspense>
      </div>

      {user && (
        <AnimateSection className="mt-block">
          <AnimateItem>
            <Card className="card-elevated max-w-md border-0">
              <CardHeader className="p-6">
                <CardTitle className="block-title">Report an incident</CardTitle>
                <CardDescription>Help keep the community informed.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ReportIncidentForm />
              </CardContent>
            </Card>
          </AnimateItem>
        </AnimateSection>
      )}

      <AnimateSection className="mt-section">
        {incidents.length === 0 ? (
          <AnimateItem>
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 py-20 text-center text-muted-foreground">
              No incidents recorded yet.
            </div>
          </AnimateItem>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <AnimateItem key={inc.id}>
                <Link
                  href={`/incidents/${inc.id}`}
                  className="card-incident group"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <AlertTriangle className="h-4 w-4 text-accent" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge variant="alert" className="mb-1">
                      {inc.type}
                    </Badge>
                    <p className="font-medium">{inc.location}</p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {inc.dateTime.toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Link>
              </AnimateItem>
            ))}
          </div>
        )}
      </AnimateSection>
    </PageShell>
  );
}
