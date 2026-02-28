import Link from "next/link";
import { CheckCircle, HeartHandshake, Landmark, Shield } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { Button } from "@/components/ui/button";

export default function DonatePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Funding and Support"
        title="Support Frontline Community Safety"
        description="Donations help maintain patrol coordination, CCTV operations, communication tooling, and volunteer readiness for Plumstead."
        accent="warm"
      />

      <AnimateSection className="mt-section">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <AnimateItem>
            <article className="card-featured overflow-hidden rounded-2xl">
              <div className="h-2 bg-gradient-to-r from-primary via-primary/70 to-accent" />
              <div className="panel-header">
                <p className="inline-flex items-center gap-2 block-title">
                  <Landmark className="h-5 w-5 text-primary" />
                  Donation Banking Details
                </p>
              </div>
              <div className="space-y-4 p-6 md:p-8">
                <div className="rounded-xl bg-muted/45 px-5 py-4 font-mono text-sm">
                  <p className="text-muted-foreground">Account Name</p>
                  <p className="text-base font-semibold text-foreground">Plumstead Neighbourhood Watch</p>
                  <p className="mt-3 text-muted-foreground">Bank</p>
                  <p className="text-base font-semibold text-foreground">FNB</p>
                  <p className="mt-3 text-muted-foreground">Account Number</p>
                  <p className="text-base font-semibold text-foreground">631 463 987 05</p>
                  <p className="mt-3 text-muted-foreground">Branch Code</p>
                  <p className="text-base font-semibold text-foreground">255355</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Reference your street name or surname to help us reconcile contributions quickly.
                </p>
              </div>
            </article>
          </AnimateItem>
          <AnimateItem>
            <article className="card-elevated overflow-hidden rounded-2xl border-0 bg-card bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
              <p className="inline-flex items-center gap-2 block-title">
                <HeartHandshake className="h-5 w-5 text-primary" />
                Where Funding Goes
              </p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Patrol and response coordination</li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Community surveillance and monitoring coverage</li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Incident communications and outreach materials</li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Volunteer training and operations support</li>
              </ul>
              <div className="critical-strip mt-5">
                Every contribution helps maintain faster, safer local response capacity.
              </div>
            </article>
          </AnimateItem>
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section section-gradient-muted rounded-2xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <AnimateItem>
            <article className="card-elevated overflow-hidden rounded-2xl border-0 bg-card bg-gradient-to-b from-background to-primary/5 p-6">
              <p className="inline-flex items-center gap-2 block-title">
                <Shield className="h-5 w-5 text-primary" />
                Sponsor Partnerships
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Businesses can support patrol logistics, outreach programs, and safety campaigns while
                increasing local visibility.
              </p>
              <Button asChild className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/sponsors">View sponsors</Link>
              </Button>
            </article>
          </AnimateItem>
          <AnimateItem>
            <article className="card-elevated overflow-hidden rounded-2xl border-0 bg-card bg-gradient-to-b from-background to-accent/5 p-6">
              <p className="block-title">Need formal donation confirmation?</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Contact the committee and include the transfer date and reference to receive confirmation.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/contact">Contact committee</Link>
              </Button>
            </article>
          </AnimateItem>
        </div>
      </AnimateSection>
    </PageShell>
  );
}
