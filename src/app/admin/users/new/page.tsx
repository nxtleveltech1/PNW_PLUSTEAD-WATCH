import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/permissions";
import { CreateUserForm } from "./create-user-form";

export default async function AdminCreateUserPage() {
  await requirePermission("users.manage");

  const [roles, zones, streets] = await Promise.all([
    prisma.role.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.zone.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.street.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, zoneId: true } }),
  ]);

  const memberRole = roles.find((r) => r.name === "Member");

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">Create user</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pre-create a user record. They will be linked when they sign up via Clerk.
        </p>
      </div>
      <CreateUserForm
        roles={roles}
        zones={zones}
        streets={streets}
        defaultRoleId={memberRole?.id ?? roles[0]?.id ?? ""}
      />
    </section>
  );
}
