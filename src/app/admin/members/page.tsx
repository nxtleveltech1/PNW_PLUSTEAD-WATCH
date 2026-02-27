import { prisma } from "@/lib/db";
import { MembersApprovalsTable } from "./members-approvals-table";

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    where: { memberType: "MEMBER" },
    orderBy: { createdAt: "desc" },
    include: { zone: { select: { name: true } }, street: { select: { name: true } } },
  });

  const rows = members.map((u) => ({
    id: u.id,
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
    email: u.email,
    zone: u.zone?.name ?? null,
    street: u.street?.name ?? null,
    houseNumber: u.houseNumber,
    isApproved: u.isApproved,
    createdAt: u.createdAt.toISOString(),
  }));

  const pending = rows.filter((r) => !r.isApproved);
  const approved = rows.filter((r) => r.isApproved);

  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Member approvals</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Approve members to enable their digital membership card. Pending members appear first.
      </p>
      <div className="mt-6">
        <MembersApprovalsTable members={[...pending, ...approved]} />
      </div>
    </section>
  );
}
