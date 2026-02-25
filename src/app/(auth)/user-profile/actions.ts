"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { membershipProfileSchema, type MembershipProfileInput } from "@/lib/schemas";

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
      whatsappOptIn: parsed.data.whatsappOptIn,
      whatsappPhone: parsed.data.whatsappOptIn && parsed.data.whatsappPhone ? parsed.data.whatsappPhone : null,
    },
  });

  return { ok: true };
}
