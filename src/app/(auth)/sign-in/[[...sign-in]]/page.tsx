import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Shield, Users, Clock, MapPin } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      {/* Branded panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[hsl(220,68%,22%)] via-[hsl(220,68%,28%)] to-[hsl(220,55%,18%)] lg:flex lg:flex-col lg:justify-between">
        {/* Ambient grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Radial glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[hsl(8,85%,50%)] opacity-[0.12] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[hsl(212,78%,63%)] opacity-[0.15] blur-[80px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-12 py-16 xl:px-16">
          <Link href="/" className="mb-16 inline-flex">
            <Image
              src="/images/header%20logo.jpg"
              alt="Plumstead Neighbourhood Watch"
              width={140}
              height={52}
              className="rounded-md brightness-0 invert"
              priority
            />
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight text-white xl:text-4xl">
            Welcome back to
            <br />
            your neighbourhood.
          </h1>
          <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-white/70">
            Sign in to stay connected with Plumstead&apos;s safety network, report incidents, and coordinate with your community.
          </p>

          {/* Trust signals */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            <TrustSignal icon={Users} label="Active Members" value="2,400+" />
            <TrustSignal icon={MapPin} label="Coverage Zones" value="12" />
            <TrustSignal icon={Shield} label="Incidents Resolved" value="850+" />
            <TrustSignal icon={Clock} label="Response Time" value="< 15 min" />
          </div>
        </div>

        {/* Bottom strip */}
        <div className="relative z-10 border-t border-white/10 px-12 py-5 xl:px-16">
          <p className="text-xs text-white/40">
            Plumstead Neighbourhood Watch &middot; Keeping our community safe since 2018
          </p>
        </div>
      </div>

      {/* Auth panel */}
      <div className="flex flex-col bg-background">
        {/* Mobile brand header */}
        <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4 lg:hidden">
          <Link href="/">
            <Image
              src="/images/header%20logo.jpg"
              alt="PNW"
              width={100}
              height={38}
              className="rounded-md"
              priority
            />
          </Link>
          <span className="text-sm font-bold uppercase tracking-wide text-foreground">
            PNW
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <p className="eyebrow">Secure Access</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
                Sign in to your account
              </h2>
            </div>

            <SignIn
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 bg-transparent p-0 w-full",
                },
              }}
            />

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                New to PNW?
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Join Plumstead&apos;s safety network as a member or supporter.
              </p>
              <div className="mt-3 flex gap-4">
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Create account
                </Link>
                <Link
                  href="/register/guest"
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline"
                >
                  Join as guest
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TrustSignal({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <Icon className="h-4 w-4 shrink-0 text-white/50" />
      <div>
        <p className="text-sm font-bold text-white">{value}</p>
        <p className="text-[0.6875rem] text-white/50">{label}</p>
      </div>
    </div>
  );
}
