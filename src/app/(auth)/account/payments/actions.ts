"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { accountPaymentSchema, paystackVerifySchema } from "@/lib/schemas";
import {
  MEMBERSHIP_CURRENCY,
  generatePaystackReference,
  getPaymentTypeConfig,
  type PaymentTypeValue,
} from "@/lib/payment";

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

async function requireUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, email: true, firstName: true, memberNumber: true },
  });
  if (!user) redirect("/sign-in");
  return user;
}

export async function initializeAccountPayment(
  type: PaymentTypeValue,
  amountCents: number,
  description?: string,
) {
  const user = await requireUser();
  const parsed = accountPaymentSchema.parse({ type, amountCents, description });
  const config = getPaymentTypeConfig(parsed.type);

  const finalAmount = config.fixedAmountCents ?? parsed.amountCents;
  if (finalAmount < config.minAmountCents) {
    throw new Error("Amount below minimum");
  }

  const reference = generatePaystackReference(user.id);

  await prisma.membershipPayment.create({
    data: {
      userId: user.id,
      type: parsed.type,
      description: parsed.description ?? null,
      amount: finalAmount,
      currency: MEMBERSHIP_CURRENCY,
      method: "PAYSTACK",
      status: "PENDING",
      paystackReference: reference,
    },
  });

  return { reference, email: user.email, amountCents: finalAmount };
}

export async function verifyAccountPayment(rawReference: string) {
  await requireUser();

  const { reference } = paystackVerifySchema.parse({
    reference: rawReference,
  });

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error("Paystack secret key not configured");

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store" },
  );

  if (!res.ok) throw new Error("Payment verification failed");

  const json = (await res.json()) as PaystackVerifyResponse;

  const payment = await prisma.membershipPayment.findUnique({
    where: { paystackReference: reference },
    select: { amount: true },
  });

  if (
    json.data.status !== "success" ||
    json.data.amount !== payment?.amount ||
    json.data.currency !== MEMBERSHIP_CURRENCY
  ) {
    await prisma.membershipPayment.updateMany({
      where: { paystackReference: reference },
      data: { status: "FAILED" },
    });
    throw new Error("Payment verification mismatch");
  }

  await prisma.membershipPayment.updateMany({
    where: { paystackReference: reference },
    data: {
      status: "PAID",
      paidAt: new Date(json.data.paid_at),
    },
  });

  revalidatePath("/account/payments");
}

export async function recordAccountEftPayment(
  type: PaymentTypeValue,
  amountCents: number,
  description?: string,
) {
  const user = await requireUser();
  const parsed = accountPaymentSchema.parse({ type, amountCents, description });
  const config = getPaymentTypeConfig(parsed.type);

  const finalAmount = config.fixedAmountCents ?? parsed.amountCents;
  if (finalAmount < config.minAmountCents) {
    throw new Error("Amount below minimum");
  }

  await prisma.membershipPayment.create({
    data: {
      userId: user.id,
      type: parsed.type,
      description: parsed.description ?? null,
      amount: finalAmount,
      currency: MEMBERSHIP_CURRENCY,
      method: "EFT",
      status: "PENDING",
    },
  });

  revalidatePath("/account/payments");
}
