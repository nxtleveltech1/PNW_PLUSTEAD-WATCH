import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { prisma } from "@/lib/db";
import { VolunteerForm } from "./volunteer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield } from "lucide-react";

const ROLES = [
  { id: "patroller", title: "Patroller", desc: "Join our 80+ volunteer patrollers. Patrol your area, report incidents, support the community.", time: "Flexible" },
  { id: "block-captain", title: "Block captain", desc: "Liaison for 10-15 houses. Coordinate with neighbours and pass on updates.", time: "2-4 hrs/month" },
  { id: "coordinator", title: "Coordinator", desc: "Run a scheme or support multiple groups. Crime prevention, training, community resilience.", time: "4-8 hrs/month" },
  { id: "committee", title: "Committee", desc: "Chair, secretary, treasurer, or operations. Lead the organisation.", time: "Variable" },
];

export default async function VolunteerPage() {
  const zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });

  return (
    <PageShell>
      <PageHero
        eyebrow="Volunteer Network"
        title="Volunteer With Us"
        description="Join 80+ patrollers and strengthen community safety in Plumstead."
      />

      <AnimateSection className="mt-section">
        <div className="flex flex-wrap gap-4">
          <AnimateItem className="card-elevated flex items-center gap-3 rounded-2xl border-0 bg-card px-6 py-5">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">80+ patrollers</p>
              <p className="text-sm text-muted-foreground">Active volunteers</p>
            </div>
          </AnimateItem>
          <AnimateItem className="card-elevated flex items-center gap-3 rounded-2xl border-0 bg-card px-6 py-5">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Since 2007</p>
              <p className="text-sm text-muted-foreground">Community impact</p>
            </div>
          </AnimateItem>
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section">
        <h2 className="block-title">Roles</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {ROLES.map((r) => (
            <AnimateItem key={r.id}>
              <Card className="card-elevated border-0">
                <CardHeader className="p-6">
                  <CardTitle className="block-title">{r.title}</CardTitle>
                  <CardDescription>{r.desc}</CardDescription>
                  <p className="mt-2 text-sm text-muted-foreground">Time: {r.time}</p>
                </CardHeader>
              </Card>
            </AnimateItem>
          ))}
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section">
        <AnimateItem>
          <Card className="card-elevated max-w-md border-0">
            <CardHeader className="p-6">
              <CardTitle className="block-title">Apply to volunteer</CardTitle>
              <CardDescription>We&apos;ll be in touch to discuss how you can help.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <VolunteerForm zones={zones} />
            </CardContent>
          </Card>
        </AnimateItem>
      </AnimateSection>
    </PageShell>
  );
}
