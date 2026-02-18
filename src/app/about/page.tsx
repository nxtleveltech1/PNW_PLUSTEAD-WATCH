import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Who We Are</p>
          <h1 className="section-heading mt-2">
            <span className="headline-gradient">Plumstead Neighbourhood Watch</span>
          </h1>
          <p className="section-subheading">
            Since 2007, residents have worked together to detect risk early, improve local awareness, and
            coordinate practical response with trusted partners.
          </p>
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="panel overflow-hidden lg:col-span-2">
            <div className="h-2 bg-gradient-to-r from-primary via-primary/70 to-accent" />
            <div className="p-6">
            <h2 className="font-display text-xl font-semibold">Mission</h2>
            <p className="mt-3 text-muted-foreground">
              PNW exists to educate, empower, and activate residents so that Plumstead remains safer and
              stronger. We connect local intelligence, trained volunteers, and formal agencies into one
              coordinated community network.
            </p>
            </div>
          </article>
          <article className="panel bg-gradient-to-br from-background to-primary/5 p-6">
            <h2 className="font-display text-xl font-semibold">Operational Facts</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Founded: 2007</li>
              <li>Volunteer patrollers: 80+</li>
              <li>Primary control room: CVIC</li>
              <li>Accredited by DOCS</li>
            </ul>
          </article>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">
            <span className="headline-gradient">Partners</span>
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {partnerItems.map((partner) => (
              <article key={partner.title} className="panel bg-gradient-to-b from-background to-primary/5 p-5">
                <p className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                  <Shield className="h-4 w-4 text-primary" />
                  {partner.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
                <p className="mt-2 text-sm font-semibold text-primary">{partner.contact}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">
            <span className="headline-gradient">Executive Committee</span>
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {committee.map((member) => (
              <article key={member.id} className="panel">
                <div className="panel-header">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">{member.role}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{member.name}</p>
                </div>
                <div className="space-y-2 px-6 py-5 text-sm">
                  {member.phone && (
                    <a href={`tel:${member.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-primary">
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
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
