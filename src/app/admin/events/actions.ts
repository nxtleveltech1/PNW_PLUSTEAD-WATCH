"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";
import { adminEventSchema, type AdminEventInput } from "@/lib/schemas";

export async function createEvent(input: AdminEventInput) {
  await requireAdmin();
  const parsed = adminEventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { title, location, startAt, endAt, content } = parsed.data;
  await prisma.event.create({
    data: {
      title,
      location,
      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : null,
      content: content || null,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true as const };
}

export async function updateEvent(id: string, input: AdminEventInput) {
  await requireAdmin();
  const parsed = adminEventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { title, location, startAt, endAt, content } = parsed.data;
  await prisma.event.update({
    where: { id },
    data: {
      title,
      location,
      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : null,
      content: content || null,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  return { ok: true as const };
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
