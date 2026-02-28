export const MEMBERSHIP_FEE_CENTS = Number(
  process.env.MEMBERSHIP_FEE_CENTS ?? "20000",
);

export const MEMBERSHIP_CURRENCY = "ZAR" as const;

export const MEMBERSHIP_FEE_DISPLAY = `R${(MEMBERSHIP_FEE_CENTS / 100).toFixed(0)}`;

export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

export const BANK_DETAILS = {
  accountName: "Plumstead Neighbourhood Watch",
  bank: "FNB",
  accountNumber: "631 463 987 05",
  branchCode: "255355",
} as const;

export function generatePaystackReference(userId: string) {
  return `pnw-${userId.slice(0, 8)}-${Date.now()}`;
}
