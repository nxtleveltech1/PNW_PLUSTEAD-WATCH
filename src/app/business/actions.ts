"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/db";
import {
  businessListingSchema,
  businessMessageSchema,
  businessEventSchema,
  businessReferralSchema,
  businessIntroRequestSchema,
  type BusinessListingInput,
  type BusinessMessageInput,
  type BusinessEventInput,
  type BusinessReferralInput,
  type BusinessIntroRequestInput,
} from "@/lib/schemas";

type BusinessErrorCode =
  | "VALIDATION_ERROR"
  | "USER_NOT_FOUND"
  | "LISTING_NOT_FOUND"
  | "EVENT_NOT_FOUND"
  | "UNAUTHORIZED"
  | "DB_ERROR"
  | "INTRO_REQUEST_EXISTS"
  | "INTRO_REQUEST_NOT_FOUND";

export async function submitBusinessListing(
  input: BusinessListingInput
): Promise<ActionResult<{ id: string }, BusinessErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found. Please complete registration.");

  const parsed = businessListingSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid listing.");
  }

  const data = parsed.data;
  try {
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
    return ok({ id: listing.id });
  } catch {
    return fail("DB_ERROR", "Unable to submit listing right now. Please try again.");
  }
}

export async function sendBusinessMessage(
  input: BusinessMessageInput
): Promise<ActionResult<undefined, BusinessErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found. Please complete registration.");

  const parsed = businessMessageSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid message.");
  }

  const listing = await prisma.businessListing.findFirst({
    where: { id: parsed.data.listingId, status: "APPROVED" },
  });
  if (!listing) return fail("LISTING_NOT_FOUND", "Listing not found or not approved.");

  try {
    await prisma.businessMessage.create({
      data: {
        listingId: listing.id,
        senderId: user.id,
        body: parsed.data.body,
      },
    });
    return ok();
  } catch {
    return fail("DB_ERROR", "Unable to send message right now. Please try again.");
  }
}

export async function createBusinessEvent(
  input: BusinessEventInput
): Promise<ActionResult<{ id: string }, BusinessErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found. Please complete registration.");

  const parsed = businessEventSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid event.");
  }

  const data = parsed.data;
  if (data.listingId) {
    const listing = await prisma.businessListing.findFirst({
      where: { id: data.listingId, status: "APPROVED", createdById: user.id },
    });
    if (!listing) return fail("UNAUTHORIZED", "You can only link events to your own approved listings.");
  }

  try {
    const event = await prisma.businessEvent.create({
      data: {
        title: data.title,
        description: data.description ?? undefined,
        location: data.location,
        startAt: new Date(data.startAt),
        endAt: data.endAt ? new Date(data.endAt) : undefined,
        listingId: data.listingId ?? undefined,
      },
    });
    return ok({ id: event.id });
  } catch {
    return fail("DB_ERROR", "Unable to create event right now. Please try again.");
  }
}

export async function rsvpBusinessEvent(
  eventId: string
): Promise<ActionResult<{ removed: boolean }, BusinessErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!eventId?.trim()) return fail("VALIDATION_ERROR", "Invalid event.");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found. Please complete registration.");

  const event = await prisma.businessEvent.findUnique({ where: { id: eventId } });
  if (!event) return fail("EVENT_NOT_FOUND", "Event not found.");

  try {
    const existing = await prisma.businessEventRsvp.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } },
    });

    if (existing) {
      await prisma.businessEventRsvp.delete({
        where: { eventId_userId: { eventId, userId: user.id } },
      });
      return ok({ removed: true });
    }

    await prisma.businessEventRsvp.create({
      data: { eventId, userId: user.id },
    });
    return ok({ removed: false });
  } catch {
    return fail("DB_ERROR", "Unable to update RSVP right now. Please try again.");
  }
}

export async function submitBusinessReferral(
  input: BusinessReferralInput
): Promise<ActionResult<undefined, BusinessErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found. Please complete registration.");

  const parsed = businessReferralSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid referral.");
  }

  const listing = await prisma.businessListing.findFirst({
    where: { id: parsed.data.listingId, status: "APPROVED" },
  });
  if (!listing) return fail("LISTING_NOT_FOUND", "Listing not found or not approved.");

  try {
    await prisma.businessReferral.create({
      data: {
        listingId: listing.id,
        referrerId: user.id,
        referredName: parsed.data.referredName,
        referredEmail: parsed.data.referredEmail,
        message: parsed.data.message ?? undefined,
      },
    });
    return ok();
  } catch {
    return fail("DB_ERROR", "Unable to submit referral right now. Please try again.");
  }
}

export async function getBusinessMessagesForUser() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return [];

  const messages = await prisma.businessMessage.findMany({
    where: {
      listing: { createdById: user.id },
    },
    include: {
      listing: { select: { id: true, name: true } },
      sender: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return messages;
}

export async function createIntroRequest(
  input: BusinessIntroRequestInput
): Promise<ActionResult<{ id: string }, BusinessErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found. Please complete registration.");

  const parsed = businessIntroRequestSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid request.");
  }

  const listing = await prisma.businessListing.findFirst({
    where: { id: parsed.data.targetListingId, status: "APPROVED" },
  });
  if (!listing) return fail("LISTING_NOT_FOUND", "Listing not found or not approved.");

  const existing = await prisma.businessIntroRequest.findFirst({
    where: {
      requesterId: user.id,
      targetListingId: listing.id,
      status: "PENDING",
    },
  });
  if (existing) return fail("INTRO_REQUEST_EXISTS", "You already have a pending intro request for this business.");

  try {
    const intro = await prisma.businessIntroRequest.create({
      data: {
        requesterId: user.id,
        targetListingId: listing.id,
        message: parsed.data.message,
      },
    });
    return ok({ id: intro.id });
  } catch {
    return fail("DB_ERROR", "Unable to submit intro request right now. Please try again.");
  }
}

export async function respondToIntroRequest(
  introId: string,
  accept: boolean
): Promise<ActionResult<undefined, BusinessErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found.");

  const intro = await prisma.businessIntroRequest.findUnique({
    where: { id: introId },
    include: { targetListing: { select: { createdById: true } } },
  });
  if (!intro) return fail("INTRO_REQUEST_NOT_FOUND", "Intro request not found.");
  if (intro.targetListing.createdById !== user.id) {
    return fail("UNAUTHORIZED", "You can only respond to intro requests for your own listings.");
  }
  if (intro.status !== "PENDING") return fail("VALIDATION_ERROR", "This request has already been responded to.");

  try {
    await prisma.businessIntroRequest.update({
      where: { id: introId },
      data: { status: accept ? "ACCEPTED" : "DECLINED" },
    });
    return ok();
  } catch {
    return fail("DB_ERROR", "Unable to update. Please try again.");
  }
}

export async function getBusinessIntroRequestsForUser() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return [];

  return prisma.businessIntroRequest.findMany({
    where: {
      targetListing: { createdById: user.id },
    },
    include: {
      targetListing: { select: { id: true, name: true } },
      requester: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
