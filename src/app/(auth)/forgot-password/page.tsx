import Image from "next/image";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      {/* Branded panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[hsl(220,68%,22%)] via-[hsl(220,68%,28%)] to-[hsl(220,55%,18%)] lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[hsl(8,85%,50%)] opacity-[0.12] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[hsl(212,78%,63%)] opacity-[0.15] blur-[80px]" />

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
            Reset your
            <br />
            password.
          </h1>
          <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-white/70">
            Enter the email address associated with your account and
            we&apos;ll send you a verification code.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 px-12 py-5 xl:px-16">
          <p className="text-xs text-white/40">
            Plumstead Neighbourhood Watch &middot; Keeping our community safe
            since 2018
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-background">
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
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Forgot your password?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                No worries &mdash; we&apos;ll help you get back in.
              </p>
            </div>

            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </main>
  );
}
