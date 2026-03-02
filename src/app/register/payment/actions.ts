"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { paystackVerifySchema } from "@/lib/schemas";
import {
  MEMBERSHIP_FEE_CENTS,
  MEMBERSHIP_CURRENCY,
  generatePaystackReference,
} from "@/lib/payment";
import { decideMembershipPaymentVerification } from "@/lib/membership-payment-verification";

interface PaystackVerifyResponse {
  status: boolean;
  data: {
    status: string;
    amount: number;
    currency: string;
    reference: string;
    paid_at: string;
  };
}

export async function initializePaystackPayment() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, email: true },
  });
  if (!user) redirect("/sign-in");

  const existing = await prisma.membershipPayment.findFirst({
    where: { userId: user.id, status: "PAID" },
  });
  if (existing) redirect("/dashboard");

  const pendingPaystack = await prisma.membershipPayment.findFirst({
    where: { userId: user.id, method: "PAYSTACK", status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: { id: true, paystackReference: true },
  });

  if (pendingPaystack?.paystackReference) {
    return { reference: pendingPaystack.paystackReference, email: user.email };
  }

  const reference = generatePaystackReference(user.id);

  if (pendingPaystack) {
    await prisma.membershipPayment.update({
      where: { id: pendingPaystack.id },
      data: {
        amount: MEMBERSHIP_FEE_CENTS,
        currency: MEMBERSHIP_CURRENCY,
        paystackReference: reference,
      },
    });
  } else {
    await prisma.membershipPayment.create({
      data: {
        userId: user.id,
        amount: MEMBERSHIP_FEE_CENTS,
        currency: MEMBERSHIP_CURRENCY,
        method: "PAYSTACK",
        status: "PENDING",
        paystackReference: reference,
      },
    });
  }

  return { reference, email: user.email };
}

export async function verifyPaystackPayment(rawReference: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) redirect("/sign-in");

  const { reference } = paystackVerifySchema.parse({
    reference: rawReference,
  });
  const payment = await prisma.membershipPayment.findUnique({
    where: { paystackReference: reference },
    select: { id: true, userId: true, status: true },
  });
  if (!payment || payment.userId !== user.id) {
    throw new Error("Invalid payment reference");
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error("Paystack secret key not configured");

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store" },
  );

  if (!res.ok) throw new Error("Payment verification failed");

  const json = (await res.json()) as PaystackVerifyResponse;
  const decision = decideMembershipPaymentVerification({
    paymentUserId: payment.userId,
    authenticatedUserId: user.id,
    currentStatus: payment.status,
    gatewayStatus: json.data.status,
    gatewayAmount: json.data.amount,
    gatewayCurrency: json.data.currency,
    expectedAmount: MEMBERSHIP_FEE_CENTS,
    expectedCurrency: MEMBERSHIP_CURRENCY,
  });

  if (decision.action === "reject") {
    throw new Error("Invalid payment reference");
  }

  if (decision.action === "noop") {
    redirect("/dashboard");
  }

  if (decision.action === "mark_failed") {
    await prisma.membershipPayment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: { status: "FAILED" },
    });
    throw new Error("Payment verification mismatch");
  }

  await prisma.$transaction(async (tx) => {
    const result = await tx.membershipPayment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: {
        status: "PAID",
        paidAt: new Date(json.data.paid_at),
      },
    });

    if (result.count > 0) return;

    const latest = await tx.membershipPayment.findUnique({
      where: { id: payment.id },
      select: { status: true },
    });
    if (latest?.status === "PAID") return;

    throw new Error("Payment status could not be updated");
  });

  redirect("/dashboard");
}

export async function recordEftPayment() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) redirect("/sign-in");

  const existing = await prisma.membershipPayment.findFirst({
    where: { userId: user.id, status: "PAID" },
  });
  if (existing) redirect("/dashboard");

  const pendingEft = await prisma.membershipPayment.findFirst({
    where: { userId: user.id, method: "EFT", status: "PENDING" },
  });
  if (pendingEft) redirect("/dashboard");

  await prisma.membershipPayment.create({
    data: {
      userId: user.id,
      amount: MEMBERSHIP_FEE_CENTS,
      currency: MEMBERSHIP_CURRENCY,
      method: "EFT",
      status: "PENDING",
    },
  });

  redirect("/dashboard");
}
