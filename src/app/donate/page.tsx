import Link from "next/link";
import { CheckCircle, HeartHandshake, Landmark, Shield } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";

const FUNDING_ITEMS = [
  "Patrol and response coordination",
  "Community surveillance and monitoring coverage",
  "Incident communications and outreach materials",
  "Volunteer training and operations support",
] as const;

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
            <article className="card-warm h-full">
              <div className="px-6 py-6 md:px-8">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <Landmark className="h-4 w-4" />
                  Banking Details
                </p>
                <h2 className="mt-2 block-title">Donation Transfer</h2>
              </div>
              <div className="px-6 pb-6 md:px-8 md:pb-8">
                <dl className="space-y-0">
                  <div className="detail-row">
                    <dt>Account name</dt>
                    <dd>Plumstead Neighbourhood Watch</dd>
                  </div>
                  <div className="detail-row">
                    <dt>Bank</dt>
                    <dd>FNB</dd>
                  </div>
                  <div className="detail-row">
                    <dt>Account number</dt>
                    <dd className="flex items-center gap-2">
                      <span className="font-mono text-lg">631 463 987 05</span>
                      <CopyButton value="6314639870 5" label="Account number copied" />
                    </dd>
                  </div>
                  <div className="detail-row">
                    <dt>Branch code</dt>
                    <dd className="font-mono">255355</dd>
                  </div>
                </dl>
                <p className="mt-5 rounded-xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  Reference your street name or surname to help us reconcile contributions quickly.
                </p>
              </div>
            </article>
          </AnimateItem>
          <AnimateItem>
            <article className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-elevation-2)] h-full">
              <div className="px-6 py-6">
                <p className="inline-flex items-center gap-2 block-title">
                  <HeartHandshake className="h-5 w-5 text-primary" />
                  Where Funding Goes
                </p>
              </div>
              <ul className="space-y-0 border-t border-border/30">
                {FUNDING_ITEMS.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 border-b border-border/20 px-6 py-4 text-sm text-muted-foreground last:border-b-0"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="px-6 pb-6">
                <div className="critical-strip">
                  Every contribution helps maintain faster, safer local response capacity.
                </div>
              </div>
            </article>
          </AnimateItem>
        </div>
      </AnimateSection>

      <AnimateSection className="mt-section">
        <div className="grid gap-6 md:grid-cols-2">
          <AnimateItem>
            <article className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-elevation-1)] transition-shadow duration-200 hover:shadow-[var(--shadow-elevation-2)] p-6">
              <p className="inline-flex items-center gap-2 block-title">
                <Shield className="h-5 w-5 text-primary" />
                Sponsor Partnerships
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Businesses can support patrol logistics, outreach programs, and safety campaigns while
                increasing local visibility.
              </p>
              <Button asChild className="mt-5 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/sponsors">View sponsors</Link>
              </Button>
            </article>
          </AnimateItem>
          <AnimateItem>
            <article className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-elevation-1)] transition-shadow duration-200 hover:shadow-[var(--shadow-elevation-2)] p-6">
              <p className="block-title">Need formal donation confirmation?</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Contact the committee and include the transfer date and reference to receive confirmation.
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link href="/contact">Contact committee</Link>
              </Button>
            </article>
          </AnimateItem>
        </div>
      </AnimateSection>
    </PageShell>
  );
}
