import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { prisma } from "@/lib/db";
import { Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
            <Card className="card-elevated border-0">
              <CardHeader className="p-6 md:p-8">
                <CardTitle className="block-title">Send a message</CardTitle>
                <CardDescription>We&apos;ll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
                <ContactForm />
              </CardContent>
            </Card>
          </AnimateItem>
          <div className="lg:col-span-4">
            <h2 className="section-title mb-6">
              <span className="headline-gradient">Executive committee</span>
            </h2>
            <div className="space-y-4">
              {committee.map((m) => (
                <AnimateItem key={m.id}>
                  <div className="card-elevated rounded-2xl border-0 bg-card p-6">
                    <p className="font-display font-semibold text-primary">{m.role}</p>
                    <p className="mt-1 font-medium">{m.name}</p>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {m.phone && (
                        <a
                          href={`tel:${m.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-2 transition-colors hover:text-foreground"
                        >
                          <Phone className="h-4 w-4" />
                          {m.phone}
                        </a>
                      )}
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="flex items-center gap-2 transition-colors hover:text-foreground"
                        >
                          <Mail className="h-4 w-4" />
                          {m.email}
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
        <div className="mt-6 card-elevated rounded-2xl border border-accent/20 bg-alert-muted/40 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {emergency.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-lg bg-background px-4 py-3"
              >
                <span className="font-medium">{e.service}</span>
                <a
                  href={`tel:${e.number.replace(/\s/g, "").replace(/\//g, "")}`}
                  className="font-mono font-semibold text-primary hover:underline"
                >
                  {e.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>
    </PageShell>
  );
}
