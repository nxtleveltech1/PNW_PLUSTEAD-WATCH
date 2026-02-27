#!/usr/bin/env bun
/**
 * Syncs ADMIN role for users whose emails are in ADMIN_EMAILS.
 * Run once to fix existing admins created before the webhook or when webhook failed.
 *
 * Usage: bun run scripts/sync-admin-roles.ts
 * Requires: DATABASE_URL, ADMIN_EMAILS (optional, defaults to gambew@gmail.com)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminEmails = (process.env.ADMIN_EMAILS ?? "gambew@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function main() {
  if (adminEmails.length === 0) {
    console.log("No ADMIN_EMAILS configured. Set ADMIN_EMAILS env var (comma-separated).");
    return;
  }

  const result = await prisma.user.updateMany({
    where: {
      OR: adminEmails.map((email) => ({
        email: { equals: email, mode: "insensitive" },
      })),
    },
    data: { role: "ADMIN" },
  });

  console.log(`Updated ${result.count} user(s) to ADMIN (emails: ${adminEmails.join(", ")})`);
  if (result.count === 0) {
    console.log("Tip: Users may not exist yet. Sign in first to sync via Clerk webhook.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
