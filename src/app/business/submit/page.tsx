export const dynamic = "force-dynamic";

import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { PageShell } from "@/components/layout/page-shell";
import { prisma } from "@/lib/db";
import { BusinessDbUnavailable } from "../db-unavailable";
import { AnimateSection } from "@/components/ui/animate-section";
import { BusinessListingForm } from "./business-listing-form";

export default async function BusinessSubmitPage() {
  let zones;
  try {
    zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });
  } catch {
    return <BusinessDbUnavailable />;
  }

  return (
    <PageShell>
      <AnimateSection>
        <BreadcrumbNav items={[{ label: "Business", href: "/business" }, { label: "Submit Listing" }]} />

        <div className="page-hero max-w-2xl">
            <p className="eyebrow">List your business</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Submit a business listing</span>
            </h1>
            <p className="section-subheading">
              Your listing will be reviewed before it appears in the directory. Approved listings are visible to all
              community members.
            </p>
        </div>

        <div className="mt-section max-w-2xl">
            <div className="card-elevated overflow-hidden rounded-2xl border-0 bg-card p-6 md:p-8">
              <BusinessListingForm zones={zones} />
            </div>
        </div>
      </AnimateSection>
    </PageShell>
  );
}
