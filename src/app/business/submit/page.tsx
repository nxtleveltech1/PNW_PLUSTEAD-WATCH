export const dynamic = "force-dynamic";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { BusinessListingForm } from "./business-listing-form";

export default async function BusinessSubmitPage() {
  const zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link href="/business">&lt;- Back to directory</Link>
        </Button>

        <div className="page-hero max-w-2xl">
          <p className="eyebrow">List your business</p>
          <h1 className="section-heading mt-2">Submit a business listing</h1>
          <p className="section-subheading">
            Your listing will be reviewed before it appears in the directory. Approved listings are visible to all community members.
          </p>
        </div>

        <div className="mt-10 max-w-2xl">
          <BusinessListingForm zones={zones} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
