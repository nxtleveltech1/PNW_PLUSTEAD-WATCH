import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, TriangleAlert } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="container grid min-h-screen gap-10 py-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <section className="space-y-6 rounded-3xl border border-border/70 bg-card/90 p-8 shadow-[var(--shadow-elevation-2)]">
        <p className="eyebrow">Plumstead Operations</p>
        <h1 className="section-heading">Member Access Console</h1>
        <p className="section-subheading">
          Sign in to report incidents, track events, and coordinate local safety response.
        </p>
        <div className="critical-strip">
          <p className="inline-flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" />
            Incident hotline: 0860 002 669
          </p>
        </div>
        <div className="panel p-4 text-sm text-muted-foreground">
          <p className="inline-flex items-center gap-2 font-semibold text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            New to PNW?
          </p>
          <p className="mt-2">
            Register as a member if you live in Plumstead, or as a guest if you support the area.
          </p>
          <div className="mt-3 flex gap-3">
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register member
            </Link>
            <Link href="/register/guest" className="font-semibold text-primary hover:underline">
              Register guest
            </Link>
          </div>
        </div>
      </section>
      <section className="flex justify-center">
        <div className="rounded-3xl border border-border/70 bg-card/95 p-4 shadow-[var(--shadow-elevation-3)]">
          <SignIn afterSignInUrl="/dashboard" />
        </div>
      </section>
    </main>
  );
}
