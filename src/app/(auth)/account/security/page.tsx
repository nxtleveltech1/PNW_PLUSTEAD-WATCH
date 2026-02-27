import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SecurityForm } from "@/components/account/security-form";

export default async function SecurityPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Security</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your password and account security.
        </p>
      </div>
      <SecurityForm />
    </div>
  );
}
