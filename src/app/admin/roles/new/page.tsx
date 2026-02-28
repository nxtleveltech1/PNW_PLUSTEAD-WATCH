import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/permissions";
import { CreateRoleForm } from "./create-role-form";

export default async function AdminCreateRolePage() {
  await requirePermission("roles.manage");

  const allPermissions = await prisma.permission.findMany({
    orderBy: [{ groupName: "asc" }, { label: "asc" }],
    select: { key: true, label: true, groupName: true },
  });

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">Create role</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define a new role and assign permissions.
        </p>
      </div>
      <CreateRoleForm allPermissions={allPermissions} />
    </section>
  );
}
