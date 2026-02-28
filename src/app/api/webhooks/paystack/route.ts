import { createHmac } from "crypto";
import { prisma } from "@/lib/db";

interface PaystackWebhookPayload {
  event: string;
  data: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    paid_at: string;
  };
}

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY not set");
    return Response.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  const hash = createHmac("sha512", secret).update(body).digest("hex");
  if (hash !== signature) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: PaystackWebhookPayload;
  try {
    payload = JSON.parse(body) as PaystackWebhookPayload;
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (payload.event === "charge.success") {
    const { reference, status, amount, currency, paid_at } = payload.data;

    if (status !== "success") {
      return Response.json({ received: true });
    }

    const payment = await prisma.membershipPayment.findUnique({
      where: { paystackReference: reference },
    });

    if (!payment) {
      return Response.json({ received: true });
    }

    if (payment.status === "PAID") {
      return Response.json({ received: true });
    }

    if (payment.amount !== amount || payment.currency !== currency) {
      await prisma.membershipPayment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      return Response.json({ received: true });
    }

    await prisma.membershipPayment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(paid_at),
      },
    });
  }

  return Response.json({ received: true });
}
