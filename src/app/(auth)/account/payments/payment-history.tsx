"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Receipt } from "lucide-react";

export interface PaymentHistoryRow {
  id: string;
  type: "MEMBERSHIP" | "DONATION" | "EVENT_FEE" | "OTHER";
  description: string | null;
  amount: number;
  method: "PAYSTACK" | "EFT";
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  paidAt: string | null;
}

const TYPE_LABELS: Record<PaymentHistoryRow["type"], string> = {
  MEMBERSHIP: "Membership",
  DONATION: "Donation",
  EVENT_FEE: "Event Fee",
  OTHER: "Other",
};

function StatusBadge({ status }: { status: PaymentHistoryRow["status"] }) {
  switch (status) {
    case "PAID":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400">
          Paid
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400">
          Pending
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive">
          Failed
        </Badge>
      );
  }
}

export function PaymentHistory({ payments }: { payments: PaymentHistoryRow[] }) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <Receipt className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          No payments yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Your payment history will appear here once you make a payment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden sm:table-cell">Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden sm:table-cell">Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(p.createdAt).toLocaleDateString("en-ZA", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="font-medium">
                {TYPE_LABELS[p.type]}
              </TableCell>
              <TableCell className="hidden max-w-[200px] truncate text-muted-foreground sm:table-cell">
                {p.description || "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap font-medium tabular-nums">
                R{(p.amount / 100).toFixed(p.amount % 100 === 0 ? 0 : 2)}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {p.method === "PAYSTACK" ? "Card" : "EFT"}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={p.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
