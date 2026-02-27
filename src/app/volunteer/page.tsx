import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Volunteer Network</p>
          <h1 className="section-heading mt-2">Volunteer With Us</h1>
          <p className="section-subheading">Join 80+ patrollers and strengthen community safety in Plumstead.</p>
        </div>

        <section className="mt-12 flex flex-wrap gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card px-5 py-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">80+ patrollers</p>
              <p className="text-sm text-muted-foreground">Active volunteers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card px-5 py-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Since 2007</p>
              <p className="text-sm text-muted-foreground">Community impact</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-foreground">Roles</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ROLES.map((r) => (
              <Card key={r.id} className="border-0 shadow-elevation-1">
                <CardHeader>
                  <CardTitle className="font-display text-lg">{r.title}</CardTitle>
                  <CardDescription>{r.desc}</CardDescription>
                  <p className="text-sm text-muted-foreground">Time: {r.time}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <Card className="max-w-md border-0 shadow-elevation-2">
            <CardHeader>
              <CardTitle className="font-display text-xl">Apply to volunteer</CardTitle>
              <CardDescription>
                We&apos;ll be in touch to discuss how you can help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VolunteerForm zones={zones} />
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
