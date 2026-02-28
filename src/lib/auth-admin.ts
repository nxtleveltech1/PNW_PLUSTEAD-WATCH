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
      ...(isAdmin && { role: "ADMIN" as const }),
    },
    update: {
      email: primaryEmail,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      ...(isAdmin && { role: "ADMIN" as const }),
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

  if (user?.role === "ADMIN") return { userId, user };

  if (user?.email && adminEmails.includes(user.email.toLowerCase())) {
    const updated = await prisma.user.update({
      where: { clerkId: userId },
      data: { role: "ADMIN" },
      select: { id: true, role: true },
    });
    return { userId, user: updated };
  }

  redirect("/dashboard");
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

    if (user?.role === "ADMIN") return true;

    // Upgrade: user exists as MEMBER but email is in ADMIN_EMAILS (env updated after signup)
    if (user?.email && adminEmails.includes(user.email.toLowerCase())) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { role: "ADMIN" },
      });
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
