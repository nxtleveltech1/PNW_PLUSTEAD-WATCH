export const dynamic = "force-dynamic";

import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { BusinessDbUnavailable } from "../db-unavailable";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link href="/business">&lt;- Back to directory</Link>
        </Button>

        <div className="page-hero max-w-2xl">
          <p className="eyebrow">Refer a friend</p>
          <h1 className="section-heading mt-2">Submit a referral</h1>
          <p className="section-subheading">
            Know someone who would benefit from a local business? Refer them and help grow the community.
          </p>
        </div>

        <div className="mt-10 max-w-2xl">
          <ReferralForm
            listings={listings}
            preselectedListingId={preselectedListing?.id ?? null}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
