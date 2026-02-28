import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Communications</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Contact the PNW Team</span>
            </h1>
            <p className="section-subheading">
              Committee contacts, emergency call points, and direct message submission.
            </p>
          </div>
        </AnimateSection>

        <AnimateSection className="mt-12">
          <AnimateItem>
            <Card className="card-elevated max-w-md border-0">
              <CardHeader>
                <CardTitle className="font-display text-xl">Send a message</CardTitle>
                <CardDescription>We&apos;ll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </AnimateItem>
        </AnimateSection>

        <AnimateSection className="mt-20">
          <AnimateItem>
            <h2 className="section-heading">
              <span className="headline-gradient">Executive committee</span>
            </h2>
          </AnimateItem>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {committee.map((m) => (
              <AnimateItem key={m.id}>
                <div className="card-elevated rounded-2xl border-0 bg-card p-5">
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
        </AnimateSection>

        <AnimateSection className="mt-20">
          <AnimateItem>
            <h2 className="section-heading">
              <span className="headline-gradient">Zone map</span>
            </h2>
          </AnimateItem>
          <p className="mt-2 text-sm text-muted-foreground">
            Plumstead is divided into sections. Select a section to highlight it on the map.
          </p>
          <div className="mt-6">
            <ZoneMap />
          </div>
        </AnimateSection>

        <AnimateSection className="mt-20">
          <AnimateItem>
            <h2 className="section-heading">
              <span className="headline-gradient">Emergency contacts</span>
            </h2>
          </AnimateItem>
          <AnimateItem className="mt-6">
          <div className="card-elevated rounded-2xl border border-accent/20 bg-alert-muted/40 p-6">
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
          </AnimateItem>
        </AnimateSection>
      </main>
      <Footer />
    </div>
  );
}
