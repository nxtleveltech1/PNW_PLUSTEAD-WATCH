import type { PaymentStatus } from "@prisma/client";

type DecideMembershipPaymentInput = {
  paymentUserId: string;
  authenticatedUserId: string;
  currentStatus: PaymentStatus;
  gatewayStatus: string;
  gatewayAmount: number;
  gatewayCurrency: string;
  expectedAmount: number;
  expectedCurrency: string;
};

export type MembershipPaymentDecision =
  | { action: "reject"; reason: "not_owner" }
  | { action: "noop"; reason: "already_paid" | "already_failed" }
  | { action: "mark_failed"; reason: "gateway_mismatch" }
  | { action: "mark_paid" };

export function decideMembershipPaymentVerification(
  input: DecideMembershipPaymentInput,
): MembershipPaymentDecision {
  if (input.paymentUserId !== input.authenticatedUserId) {
    return { action: "reject", reason: "not_owner" };
  }

  if (input.currentStatus === "PAID") {
    return { action: "noop", reason: "already_paid" };
  }

  if (input.currentStatus === "FAILED") {
    return { action: "noop", reason: "already_failed" };
  }

  const isSuccess = input.gatewayStatus === "success";
  const hasAmountMatch = input.gatewayAmount === input.expectedAmount;
  const hasCurrencyMatch = input.gatewayCurrency === input.expectedCurrency;

  if (!isSuccess || !hasAmountMatch || !hasCurrencyMatch) {
    return { action: "mark_failed", reason: "gateway_mismatch" };
  }

  return { action: "mark_paid" };
}

