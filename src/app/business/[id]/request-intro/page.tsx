export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { prisma } from "@/lib/db";
import { BusinessDbUnavailable } from "../../db-unavailable";
import { IntroRequestForm } from "./intro-request-form";

export default async function RequestIntroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  let listing;
  try {
    listing = await prisma.businessListing.findFirst({
      where: { id, status: "APPROVED" },
      select: { id: true, name: true },
    });
  } catch {
    return <BusinessDbUnavailable />;
  }

  if (!listing) notFound();

  return (
    <PageShell>
      <BreadcrumbNav items={[{ label: "Business", href: "/business" }, { label: listing.name, href: `/business/${listing.id}` }, { label: "Request Intro" }]} />
        <div className="panel max-w-xl">
          <div className="panel-header">
            <h1 className="font-display text-xl font-semibold">Request business introduction</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Introduce yourself to {listing.name}. Describe your business or partnership interest. The listing owner
              will review and can accept or decline.
            </p>
          </div>
          <div className="px-6 py-5">
            <IntroRequestForm listingId={listing.id} listingName={listing.name} />
          </div>
        </div>
    </PageShell>
  );
}
