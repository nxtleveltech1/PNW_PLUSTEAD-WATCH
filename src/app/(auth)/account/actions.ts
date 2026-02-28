"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import {
  emailPrefsSchema,
  membershipProfileSchema,
  profileUpdateSchema,
  type EmailPrefsInput,
  type MembershipProfileInput,
  type ProfileUpdateInput,
} from "@/lib/schemas";

export async function updateProfile(data: ProfileUpdateInput) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  const parsed = profileUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") };
  }

  await prisma.user.updateMany({
    where: { clerkId: userId },
    data: {
      firstName: parsed.data.firstName || null,
      lastName: parsed.data.lastName || null,
    },
  });
  return { ok: true };
}

export async function updateEmailPrefs(data: EmailPrefsInput) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  const parsed = emailPrefsSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") };
  }

  await prisma.user.updateMany({
    where: { clerkId: userId },
    data: { emailPrefs: parsed.data as object },
  });
  return { ok: true };
}

export async function updateMembershipProfile(data: MembershipProfileInput) {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = membershipProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") };
  }

  await prisma.user.updateMany({
    where: { clerkId: userId },
    data: {
      zoneId: parsed.data.zoneId,
      section: parsed.data.section ?? null,
      streetId: parsed.data.streetId ?? null,
      houseNumber: parsed.data.houseNumber ?? null,
      hideFromNeighbours: parsed.data.hideFromNeighbours,
      patrolOptIn: parsed.data.patrolOptIn,
      secondaryContactName: parsed.data.secondaryContactName ?? null,
      secondaryContactPhone: parsed.data.secondaryContactPhone ?? null,
      secondaryContactEmail:
        parsed.data.secondaryContactEmail === "" ? null : parsed.data.secondaryContactEmail ?? null,
      emailPrefs: parsed.data.emailPrefs ? (parsed.data.emailPrefs as object) : undefined,
      whatsappOptIn: parsed.data.whatsappOptIn,
      whatsappPhone:
        parsed.data.whatsappOptIn && parsed.data.whatsappPhone
          ? parsed.data.whatsappPhone
          : null,
    },
  });

  return { ok: true };
}
