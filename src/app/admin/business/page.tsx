import { prisma } from "@/lib/db";
import { BusinessApprovals } from "./business-approvals";

export default async function AdminBusinessPage() {
  const listings = await prisma.businessListing.findMany({
    orderBy: { createdAt: "desc" },
    include: { zone: { select: { name: true } } },
  });

  const rows = listings.map((l) => ({
    id: l.id,
    name: l.name,
    category: l.category,
    email: l.email,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  }));

  const pending = rows.filter((r) => r.status === "PENDING");
  const others = rows.filter((r) => r.status !== "PENDING");

  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Business listing approvals</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Approve or reject self-service business submissions. Pending listings appear first.
      </p>
      <div className="mt-6">
        <BusinessApprovals listings={[...pending, ...others]} />
      </div>
    </section>
  );
}
