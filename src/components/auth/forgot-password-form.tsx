"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import type { ClerkAPIError } from "@clerk/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const resetSchema = z
  .object({
    code: z.string().min(6, "Enter the 6-digit code"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailValues = z.infer<typeof emailSchema>;
type ResetValues = z.infer<typeof resetSchema>;

type Step = "email" | "reset" | "done";

export function ForgotPasswordForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [apiErrors, setApiErrors] = useState<ClerkAPIError[]>([]);
  const [isPending, setIsPending] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  async function onRequestCode(values: EmailValues) {
    if (!isLoaded) return;
    setApiErrors([]);
    setIsPending(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: values.email,
      });
      setStep("reset");
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

  async function onResetPassword(values: ResetValues) {
    if (!isLoaded) return;
    setApiErrors([]);
    setIsPending(true);

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: values.code,
        password: values.password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        setStep("done");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setApiErrors(err.errors);
      } else {
        setApiErrors([
          {
            code: "unknown",
            message: "Invalid code or password. Please try again.",
            longMessage: "Invalid code or password. Please try again.",
            meta: {},
          } as ClerkAPIError,
        ]);
      }
    } finally {
      setIsPending(false);
    }
  }

  const errorBlock = apiErrors.length > 0 && (
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
  );

  if (step === "done") {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Password reset</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your password has been updated. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <Form {...resetForm}>
        <form
          onSubmit={resetForm.handleSubmit(onResetPassword)}
          className="space-y-5"
        >
          <p className="text-sm text-muted-foreground">
            We sent a verification code to your email. Enter it below with your
            new password.
          </p>

          {errorBlock}

          <FormField
            control={resetForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={resetForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={resetForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    className="h-11"
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
                Reset password
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setApiErrors([]);
              resetForm.reset();
            }}
            className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Try a different email
          </button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(onRequestCode)}
        className="space-y-5"
      >
        {errorBlock}

        <FormField
          control={emailForm.control}
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
                  autoFocus
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
              Send reset code
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <Link
          href="/sign-in"
          className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </form>
    </Form>
  );
}
