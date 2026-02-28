import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageShell } from "@/components/layout/page-shell";
import { PaymentOptions } from "./payment-options";
import {
  MEMBERSHIP_FEE_CENTS,
  MEMBERSHIP_FEE_DISPLAY,
  PAYSTACK_PUBLIC_KEY,
  BANK_DETAILS,
} from "@/lib/payment";

export default async function PaymentPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, email: true, firstName: true, memberNumber: true },
  });
  if (!user) redirect("/sign-in");

  const paidPayment = await prisma.membershipPayment.findFirst({
    where: { userId: user.id, status: "PAID" },
  });
  if (paidPayment) redirect("/dashboard");

  const pendingEft = await prisma.membershipPayment.findFirst({
    where: { userId: user.id, method: "EFT", status: "PENDING" },
  });
  if (pendingEft) redirect("/dashboard");

  return (
    <PageShell>
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <p className="eyebrow">Membership</p>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Complete your membership
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Annual membership fee: <strong>{MEMBERSHIP_FEE_DISPLAY}</strong>.
            Choose how you&apos;d like to pay.
          </p>
        </div>
        <PaymentOptions
          email={user.email}
          userId={user.id}
          memberNumber={user.memberNumber}
          firstName={user.firstName}
          feeCents={MEMBERSHIP_FEE_CENTS}
          feeDisplay={MEMBERSHIP_FEE_DISPLAY}
          paystackPublicKey={PAYSTACK_PUBLIC_KEY}
          bankDetails={BANK_DETAILS}
        />
      </div>
    </PageShell>
  );
}
