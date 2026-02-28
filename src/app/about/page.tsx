import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { prisma } from "@/lib/db";
import { Mail, Phone, Shield } from "lucide-react";

const partnerItems = [
  {
    title: "CVIC",
    description: "Constantia Valley Information Centre coordinates incident control.",
    contact: "0860 002 669",
  },
  {
    title: "SAPS Diep River",
    description: "Primary police partner for crime prevention and response.",
    contact: "10111",
  },
  {
    title: "DOCS",
    description: "Department of Community Safety accreditation and oversight.",
    contact: "Community Safety",
  },
];

export default async function AboutPage() {
  const committee = await prisma.committeeMember.findMany({ orderBy: { order: "asc" } });

  return (
    <PageShell>
      <PageHero
        eyebrow="Who We Are"
        title="Plumstead Neighbourhood Watch"
        description="Since 2007, residents have worked together to detect risk early, improve local awareness, and coordinate practical response with trusted partners."
      />

      <AnimateSection className="mt-section">
        <div className="grid gap-6 lg:grid-cols-3">
          <AnimateItem className="lg:col-span-2">
            <article className="card-elevated flex overflow-hidden rounded-2xl border-0 bg-card">
              <div className="w-1.5 shrink-0 rounded-l-2xl bg-gradient-to-b from-primary to-accent" />
              <div className="p-6 md:p-8">
                <h2 className="block-title">Mission</h2>
                <p className="mt-3 text-muted-foreground">
                  PNW exists to educate, empower, and activate residents so that Plumstead remains safer and
                  stronger. We connect local intelligence, trained volunteers, and formal agencies into one
                  coordinated community network.
                </p>
              </div>
            </article>
          </AnimateItem>
          <AnimateItem>
            <article className="card-elevated overflow-hidden rounded-2xl border-0 bg-card bg-gradient-to-br from-background to-primary/5 p-6">
              <h2 className="block-title">Operational Facts</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Founded: 2007</li>
                <li>Volunteer patrollers: 80+</li>
                <li>Primary control room: CVIC</li>
                <li>Accredited by DOCS</li>
              </ul>
            </article>
          </AnimateItem>
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section section-gradient-primary rounded-2xl px-6 py-8">
        <h2 className="section-title">
          <span className="headline-gradient">Partners</span>
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {partnerItems.map((partner) => (
            <AnimateItem key={partner.title}>
              <article className="card-elevated overflow-hidden rounded-2xl border-0 bg-card bg-gradient-to-b from-background to-primary/5 p-6">
                <p className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                  <Shield className="h-4 w-4 text-primary" />
                  {partner.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
                <p className="mt-2 text-sm font-semibold text-primary">{partner.contact}</p>
              </article>
            </AnimateItem>
          ))}
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section">
        <h2 className="section-title">
          <span className="headline-gradient">Executive Committee</span>
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {committee.map((member) => (
            <AnimateItem key={member.id}>
              <article className="card-elevated overflow-hidden rounded-2xl border-0 bg-card">
                <div className="panel-header bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    {member.role}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">{member.name}</p>
                </div>
                <div className="space-y-2 px-6 py-5 text-sm">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <Phone className="h-4 w-4 text-primary" />
                      {member.phone}
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-primary">
                      <Mail className="h-4 w-4 text-primary" />
                      {member.email}
                    </a>
                  )}
                </div>
              </article>
            </AnimateItem>
          ))}
        </div>
      </AnimateSection>
    </PageShell>
  );
}
