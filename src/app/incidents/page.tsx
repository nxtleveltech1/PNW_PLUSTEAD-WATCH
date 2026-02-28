import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Incident Feed</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Recent Incidents</span>
            </h1>
            <p className="section-subheading">Incident activity reported in and around Plumstead.</p>
          </div>
        </AnimateSection>

        <Suspense fallback={null}>
          <IncidentsFilters zones={zones} currentZone={zoneId} currentType={typeFilter} />
        </Suspense>

        {user && (
          <AnimateSection className="mt-10">
            <AnimateItem>
              <Card className="card-elevated max-w-md border-0">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Report an incident</CardTitle>
                  <CardDescription>Help keep the community informed.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportIncidentForm />
                </CardContent>
              </Card>
            </AnimateItem>
          </AnimateSection>
        )}
        <AnimateSection className="mt-12">
          {incidents.length === 0 ? (
            <AnimateItem>
              <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
                No incidents recorded yet.
              </div>
            </AnimateItem>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <AnimateItem key={inc.id}>
                  <Link
                    href={`/incidents/${inc.id}`}
                    className="card-elevated group flex items-center gap-4 rounded-2xl border-0 bg-card px-5 py-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <AlertTriangle className="h-5 w-5 text-accent" />
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
      </main>
      <Footer />
    </div>
  );
}
