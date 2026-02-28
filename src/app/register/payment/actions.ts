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

  const reference = generatePaystackReference(user.id);

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

  return { reference, email: user.email };
}

export async function verifyPaystackPayment(rawReference: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

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

  if (
    json.data.status !== "success" ||
    json.data.amount !== MEMBERSHIP_FEE_CENTS ||
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
