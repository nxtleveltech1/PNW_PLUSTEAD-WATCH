import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const adminEmails = (process.env.ADMIN_EMAILS ?? "gambew@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function syncUserFromClerk(clerkId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser || clerkUser.id !== clerkId) return null;

  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;
  if (!primaryEmail) return null;

  const isAdmin = adminEmails.includes(primaryEmail.toLowerCase());
  return prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      email: primaryEmail,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      ...(isAdmin && { role: "ADMIN" as const, memberType: "MEMBER" as const, isApproved: true }),
    },
    update: {
      email: primaryEmail,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      ...(isAdmin && { role: "ADMIN" as const, memberType: "MEMBER" as const, isApproved: true }),
    },
    select: { id: true, role: true, email: true },
  });
}

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true, email: true },
  });

  if (!user) {
    user = await syncUserFromClerk(userId);
  }

  const isAdminByRole = user?.role === "ADMIN";
  const isAdminByEmail =
    user?.email && adminEmails.includes(user.email.toLowerCase());

  if (!isAdminByRole && !isAdminByEmail) redirect("/dashboard");

  // Ensure every admin has full membership (repairs existing records)
  await prisma.user.updateMany({
    where: {
      clerkId: userId,
      OR: [
        { role: { not: "ADMIN" } },
        { memberType: { not: "MEMBER" } },
        { isApproved: false },
      ],
    },
    data: { role: "ADMIN", memberType: "MEMBER", isApproved: true },
  });

  return { userId, user: user! };
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, email: true },
    });

    if (!user) {
      user = await syncUserFromClerk(userId);
    }

    const isAdminByRole = user?.role === "ADMIN";
    const isAdminByEmail =
      user?.email && adminEmails.includes(user.email.toLowerCase());

    if (!isAdminByRole && !isAdminByEmail) return false;

    // Ensure every admin has full membership (repairs existing records)
    await prisma.user.updateMany({
      where: {
        clerkId: userId,
        OR: [
          { role: { not: "ADMIN" } },
          { memberType: { not: "MEMBER" } },
          { isApproved: false },
        ],
      },
      data: { role: "ADMIN", memberType: "MEMBER", isApproved: true },
    });

    return true;
  } catch {
    return false;
  }
}
