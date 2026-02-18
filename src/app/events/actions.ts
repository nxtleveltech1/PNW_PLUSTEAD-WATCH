"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/db";

type EventRsvpResult = { removed: boolean };
type EventRsvpErrorCode = "VALIDATION_ERROR" | "USER_NOT_FOUND" | "DB_ERROR";

export async function rsvpEvent(
  eventId: string
): Promise<ActionResult<EventRsvpResult, EventRsvpErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!eventId?.trim()) return fail("VALIDATION_ERROR", "Invalid event.");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found. Please complete registration.");

  try {
    const existing = await prisma.eventRsvp.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } },
    });

    if (existing) {
      await prisma.eventRsvp.delete({
        where: { eventId_userId: { eventId, userId: user.id } },
      });
      return ok({ removed: true });
    }

    await prisma.eventRsvp.create({
      data: { eventId, userId: user.id },
    });
    return ok({ removed: false });
  } catch {
    return fail("DB_ERROR", "Unable to update RSVP right now. Please try again.");
  }
}
