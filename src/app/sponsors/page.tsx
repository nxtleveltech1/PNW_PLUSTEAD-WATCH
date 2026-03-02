import { Handshake } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { SponsorShowcase } from "@/components/sponsors/sponsor-showcase";
import { AdvertisingPackages } from "@/components/sponsors/advertising-packages";

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { order: "asc" } });

  return (
    <PageShell>
      <PageHero
        eyebrow="Local Partners"
        title="Sponsors and Security Partners"
        description="Organisations that support operational continuity and neighbourhood safety programs."
      />

      {sponsors.length === 0 ? (
        <AnimateSection className="mt-section">
          <AnimateItem>
            <EmptyState
              icon={Handshake}
              heading="No sponsors listed yet"
              description="Interested in supporting community safety? Get in touch."
              actionLabel="Become a sponsor"
              actionHref="/contact"
            />
          </AnimateItem>
        </AnimateSection>
      ) : (
        <div className="mt-section">
          <SponsorShowcase sponsors={sponsors} showCta />
        </div>
      )}

      {/* Advertising packages — full showcase on the dedicated sponsors page */}
      <AnimateSection className="mt-section">
        <AnimateItem>
          <AdvertisingPackages />
        </AnimateItem>
      </AnimateSection>
    </PageShell>
  );
}
