import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { businessListingsSearchParamsSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = businessListingsSearchParamsSchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    zone: searchParams.get("zone") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  });

  const where: Parameters<typeof prisma.businessListing.findMany>[0]["where"] = {
    status: "APPROVED",
  };

  if (parsed.success) {
    if (parsed.data.category) where.category = parsed.data.category;
    if (parsed.data.zone) where.zoneId = parsed.data.zone;
    if (parsed.data.search && parsed.data.search.length > 0) {
      where.OR = [
        { name: { contains: parsed.data.search, mode: "insensitive" } },
        { description: { contains: parsed.data.search, mode: "insensitive" } },
      ];
    }
  }

  const listings = await prisma.businessListing.findMany({
    where,
    include: { zone: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(listings);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { businessListingSchema } = await import("@/lib/schemas");
  const parsed = businessListingSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const listing = await prisma.businessListing.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      address: data.address ?? undefined,
      phone: data.phone ?? undefined,
      email: data.email,
      websiteUrl: data.websiteUrl && data.websiteUrl !== "" ? data.websiteUrl : undefined,
      zoneId: data.zoneId ?? undefined,
      createdById: user.id,
    },
  });

  return Response.json(listing, { status: 201 });
}
