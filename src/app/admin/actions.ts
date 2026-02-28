"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";
import { notifyBusinessListingApproved, notifyBusinessListingRejected } from "@/lib/notify";

export async function approveBusinessListing(id: string) {
  await requireAdmin();
  const listing = await prisma.businessListing.update({
    where: { id },
    data: { status: "APPROVED" },
    select: { name: true, createdById: true },
  });
  if (listing.createdById) {
    await notifyBusinessListingApproved(listing.createdById, listing.name, id);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/business");
}

export async function rejectBusinessListing(id: string) {
  await requireAdmin();
  const listing = await prisma.businessListing.update({
    where: { id },
    data: { status: "REJECTED" },
    select: { name: true, createdById: true },
  });
  if (listing.createdById) {
    await notifyBusinessListingRejected(listing.createdById, listing.name);
  }
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
