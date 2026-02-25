import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 403 });
  }

  const { id: eventId } = await params;
  if (!eventId?.trim()) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const event = await prisma.businessEvent.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const existing = await prisma.businessEventRsvp.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });

  if (existing) {
    await prisma.businessEventRsvp.delete({
      where: { eventId_userId: { eventId, userId: user.id } },
    });
    return NextResponse.json({ removed: true });
  }

  await prisma.businessEventRsvp.create({
    data: { eventId, userId: user.id },
  });
  return NextResponse.json({ removed: false });
}
