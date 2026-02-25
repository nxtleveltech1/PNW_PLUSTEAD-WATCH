import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { MembershipPage } from "../membership-page";
import { LayoutDashboard, Users } from "lucide-react";

export default async function UserProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, zones] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      include: { zone: true },
    }),
    prisma.zone.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <main className="flex min-h-screen justify-center py-8">
      <UserProfile
        path="/user-profile"
        routing="path"
        appearance={{
          variables: {
            colorPrimary: "hsl(var(--primary))",
            colorDanger: "hsl(var(--accent))",
            borderRadius: "var(--radius)",
          },
        }}
      >
        <UserProfile.Link label="Dashboard" url="/dashboard" labelIcon={<LayoutDashboard className="h-5 w-5" />} />
        <UserProfile.Page label="Membership" url="membership" labelIcon={<Users className="h-5 w-5" />}>
          <MembershipPage user={user} zones={zones} />
        </UserProfile.Page>
      </UserProfile>
    </main>
  );
}
