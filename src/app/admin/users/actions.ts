"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import {
  adminUserCreateSchema,
  adminUserUpdateSchema,
  type AdminUserCreateInput,
  type AdminUserUpdateInput,
} from "@/lib/schemas";

export async function createUser(input: AdminUserCreateInput) {
  await requirePermission("users.manage");

  const parsed = adminUserCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { ok: false as const, message: "A user with this email already exists." };
  }

  const d = parsed.data;
  await prisma.user.create({
    data: {
      email: d.email,
      firstName: d.firstName ?? null,
      lastName: d.lastName ?? null,
      memberType: d.memberType,
      customRoleId: d.customRoleId,
      role: "MEMBER",
      zoneId: d.zoneId ?? null,
      streetId: d.streetId ?? null,
      houseNumber: d.houseNumber ?? null,
      isApproved: d.isApproved,
      isActive: d.isActive,
      patrolOptIn: d.patrolOptIn,
      hideFromNeighbours: d.hideFromNeighbours,
      secondaryContactName: d.secondaryContactName ?? null,
      secondaryContactPhone: d.secondaryContactPhone ?? null,
      secondaryContactEmail: d.secondaryContactEmail || null,
      whatsappOptIn: d.whatsappOptIn,
      whatsappPhone: d.whatsappOptIn ? (d.whatsappPhone ?? null) : null,
    },
  });

  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function updateUser(id: string, input: AdminUserUpdateInput) {
  await requirePermission("users.manage");

  const parsed = adminUserUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) return { ok: false as const, message: "User not found." };

  const d = parsed.data;
  await prisma.user.update({
    where: { id },
    data: {
      ...(d.email !== undefined && { email: d.email }),
      ...(d.firstName !== undefined && { firstName: d.firstName ?? null }),
      ...(d.lastName !== undefined && { lastName: d.lastName ?? null }),
      ...(d.memberType !== undefined && { memberType: d.memberType }),
      customRoleId: d.customRoleId,
      ...(d.zoneId !== undefined && { zoneId: d.zoneId ?? null }),
      ...(d.streetId !== undefined && { streetId: d.streetId ?? null }),
      ...(d.houseNumber !== undefined && { houseNumber: d.houseNumber ?? null }),
      ...(d.isApproved !== undefined && { isApproved: d.isApproved }),
      ...(d.isActive !== undefined && { isActive: d.isActive }),
      ...(d.patrolOptIn !== undefined && { patrolOptIn: d.patrolOptIn }),
      ...(d.hideFromNeighbours !== undefined && { hideFromNeighbours: d.hideFromNeighbours }),
      ...(d.secondaryContactName !== undefined && { secondaryContactName: d.secondaryContactName ?? null }),
      ...(d.secondaryContactPhone !== undefined && { secondaryContactPhone: d.secondaryContactPhone ?? null }),
      ...(d.secondaryContactEmail !== undefined && { secondaryContactEmail: d.secondaryContactEmail || null }),
      ...(d.whatsappOptIn !== undefined && { whatsappOptIn: d.whatsappOptIn }),
      ...(d.whatsappPhone !== undefined && { whatsappPhone: d.whatsappPhone ?? null }),
    },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  return { ok: true as const };
}

export async function toggleUserActive(id: string) {
  await requirePermission("users.manage");

  const user = await prisma.user.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!user) return { ok: false as const, message: "User not found." };

  await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });

  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function deleteUser(id: string) {
  await requirePermission("users.manage");

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) return { ok: false as const, message: "User not found." };

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin/users");
  return { ok: true as const };
}
