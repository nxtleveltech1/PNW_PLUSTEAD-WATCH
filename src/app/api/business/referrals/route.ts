import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { businessReferralSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = businessReferralSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  const listing = await prisma.businessListing.findFirst({
    where: { id: parsed.data.listingId, status: "APPROVED" },
  });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const referral = await prisma.businessReferral.create({
    data: {
      listingId: listing.id,
      referrerId: user.id,
      referredName: parsed.data.referredName,
      referredEmail: parsed.data.referredEmail,
      message: parsed.data.message ?? undefined,
    },
  });

  return NextResponse.json(referral, { status: 201 });
}
