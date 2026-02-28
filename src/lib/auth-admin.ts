import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PERMISSIONS } from "@/lib/permissions";

const adminEmails = (process.env.ADMIN_EMAILS ?? "gambew@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function ensureSuperAdminRole(userId: string) {
  const superAdminRole = await prisma.role.findUnique({ where: { name: "Super Admin" } });
  if (!superAdminRole) return;

  await prisma.user.updateMany({
    where: { clerkId: userId, customRoleId: { not: superAdminRole.id } },
    data: {
      role: "ADMIN",
      customRoleId: superAdminRole.id,
      memberType: "MEMBER",
      isApproved: true,
    },
  });
}

async function syncUserFromClerk(clerkId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser || clerkUser.id !== clerkId) return null;

  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;
  if (!primaryEmail) return null;

  const isBootstrapAdmin = adminEmails.includes(primaryEmail.toLowerCase());

  let roleId: string | undefined;
  if (isBootstrapAdmin) {
    const superAdminRole = await prisma.role.findUnique({ where: { name: "Super Admin" } });
    roleId = superAdminRole?.id;
  }
  if (!roleId) {
    const memberRole = await prisma.role.findUnique({ where: { name: "Member" } });
    roleId = memberRole?.id ?? undefined;
  }

  return prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      email: primaryEmail,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      customRoleId: roleId,
      ...(isBootstrapAdmin && { role: "ADMIN" as const, memberType: "MEMBER" as const, isApproved: true }),
    },
    update: {
      email: primaryEmail,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      ...(isBootstrapAdmin && { customRoleId: roleId, role: "ADMIN" as const, memberType: "MEMBER" as const, isApproved: true }),
    },
    select: { id: true, role: true, email: true, isActive: true, customRoleId: true },
  });
}

function userHasAdminAccess(permissions: string[]): boolean {
  return permissions.includes(PERMISSIONS.ADMIN_ACCESS);
}

async function resolvePermissions(clerkId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      customRole: {
        select: {
          permissions: {
            select: { permission: { select: { key: true } } },
          },
        },
      },
    },
  });
  return user?.customRole?.permissions.map((rp) => rp.permission.key) ?? [];
}

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true, email: true, isActive: true, customRoleId: true },
  });

  if (!user) {
    user = await syncUserFromClerk(userId);
  }
  if (!user || !user.isActive) redirect("/dashboard");

  const isAdminByEmail = adminEmails.includes(user.email.toLowerCase());
  if (isAdminByEmail) {
    await ensureSuperAdminRole(userId);
  }

  const permissions = await resolvePermissions(userId);
  const hasAccess = userHasAdminAccess(permissions) || isAdminByEmail;
  if (!hasAccess) redirect("/dashboard");

  return { userId, user: { id: user.id, role: user.role, email: user.email } };
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, email: true, isActive: true },
    });

    if (!user) {
      user = await syncUserFromClerk(userId);
    }
    if (!user || !user.isActive) return false;

    const isAdminByEmail = adminEmails.includes(user.email.toLowerCase());
    if (isAdminByEmail) {
      await ensureSuperAdminRole(userId);
      return true;
    }

    const permissions = await resolvePermissions(userId);
    return userHasAdminAccess(permissions);
  } catch {
    return false;
  }
}
