import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/permissions";
import { EditUserForm } from "./edit-user-form";

export default async function AdminUserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("users.manage");
  const { id } = await params;

  const [user, roles, zones, streets] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        memberType: true,
        customRoleId: true,
        zoneId: true,
        streetId: true,
        houseNumber: true,
        isApproved: true,
        isActive: true,
        patrolOptIn: true,
        hideFromNeighbours: true,
        secondaryContactName: true,
        secondaryContactPhone: true,
        secondaryContactEmail: true,
        whatsappOptIn: true,
        whatsappPhone: true,
        memberNumber: true,
        createdAt: true,
        clerkId: true,
      },
    }),
    prisma.role.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.zone.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.street.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, zoneId: true } }),
  ]);

  if (!user) notFound();

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">Edit user</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {displayName} &middot; #{user.memberNumber}
          {!user.clerkId && (
            <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
              Pre-created (no Clerk account)
            </span>
          )}
        </p>
      </div>
      <EditUserForm user={user} roles={roles} zones={zones} streets={streets} />
    </section>
  );
}
