"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import {
  adminRoleCreateSchema,
  adminRoleUpdateSchema,
  type AdminRoleCreateInput,
  type AdminRoleUpdateInput,
} from "@/lib/schemas";

export async function createRole(input: AdminRoleCreateInput) {
  await requirePermission("roles.manage");

  const parsed = adminRoleCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.role.findUnique({ where: { name: parsed.data.name } });
  if (existing) {
    return { ok: false as const, message: "A role with this name already exists." };
  }

  const permissions = await prisma.permission.findMany({
    where: { key: { in: parsed.data.permissionKeys } },
    select: { id: true },
  });

  await prisma.role.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      permissions: {
        create: permissions.map((p) => ({ permissionId: p.id })),
      },
    },
  });

  revalidatePath("/admin/roles");
  return { ok: true as const };
}

export async function updateRole(id: string, input: AdminRoleUpdateInput) {
  await requirePermission("roles.manage");

  const parsed = adminRoleUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const role = await prisma.role.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!role) return { ok: false as const, message: "Role not found." };

  if (role.name !== parsed.data.name) {
    const nameConflict = await prisma.role.findUnique({ where: { name: parsed.data.name } });
    if (nameConflict) {
      return { ok: false as const, message: "A role with this name already exists." };
    }
  }

  const permissions = await prisma.permission.findMany({
    where: { key: { in: parsed.data.permissionKeys } },
    select: { id: true },
  });

  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId: id } }),
    prisma.role.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        permissions: {
          create: permissions.map((p) => ({ permissionId: p.id })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/roles");
  revalidatePath(`/admin/roles/${id}`);
  return { ok: true as const };
}

export async function deleteRole(id: string) {
  await requirePermission("roles.manage");

  const role = await prisma.role.findUnique({
    where: { id },
    select: { id: true, isSystem: true, name: true },
  });
  if (!role) return { ok: false as const, message: "Role not found." };
  if (role.isSystem) {
    return { ok: false as const, message: `Cannot delete the system role "${role.name}".` };
  }

  const memberRole = await prisma.role.findUnique({ where: { name: "Member" } });

  await prisma.$transaction([
    ...(memberRole
      ? [prisma.user.updateMany({ where: { customRoleId: id }, data: { customRoleId: memberRole.id } })]
      : []),
    prisma.role.delete({ where: { id } }),
  ]);

  revalidatePath("/admin/roles");
  revalidatePath("/admin/users");
  return { ok: true as const };
}
