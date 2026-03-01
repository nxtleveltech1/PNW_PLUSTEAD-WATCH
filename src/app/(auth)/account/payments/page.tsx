import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  PAYSTACK_PUBLIC_KEY,
  BANK_DETAILS,
  PAYMENT_TYPES,
} from "@/lib/payment";
import { PaymentForm } from "./payment-form";
import {
  PaymentHistory,
  type PaymentHistoryRow,
} from "./payment-history";

export default async function AccountPaymentsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, email: true, firstName: true, memberNumber: true },
  });
  if (!user) redirect("/sign-in");

  const payments = await prisma.membershipPayment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      description: true,
      amount: true,
      method: true,
      status: true,
      createdAt: true,
      paidAt: true,
    },
  });

  const rows: PaymentHistoryRow[] = payments.map((p) => ({
    id: p.id,
    type: p.type,
    description: p.description,
    amount: p.amount,
    method: p.method,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    paidAt: p.paidAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Make payments for membership, donations, event fees and more.
        </p>
      </div>

      <PaymentForm
        email={user.email}
        memberNumber={user.memberNumber}
        firstName={user.firstName}
        paystackPublicKey={PAYSTACK_PUBLIC_KEY}
        paymentTypes={PAYMENT_TYPES}
        bankDetails={BANK_DETAILS}
      />

      <div>
        <h2 className="mb-3 text-base font-semibold tracking-tight">
          Payment history
        </h2>
        <PaymentHistory payments={rows} />
      </div>
    </div>
  );
}
