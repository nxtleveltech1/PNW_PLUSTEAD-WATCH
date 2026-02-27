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

export async function toggleBusinessFeatured(id: string) {
  await requireAdmin();
  const listing = await prisma.businessListing.findUnique({
    where: { id },
    select: { featured: true },
  });
  if (!listing) return;
  await prisma.businessListing.update({
    where: { id },
    data: { featured: !listing.featured },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/business");
  revalidatePath("/business");
}
