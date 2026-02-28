import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/permissions";
import { EditRoleForm } from "./edit-role-form";

export default async function AdminRoleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("roles.manage");
  const { id } = await params;

  const [role, allPermissions] = await Promise.all([
    prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          select: { permission: { select: { key: true } } },
        },
      },
    }),
    prisma.permission.findMany({
      orderBy: [{ groupName: "asc" }, { label: "asc" }],
      select: { key: true, label: true, groupName: true },
    }),
  ]);

  if (!role) notFound();

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">Edit role</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {role.name}
          {role.isSystem && (
            <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
              System role
            </span>
          )}
        </p>
      </div>
      <EditRoleForm
        role={{
          id: role.id,
          name: role.name,
          description: role.description,
          isSystem: role.isSystem,
          permissionKeys: role.permissions.map((rp) => rp.permission.key),
        }}
        allPermissions={allPermissions}
      />
    </section>
  );
}
