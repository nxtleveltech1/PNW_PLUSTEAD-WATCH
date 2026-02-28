import Link from "next/link";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  await requirePermission("users.view");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customRole: { select: { name: true } },
      zone: { select: { name: true } },
    },
  });

  const rows = users.map((u) => ({
    id: u.id,
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
    email: u.email,
    memberNumber: u.memberNumber,
    roleName: u.customRole?.name ?? null,
    zoneName: u.zone?.name ?? null,
    memberType: u.memberType,
    isActive: u.isActive,
    isApproved: u.isApproved,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Users</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all users, assign roles, and control access.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">Create user</Link>
        </Button>
      </div>
      <div className="mt-6">
        <UsersTable data={rows} />
      </div>
    </section>
  );
}
