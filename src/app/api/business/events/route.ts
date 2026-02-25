import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const events = await prisma.businessEvent.findMany({
    include: {
      listing: { select: { id: true, name: true } },
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json(events);
}
