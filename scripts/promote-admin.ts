import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function main() {
  if (!ADMIN_EMAIL || ADMIN_EMAIL.trim().length === 0) {
    throw new Error("ADMIN_EMAIL is required");
  }

  const result = await prisma.user.updateMany({
    where: { email: { equals: ADMIN_EMAIL, mode: "insensitive" } },
    data: { role: "ADMIN" },
  });
  console.log(`Updated ${result.count} user(s) to ADMIN (email: ${ADMIN_EMAIL})`);
  if (result.count === 0) {
    console.log("Tip: User may not exist yet. Sign in first to sync via Clerk webhook.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
