export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { BusinessDbUnavailable } from "../../db-unavailable";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link href={`/business/${listing.id}`}>&lt;- Back to {listing.name}</Link>
        </Button>

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
      </main>
      <Footer />
    </div>
  );
}
