import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/profile-form";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let clerkUser = null;
  try {
    clerkUser = await currentUser();
  } catch {
    redirect("/sign-in");
  }
  if (!clerkUser) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="block-title">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information and profile picture.
        </p>
      </div>
      <ProfileForm
        firstName={clerkUser.firstName}
        lastName={clerkUser.lastName}
        email={clerkUser.primaryEmailAddress?.emailAddress ?? ""}
        imageUrl={clerkUser.imageUrl ?? ""}
      />
    </div>
  );
}
