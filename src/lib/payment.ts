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

export type PaymentTypeValue = "MEMBERSHIP" | "DONATION" | "EVENT_FEE" | "OTHER";

export interface PaymentTypeConfig {
  value: PaymentTypeValue;
  label: string;
  fixedAmountCents: number | null;
  allowCustomAmount: boolean;
  minAmountCents: number;
}

export const PAYMENT_TYPES: PaymentTypeConfig[] = [
  {
    value: "MEMBERSHIP",
    label: "Membership Renewal",
    fixedAmountCents: MEMBERSHIP_FEE_CENTS,
    allowCustomAmount: false,
    minAmountCents: MEMBERSHIP_FEE_CENTS,
  },
  {
    value: "DONATION",
    label: "Donation",
    fixedAmountCents: null,
    allowCustomAmount: true,
    minAmountCents: 1000,
  },
  {
    value: "EVENT_FEE",
    label: "Event Fee",
    fixedAmountCents: null,
    allowCustomAmount: true,
    minAmountCents: 1000,
  },
  {
    value: "OTHER",
    label: "Other",
    fixedAmountCents: null,
    allowCustomAmount: true,
    minAmountCents: 1000,
  },
];

export function formatCentsDisplay(cents: number): string {
  return `R${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function getPaymentTypeConfig(value: PaymentTypeValue): PaymentTypeConfig {
  const config = PAYMENT_TYPES.find((t) => t.value === value);
  if (!config) throw new Error(`Unknown payment type: ${value}`);
  return config;
}
