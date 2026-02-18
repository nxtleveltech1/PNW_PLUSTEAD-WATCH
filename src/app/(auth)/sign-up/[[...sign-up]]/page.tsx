import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { redirect_url } = await searchParams;
  let afterSignUpUrl = "/dashboard";
  if (redirect_url) {
    try {
      afterSignUpUrl = new URL(redirect_url).pathname || "/dashboard";
    } catch {
      afterSignUpUrl = "/dashboard";
    }
  }

  return (
    <main className="container grid min-h-screen gap-10 py-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <section className="space-y-6 rounded-3xl border border-border/70 bg-card/90 p-8 shadow-[var(--shadow-elevation-2)]">
        <p className="eyebrow">Plumstead Membership</p>
        <h1 className="section-heading">Create Your Safety Profile</h1>
        <p className="section-subheading">
          Complete secure onboarding to access member updates, incident reports, and event coordination.
        </p>
        <div className="panel p-4 text-sm text-muted-foreground">
          <p className="inline-flex items-center gap-2 font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Already have an account?
          </p>
          <p className="mt-2">Sign in and continue from your dashboard.</p>
          <Link href="/sign-in" className="mt-3 inline-block font-semibold text-primary hover:underline">
            Go to sign in
          </Link>
        </div>
      </section>
      <section className="flex justify-center">
        <div className="rounded-3xl border border-border/70 bg-card/95 p-4 shadow-[var(--shadow-elevation-3)]">
          <SignUp afterSignUpUrl={afterSignUpUrl} />
        </div>
      </section>
    </main>
  );
}
