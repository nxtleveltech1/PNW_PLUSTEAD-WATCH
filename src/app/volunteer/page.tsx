import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { prisma } from "@/lib/db";
import { VolunteerForm } from "./volunteer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  patroller: "border-l-primary",
  "block-captain": "border-l-accent",
  coordinator: "border-l-emerald-500",
  committee: "border-l-amber-500",
};

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
        accent="warm"
      />

      <AnimateSection className="mt-section">
        <div className="flex flex-wrap gap-4">
          <AnimateItem className="card-stat">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">80+</p>
              <p className="text-sm text-muted-foreground">Active patrollers</p>
            </div>
          </AnimateItem>
          <AnimateItem className="card-stat">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">2007</p>
              <p className="text-sm text-muted-foreground">Community impact</p>
            </div>
          </AnimateItem>
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section section-gradient-primary rounded-2xl px-6 py-8">
        <h2 className="block-title">Roles</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {ROLES.map((r) => (
            <AnimateItem key={r.id}>
              <Card className={`card-elevated border-0 border-l-[3px] ${ROLE_COLORS[r.id] ?? "border-l-primary"}`}>
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
          <Card className="card-elevated overflow-hidden border-0 border-t-[3px] border-t-accent">
            <CardHeader className="p-6 pb-2 sm:p-8 sm:pb-2">
              <CardTitle className="block-title text-xl">Apply to volunteer</CardTitle>
              <CardDescription>We&apos;ll be in touch to discuss how you can help.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 sm:p-8 sm:pt-4">
              <VolunteerForm zones={zones} />
            </CardContent>
          </Card>
        </AnimateItem>
      </AnimateSection>
    </PageShell>
  );
}
