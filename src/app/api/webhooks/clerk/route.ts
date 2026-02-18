import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return Response.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(secret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, first_name, last_name, email_addresses, primary_email_address_id } = evt.data;
    const primaryEmail = email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address;
    if (!primaryEmail) {
      return Response.json({ error: "No email" }, { status: 400 });
    }
    await prisma.user.upsert({
      where: { clerkId: id },
      create: {
        clerkId: id,
        email: primaryEmail,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
      },
      update: {
        email: primaryEmail,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
      },
    });
  } else if (evt.type === "user.updated") {
    const { id, first_name, last_name, email_addresses, primary_email_address_id } = evt.data;
    const primaryEmail = email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address;
    if (primaryEmail) {
      await prisma.user.updateMany({
        where: { clerkId: id },
        data: {
          email: primaryEmail,
          firstName: first_name ?? null,
          lastName: last_name ?? null,
        },
      });
    }
  } else if (evt.type === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await prisma.user.deleteMany({ where: { clerkId: id } });
    }
  }

  return Response.json({ received: true });
}
