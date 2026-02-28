import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.street.groupBy({
    by: ["section"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  console.log("Section street counts:");
  let total = 0;
  for (const row of counts) {
    console.log(`  ${row.section ?? "(unassigned)"}: ${row._count.id}`);
    total += row._count.id;
  }
  console.log(`  TOTAL: ${total}\n`);

  const unassigned = await prisma.street.findMany({
    where: { section: null },
    orderBy: { name: "asc" },
    select: { name: true },
  });

  console.log(`Unassigned streets (${unassigned.length}):`);
  for (const s of unassigned) {
    console.log(`  ${s.name}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
