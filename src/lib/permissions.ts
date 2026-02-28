import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const PERMISSIONS = {
  ADMIN_ACCESS: "admin.access",
  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",
  ROLES_MANAGE: "roles.manage",
  INCIDENTS_MANAGE: "incidents.manage",
  EVENTS_MANAGE: "events.manage",
  DOCUMENTS_MANAGE: "documents.manage",
  BUSINESS_MANAGE: "business.manage",
  MEMBERS_APPROVE: "members.approve",
  MESSAGES_VIEW: "messages.view",
  BROADCAST_SEND: "broadcast.send",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export async function getUserPermissions(
  clerkId: string,
): Promise<string[]> {
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

  if (!user?.customRole) return [];
  return user.customRole.permissions.map((rp) => rp.permission.key);
}

export async function hasPermission(
  clerkId: string,
  permissionKey: string,
): Promise<boolean> {
  const count = await prisma.rolePermission.count({
    where: {
      permission: { key: permissionKey },
      role: { users: { some: { clerkId } } },
    },
  });
  return count > 0;
}

/**
 * Server-side guard: redirects to /dashboard if the current user
 * lacks the specified permission. Returns the authenticated user's
 * clerkId and db record on success.
 */
export async function requirePermission(permissionKey: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      customRole: {
        select: {
          permissions: {
            select: { permission: { select: { key: true } } },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) redirect("/dashboard");

  const keys = user.customRole?.permissions.map((rp) => rp.permission.key) ?? [];
  if (!keys.includes(permissionKey)) redirect("/dashboard");

  return { userId, user: { id: user.id, email: user.email, role: user.role } };
}
