import { describe, expect, test } from "bun:test";
import { decideMembershipPaymentVerification } from "./membership-payment-verification";

describe("decideMembershipPaymentVerification", () => {
  test("rejects when authenticated user does not own payment", () => {
    const result = decideMembershipPaymentVerification({
      paymentUserId: "user-a",
      authenticatedUserId: "user-b",
      currentStatus: "PENDING",
      gatewayStatus: "success",
      gatewayAmount: 20000,
      gatewayCurrency: "ZAR",
      expectedAmount: 20000,
      expectedCurrency: "ZAR",
    });

    expect(result).toEqual({ action: "reject", reason: "not_owner" });
  });

  test("treats already paid as idempotent no-op", () => {
    const result = decideMembershipPaymentVerification({
      paymentUserId: "user-a",
      authenticatedUserId: "user-a",
      currentStatus: "PAID",
      gatewayStatus: "success",
      gatewayAmount: 20000,
      gatewayCurrency: "ZAR",
      expectedAmount: 20000,
      expectedCurrency: "ZAR",
    });

    expect(result).toEqual({ action: "noop", reason: "already_paid" });
  });

  test("marks pending payment as failed when gateway data mismatches", () => {
    const result = decideMembershipPaymentVerification({
      paymentUserId: "user-a",
      authenticatedUserId: "user-a",
      currentStatus: "PENDING",
      gatewayStatus: "success",
      gatewayAmount: 1000,
      gatewayCurrency: "ZAR",
      expectedAmount: 20000,
      expectedCurrency: "ZAR",
    });

    expect(result).toEqual({ action: "mark_failed", reason: "gateway_mismatch" });
  });

  test("marks pending payment as paid only for successful matching payload", () => {
    const result = decideMembershipPaymentVerification({
      paymentUserId: "user-a",
      authenticatedUserId: "user-a",
      currentStatus: "PENDING",
      gatewayStatus: "success",
      gatewayAmount: 20000,
      gatewayCurrency: "ZAR",
      expectedAmount: 20000,
      expectedCurrency: "ZAR",
    });

    expect(result).toEqual({ action: "mark_paid" });
  });
});

