"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";
import { notifyMemberApproved, notifyMemberRejected } from "@/lib/notify";

export async function approveMember(id: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id },
    data: { isApproved: true },
  });
  await notifyMemberApproved(id);
  revalidatePath("/admin");
  revalidatePath("/admin/members");
}

export async function rejectMember(id: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id },
    data: { isApproved: false },
  });
  await notifyMemberRejected(id);
  revalidatePath("/admin");
  revalidatePath("/admin/members");
}
