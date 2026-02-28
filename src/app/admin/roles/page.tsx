import Link from "next/link";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { RolesTable } from "./roles-table";

export default async function AdminRolesPage() {
  await requirePermission("roles.manage");

  const roles = await prisma.role.findMany({
    orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    include: {
      _count: { select: { users: true, permissions: true } },
    },
  });

  const rows = roles.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    isSystem: r.isSystem,
    userCount: r._count.users,
    permissionCount: r._count.permissions,
  }));

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Roles</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage roles and their permissions. System roles cannot be deleted.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/roles/new">Create role</Link>
        </Button>
      </div>
      <div className="mt-6">
        <RolesTable roles={rows} />
      </div>
    </section>
  );
}
