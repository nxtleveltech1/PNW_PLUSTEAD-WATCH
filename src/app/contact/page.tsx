import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { prisma } from "@/lib/db";
import { Phone, Mail } from "lucide-react";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { ContactForm } from "./contact-form";
import { ZoneMap } from "@/components/contact/zone-map";

export default async function ContactPage() {
  const [committee, emergency] = await Promise.all([
    prisma.committeeMember.findMany({ orderBy: { order: "asc" } }),
    prisma.emergencyContact.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Communications"
        title="Contact the PNW Team"
        description="Committee contacts, emergency call points, and direct message submission."
      />

      <AnimateSection className="mt-section">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <AnimateItem className="lg:col-span-8">
            <section className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-elevation-2)]">
              <div className="p-6 md:p-8">
                <h2 className="block-title">Send a message</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <div className="border-t border-border/40 p-6 md:p-8">
                <ContactForm />
              </div>
            </section>
          </AnimateItem>
          <div className="lg:col-span-4">
            <h2 className="section-title mb-6">
              <span className="headline-gradient">Executive committee</span>
            </h2>
            <div className="space-y-3">
              {committee.map((m) => (
                <AnimateItem key={m.id}>
                  <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-elevation-1)] transition-shadow duration-200 hover:shadow-[var(--shadow-elevation-2)]">
                    <div className="px-5 pt-5 pb-4">
                      <span className="role-badge">{m.role}</span>
                      <p className="mt-2 font-display font-semibold">{m.name}</p>
                    </div>
                    <div className="border-t border-border/30 px-2 py-2">
                      {m.phone && (
                        <a
                          href={`tel:${m.phone.replace(/\s/g, "")}`}
                          className="contact-link"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-primary" />
                          {m.phone}
                        </a>
                      )}
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="contact-link"
                        >
                          <Mail className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">{m.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </AnimateItem>
              ))}
            </div>
          </div>
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section">
        <h2 className="section-title">
          <span className="headline-gradient">Zone map</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Plumstead is divided into sections. Select a section to highlight it on the map.
        </p>
        <div className="mt-6">
          <ZoneMap />
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section">
        <h2 className="section-title">
          <span className="headline-gradient">Emergency contacts</span>
        </h2>
        <div className="mt-6 card-urgent p-5 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {emergency.map((e) => (
              <a
                key={e.id}
                href={`tel:${e.number.replace(/\s/g, "").replace(/\//g, "")}`}
                className="phone-cta"
              >
                <span className="text-sm font-medium text-foreground">{e.service}</span>
                <span className="phone-cta-number whitespace-nowrap">{e.number}</span>
              </a>
            ))}
          </div>
        </div>
      </AnimateSection>
    </PageShell>
  );
}
