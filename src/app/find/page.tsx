import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { FindZoneForm } from "./find-zone-form";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default async function FindPage() {
  const zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });

  return (
    <PageShell>
      <PageHero
        eyebrow="Locate"
        title="Find your zone"
        description="Enter your postal code or area to find your neighbourhood watch scheme."
      />

      <AnimateSection className="mt-section">
        <Card className="card-elevated max-w-md border-l-4 border-l-primary">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-6 md:px-8 md:py-8">
            <div className="flex items-center gap-5">
              <span className="icon-badge-primary">
                <MapPin className="h-7 w-7" />
              </span>
              <div>
                <CardTitle className="block-title text-foreground">Search by postal code</CardTitle>
                <CardDescription>e.g. 7800 for Plumstead</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6 md:px-8 md:py-8">
            <FindZoneForm zones={zones} />
          </CardContent>
        </Card>
      </AnimateSection>

      <AnimateSection className="mt-section">
        <h2 className="section-title">
          <span className="headline-gradient">All zones</span>
        </h2>
        <div className="mt-6 space-y-4">
          {zones.map((z) => (
            <AnimateItem key={z.id}>
              <div className="flex items-center justify-between rounded-2xl border border-border/60 border-l-4 border-l-primary bg-card px-6 py-5 shadow-[var(--shadow-elevation-1)] transition-all duration-200 hover:scale-[1.01] hover:border-primary/40 hover:shadow-[var(--shadow-elevation-2)]">
                <div>
                  <p className="font-semibold">{z.name}</p>
                  {z.postcodePrefix && (
                    <p className="text-sm text-muted-foreground">Postal code: {z.postcodePrefix}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/register?zone=${z.id}`}
                    className="flex min-h-[44px] items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5 hover:bg-accent/90 active:scale-[0.98]"
                  >
                    Join
                  </Link>
                  <Link
                    href="/start-scheme"
                    className="flex min-h-[44px] items-center rounded-xl border-2 border-border px-5 py-2.5 text-sm font-semibold transition-all hover:border-primary/30 hover:bg-muted active:scale-[0.98]"
                  >
                    Start scheme
                  </Link>
                </div>
              </div>
            </AnimateItem>
          ))}
        </div>
      </AnimateSection>
    </PageShell>
  );
}
