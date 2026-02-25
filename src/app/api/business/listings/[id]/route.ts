import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = await prisma.businessListing.findFirst({
    where: { id, status: "APPROVED" },
    include: { zone: { select: { id: true, name: true } } },
  });

  if (!listing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(listing);
}
