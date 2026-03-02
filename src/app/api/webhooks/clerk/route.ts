import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { parseAdminEmails } from "@/lib/admin-emails";
import { verifyClerkWebhook } from "@/lib/clerk-webhook";

async function resolveRoleId(isAdmin: boolean): Promise<string | undefined> {
  const roleName = isAdmin ? "Super Admin" : "Member";
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  return role?.id;
}

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

  const body = await req.text();
  let evt: WebhookEvent;

  try {
    evt = verifyClerkWebhook(body, secret, { svixId, svixTimestamp, svixSignature });
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const adminEmails = parseAdminEmails();

  if (evt.type === "user.created") {
    const { id, first_name, last_name, email_addresses, primary_email_address_id } = evt.data;
    const primaryEmail = email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address;
    if (!primaryEmail) {
      return Response.json({ error: "No email" }, { status: 400 });
    }

    const isAdmin = adminEmails.includes(primaryEmail.toLowerCase());
    const roleId = await resolveRoleId(isAdmin);

    // Link to pre-created user if email matches
    const existingByEmail = await prisma.user.findUnique({ where: { email: primaryEmail } });
    if (existingByEmail && !existingByEmail.clerkId) {
      await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkId: id,
          firstName: first_name ?? existingByEmail.firstName,
          lastName: last_name ?? existingByEmail.lastName,
          ...(isAdmin && { role: "ADMIN", customRoleId: roleId, memberType: "MEMBER", isApproved: true }),
        },
      });
    } else {
      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email: primaryEmail,
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          customRoleId: roleId,
          ...(isAdmin && { role: "ADMIN", memberType: "MEMBER", isApproved: true }),
        },
        update: {
          email: primaryEmail,
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          ...(isAdmin && { role: "ADMIN", customRoleId: roleId, memberType: "MEMBER", isApproved: true }),
        },
      });
    }
  } else if (evt.type === "user.updated") {
    const { id, first_name, last_name, email_addresses, primary_email_address_id } = evt.data;
    const primaryEmail = email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address;
    if (primaryEmail) {
      const isAdmin = adminEmails.includes(primaryEmail.toLowerCase());
      const adminData = isAdmin
        ? { role: "ADMIN" as const, customRoleId: (await resolveRoleId(true)) ?? undefined }
        : {};
      await prisma.user.updateMany({
        where: { clerkId: id },
        data: {
          email: primaryEmail,
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          ...adminData,
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
