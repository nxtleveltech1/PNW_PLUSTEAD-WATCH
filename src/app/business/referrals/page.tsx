export const dynamic = "force-dynamic";

import { PageShell } from "@/components/layout/page-shell";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { prisma } from "@/lib/db";
import { BusinessDbUnavailable } from "../db-unavailable";
import { ReferralForm } from "./referral-form";

export default async function BusinessReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ listingId?: string }>;
}) {
  const params = await searchParams;
  let listings;
  try {
    listings = await prisma.businessListing.findMany({
      where: { status: "APPROVED" },
      orderBy: { name: "asc" },
    });
  } catch {
    return <BusinessDbUnavailable />;
  }

  const preselectedListing = params.listingId
    ? listings.find((l) => l.id === params.listingId)
    : null;

  return (
    <PageShell>
      <BreadcrumbNav items={[{ label: "Business", href: "/business" }, { label: "Referrals" }]} />

      <div className="page-hero max-w-2xl">
          <p className="eyebrow">Refer a friend</p>
          <h1 className="section-heading mt-2">Submit a referral</h1>
          <p className="section-subheading">
            Know someone who would benefit from a local business? Refer them and help grow the community.
          </p>
        </div>

        <div className="mt-section max-w-2xl">
          <ReferralForm
            listings={listings}
            preselectedListingId={preselectedListing?.id ?? null}
          />
        </div>
    </PageShell>
  );
}
