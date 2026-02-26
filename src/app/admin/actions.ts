"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";

export async function approveBusinessListing(id: string) {
  await requireAdmin();
  await prisma.businessListing.update({
    where: { id },
    data: { status: "APPROVED" },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/business");
}

export async function rejectBusinessListing(id: string) {
  await requireAdmin();
  await prisma.businessListing.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/business");
}
