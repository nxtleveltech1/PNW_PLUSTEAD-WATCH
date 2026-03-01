import { prisma } from "@/lib/db";
import { PaymentsTable, type PaymentRow } from "./payments-table";

export default async function AdminPaymentsPage() {
  const payments = await prisma.membershipPayment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  const rows: PaymentRow[] = payments.map((p) => ({
    id: p.id,
    userName:
      [p.user.firstName, p.user.lastName].filter(Boolean).join(" ") ||
      p.user.email,
    email: p.user.email,
    type: p.type,
    description: p.description,
    amount: p.amount,
    method: p.method,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    paidAt: p.paidAt?.toISOString() ?? null,
  }));

  const pending = rows.filter((r) => r.status === "PENDING");
  const rest = rows.filter((r) => r.status !== "PENDING");

  return (
    <section>
      <h2 className="font-display text-xl font-semibold">
        Membership payments
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Review and approve EFT payments. Paystack payments are verified
        automatically. Pending payments appear first.
      </p>
      <div className="mt-6">
        <PaymentsTable payments={[...pending, ...rest]} />
      </div>
    </section>
  );
}
