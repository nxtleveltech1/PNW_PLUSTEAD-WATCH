"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";
import { adminIncidentSchema, type AdminIncidentInput } from "@/lib/schemas";

export async function createIncident(input: AdminIncidentInput) {
  await requireAdmin();
  const parsed = adminIncidentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { type, location, dateTime, zoneId } = parsed.data;
  await prisma.incident.create({
    data: {
      type,
      location,
      dateTime: new Date(dateTime),
      zoneId: zoneId || undefined,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/incidents");
  revalidatePath("/incidents");
  return { ok: true as const };
}

export async function updateIncident(id: string, input: AdminIncidentInput) {
  await requireAdmin();
  const parsed = adminIncidentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { type, location, dateTime, zoneId } = parsed.data;
  await prisma.incident.update({
    where: { id },
    data: {
      type,
      location,
      dateTime: new Date(dateTime),
      zoneId: zoneId || null,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/incidents");
  revalidatePath("/incidents");
  revalidatePath(`/incidents/${id}`);
  return { ok: true as const };
}

export async function deleteIncident(id: string) {
  await requireAdmin();
  await prisma.incident.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/incidents");
  revalidatePath("/incidents");
}
