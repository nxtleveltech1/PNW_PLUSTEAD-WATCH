"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import type { ClerkAPIError } from "@clerk/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  AlertCircle,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

const verifySchema = z.object({
  code: z
    .string()
    .min(6, "Enter the 6-digit code")
    .max(6, "Enter the 6-digit code"),
});

type SignUpValues = z.infer<typeof signUpSchema>;
type VerifyValues = z.infer<typeof verifySchema>;

interface SignUpFormProps {
  afterSignUpUrl?: string;
}

export function SignUpForm({ afterSignUpUrl = "/dashboard" }: SignUpFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiErrors, setApiErrors] = useState<ClerkAPIError[]>([]);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const verifyForm = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(values: SignUpValues) {
    if (!isLoaded) return;
    setApiErrors([]);
    setIsPending(true);

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setApiErrors(err.errors);
      } else {
        setApiErrors([
          {
            code: "unknown",
            message: "Something went wrong. Please try again.",
            longMessage: "Something went wrong. Please try again.",
            meta: {},
          } as ClerkAPIError,
        ]);
      }
    } finally {
      setIsPending(false);
    }
  }

  async function onVerify(values: VerifyValues) {
    if (!isLoaded) return;
    setApiErrors([]);
    setIsPending(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: values.code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.push(afterSignUpUrl);
      } else {
        console.error("Sign-up not complete:", attempt.status);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setApiErrors(err.errors);
      } else {
        setApiErrors([
          {
            code: "unknown",
            message: "Invalid code. Please try again.",
            longMessage: "Invalid code. Please try again.",
            meta: {},
          } as ClerkAPIError,
        ]);
      }
    } finally {
      setIsPending(false);
    }
  }

  if (verifying) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Check your email
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a 6-digit verification code to{" "}
              <span className="font-medium text-foreground">
                {form.getValues("email")}
              </span>
            </p>
          </div>
        </div>

        {apiErrors.length > 0 && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            {apiErrors.map((err, i) => (
              <p
                key={i}
                className="flex items-start gap-2 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {err.longMessage || err.message}
              </p>
            ))}
          </div>
        )}

        <Form {...verifyForm}>
          <form
            onSubmit={verifyForm.handleSubmit(onVerify)}
            className="space-y-5"
          >
            <FormField
              control={verifyForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000000"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      maxLength={6}
                      className="h-11 text-center font-mono text-lg tracking-[0.3em]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Verify &amp; continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setVerifying(false);
                setApiErrors([]);
              }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Back to sign up
            </button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {apiErrors.length > 0 && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            {apiErrors.map((err, i) => (
              <p
                key={i}
                className="flex items-start gap-2 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {err.longMessage || err.message}
              </p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First name"
                    autoComplete="given-name"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last name{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last name"
                    autoComplete="family-name"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-11 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              <PasswordHints value={field.value} />
            </FormItem>
          )}
        />

        <div id="clerk-captcha" />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
}

function PasswordHints({ value }: { value: string }) {
  const rules = [
    { label: "8+ characters", met: value.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(value) },
    { label: "Number", met: /[0-9]/.test(value) },
  ];

  if (!value) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {rules.map((r) => (
        <span
          key={r.label}
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium transition-colors ${
            r.met
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {r.met ? "✓" : "·"} {r.label}
        </span>
      ))}
    </div>
  );
}
