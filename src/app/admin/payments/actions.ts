"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";

export async function approvePayment(paymentId: string) {
  const { user } = await requireAdmin();

  await prisma.membershipPayment.update({
    where: { id: paymentId },
    data: {
      status: "PAID",
      paidAt: new Date(),
      verifiedAt: new Date(),
      verifiedById: user.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/payments");
}

export async function rejectPayment(paymentId: string) {
  await requireAdmin();

  await prisma.membershipPayment.update({
    where: { id: paymentId },
    data: { status: "FAILED" },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/payments");
}
