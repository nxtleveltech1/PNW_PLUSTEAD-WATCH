import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Handshake,
  Landmark,
  Mail,
  Phone,
  Shield,
  TreePine,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Associations & Affiliations | Plumstead Neighbourhood Watch",
  description:
    "PNW works alongside civic associations to strengthen community safety, representation, and service delivery in Plumstead.",
};

const pcraCapabilities = [
  {
    icon: Users,
    title: "Represent Residents",
    description: "With City of Cape Town officials on community matters.",
  },
  {
    icon: Landmark,
    title: "Monitor Planning",
    description: "Zoning and development applications that affect Plumstead.",
  },
  {
    icon: Truck,
    title: "Traffic & Infrastructure",
    description: "Engage on traffic, road surfaces, and infrastructure issues.",
  },
  {
    icon: Shield,
    title: "Safety Partnerships",
    description: "Promote community safety alongside organisations like PNW.",
  },
  {
    icon: TreePine,
    title: "Environment",
    description: "Advocate for environmental responsibility in the suburb.",
  },
];

const pcraContacts = [
  {
    role: "General Enquiries",
    email: "info@pcra.co.za",
  },
  {
    role: "Escalations",
    email: "governance@pcra.co.za",
  },
  {
    role: "Chairperson",
    name: "Mark van Wyk",
    email: "mark.mjmotors@gmail.com",
    phone: "072 318 2431",
  },
  {
    role: "Secretary",
    name: "Carol Bew",
    email: "carolbbew@gmail.com",
    phone: "082 477 9444",
  },
];

export default function AssociationsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Our Network"
        title="Associations & Affiliations"
        description="PNW works alongside civic associations and partner organisations to strengthen community safety, representation, and service delivery in Plumstead."
      />

      {/* Relationship context */}
      <AnimateSection className="mt-section">
        <AnimateItem>
          <article className="flex overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-elevation-2)]">
            <div className="w-1.5 shrink-0 rounded-l-2xl bg-gradient-to-b from-primary to-accent" />
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="icon-badge-primary">
                  <Handshake className="h-6 w-6" />
                </div>
                <h2 className="block-title">Working Together</h2>
              </div>
              <p className="mt-4 text-muted-foreground">
                Plumstead&apos;s strength lies in the network of organisations
                that serve our community. While PNW focuses on safety
                coordination, patrol operations, and incident response, our
                affiliated associations address civic governance,
                infrastructure, and representation&mdash;ensuring residents have
                a unified voice across every area that matters.
              </p>
            </div>
          </article>
        </AnimateItem>
      </AnimateSection>

      {/* PCRA — Key Affiliate */}
      <AnimateSection className="mt-section">
        <h2 className="section-title">
          <span className="headline-gradient">Key Affiliate</span>
        </h2>

        <AnimateItem>
          <article className="card-featured mt-6">
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/8 to-accent/5 px-6 py-5 md:px-8 md:py-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="role-badge">Civic Association</span>
                  <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    Plumstead Civic Ratepayers Association
                  </h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    PCRA &middot; Est. 75+ years
                  </p>
                </div>
                <Button asChild size="sm" className="w-fit shrink-0">
                  <a
                    href="https://pcra.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8">
              <p className="text-muted-foreground">
                The PCRA represents the best interests of Plumstead and acts as
                a bridge between residents and City of Cape Town municipal
                authorities. They address concerns such as infrastructure and
                service delivery, safeguard community rights, and preserve the
                residential integrity that maintains the standards and values of
                the area.
              </p>

              <p className="mt-4 text-muted-foreground">
                Their goal is to create a strong, vibrant, and resilient
                community that stimulates an interest in civil affairs, enhancing
                the quality of life for all residents. PCRA membership is open to
                all Plumstead ratepayers at R100 per year.
              </p>

              {/* What PCRA does */}
              <div className="mt-8">
                <h4 className="block-title">What They Do</h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pcraCapabilities.map((cap) => (
                    <div
                      key={cap.title}
                      className="flex items-start gap-3 rounded-xl bg-muted/40 p-4 transition-colors hover:bg-muted/60"
                    >
                      <cap.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {cap.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why this partnership matters */}
              <div className="mt-8 rounded-xl border border-primary/15 bg-primary/5 p-5">
                <h4 className="text-sm font-semibold text-primary">
                  Why This Partnership Matters
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  PNW handles safety operations&mdash;patrols, incident
                  response, and CVIC coordination. PCRA handles civic
                  governance&mdash;rates, planning, infrastructure, and
                  municipal engagement. Together we cover both sides of
                  community wellbeing: security and civic representation.
                  Residents benefit from joining both organisations.
                </p>
              </div>

              <div className="divider-gradient my-6" />

              {/* PCRA Contacts */}
              <h4 className="block-title">PCRA Contacts</h4>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {pcraContacts.map((contact) => (
                  <div
                    key={contact.role}
                    className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-elevation-1)] transition-shadow hover:shadow-[var(--shadow-elevation-2)]"
                  >
                    <div className="px-4 pt-4 pb-3">
                      <span className="role-badge">{contact.role}</span>
                      {contact.name && (
                        <p className="mt-2 font-display text-base font-semibold">
                          {contact.name}
                        </p>
                      )}
                    </div>
                    <div className="border-t border-border/30 px-2 py-2">
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          className="contact-link"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-primary" />
                          {contact.phone}
                        </a>
                      )}
                      <a
                        href={`mailto:${contact.email}`}
                        className="contact-link"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{contact.email}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </AnimateItem>
      </AnimateSection>

      {/* CTA */}
      <AnimateSection className="mt-section">
        <AnimateItem>
          <div className="card-warm p-6 text-center md:p-8">
            <h2 className="block-title">Strengthen Our Community</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Active membership in both PNW and PCRA gives Plumstead residents
              full coverage&mdash;safety operations and civic representation
              working in concert.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href="/register">Join PNW</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://pcra.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join PCRA
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </AnimateItem>
      </AnimateSection>
    </PageShell>
  );
}
