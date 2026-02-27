import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return { userId, user };
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    return user?.role === "ADMIN";
  } catch {
    return false;
  }
}
