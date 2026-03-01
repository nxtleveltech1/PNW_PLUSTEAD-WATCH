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
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
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

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const codeSchema = z.object({
  code: z.string().min(6, "Enter your 6-digit code").max(6),
});

type SignInValues = z.infer<typeof signInSchema>;
type CodeValues = z.infer<typeof codeSchema>;
type MfaStrategy = "totp" | "phone_code";

export function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiErrors, setApiErrors] = useState<ClerkAPIError[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [mfaStrategy, setMfaStrategy] = useState<MfaStrategy | null>(null);
  const [mfaHint, setMfaHint] = useState("");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(values: SignInValues) {
    if (!isLoaded) return;
    setApiErrors([]);
    setIsPending(true);

    try {
      const attempt = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.push("/dashboard");
      } else if (attempt.status === "needs_second_factor") {
        await handleSecondFactor();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsPending(false);
    }
  }

  async function handleSecondFactor() {
    if (!signIn) return;

    const factors = signIn.supportedSecondFactors ?? [];
    const hasPhone = factors.some((f) => f.strategy === "phone_code");
    const hasTotp = factors.some((f) => f.strategy === "totp");

    if (hasPhone) {
      const prepared = await signIn.prepareSecondFactor({
        strategy: "phone_code",
      });
      const phone =
        prepared.supportedSecondFactors?.find(
          (f): f is Extract<typeof f, { strategy: "phone_code" }> =>
            f.strategy === "phone_code"
        )?.phoneNumberId ?? "";
      setMfaStrategy("phone_code");
      setMfaHint(phone ? `Code sent to your phone` : "Code sent via SMS");
    } else if (hasTotp) {
      setMfaStrategy("totp");
      setMfaHint("Enter the code from your authenticator app");
    } else {
      setApiErrors([
        {
          code: "unsupported_2fa",
          message:
            "Your account requires a second factor we don't support yet. Please contact support.",
          longMessage:
            "Your account requires a second factor we don't support yet. Please contact support.",
          meta: {},
        } as ClerkAPIError,
      ]);
    }
  }

  async function onCodeSubmit(values: CodeValues) {
    if (!isLoaded || !signIn || !mfaStrategy) return;
    setApiErrors([]);
    setIsPending(true);

    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: mfaStrategy,
        code: values.code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsPending(false);
    }
  }

  async function resendCode() {
    if (!signIn || mfaStrategy !== "phone_code") return;
    setApiErrors([]);
    setIsPending(true);

    try {
      await signIn.prepareSecondFactor({ strategy: "phone_code" });
      setMfaHint("New code sent via SMS");
    } catch (err) {
      handleError(err);
    } finally {
      setIsPending(false);
    }
  }

  function handleError(err: unknown) {
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

  if (mfaStrategy) {
    const isPhone = mfaStrategy === "phone_code";

    return (
      <Form {...codeForm}>
        <form
          onSubmit={codeForm.handleSubmit(onCodeSubmit)}
          className="space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              {isPhone ? (
                <Smartphone className="h-5 w-5 text-primary" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isPhone ? "Verify your phone" : "Two-factor authentication"}
              </p>
              <p className="text-xs text-muted-foreground">{mfaHint}</p>
            </div>
          </div>

          {errorBlock}

          <FormField
            control={codeForm.control}
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
                Verify
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setMfaStrategy(null);
                setMfaHint("");
                setApiErrors([]);
                codeForm.reset();
              }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>

            {isPhone && (
              <button
                type="button"
                onClick={resendCode}
                disabled={isPending}
                className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            )}
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {errorBlock}

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
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </Form>
  );
}
