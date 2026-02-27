import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/account/settings-form";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { emailPrefs: true },
  });

  const emailPrefs = (user?.emailPrefs as Record<string, unknown>) ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your email preferences and notifications.
        </p>
      </div>
      <SettingsForm initialPrefs={emailPrefs} />
    </div>
  );
}
