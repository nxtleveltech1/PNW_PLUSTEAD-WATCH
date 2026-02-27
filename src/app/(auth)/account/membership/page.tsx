import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { MembershipForm } from "@/components/account/membership-form";

export default async function MembershipPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, zones, streets] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      include: { zone: true, street: true },
    }),
    prisma.zone.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.street.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, zoneId: true } }),
  ]);

  return (
    <div className="space-y-6">
      <MembershipForm user={user} zones={zones} streets={streets} />
    </div>
  );
}
