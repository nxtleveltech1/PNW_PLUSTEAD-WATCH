"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import type { ConversationType, Prisma } from "@prisma/client";

type MsgErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "USER_NOT_FOUND"
  | "CONVERSATION_NOT_FOUND"
  | "RECIPIENT_NOT_FOUND"
  | "LISTING_NOT_FOUND"
  | "DB_ERROR";

// ── Helpers ──────────────────────────────────────────────────────────────

async function requireUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/register");
  return user;
}

// ── Unread Count ─────────────────────────────────────────────────────────

export async function getUnreadCount(): Promise<number> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return 0;

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) return 0;

  const participants = await prisma.conversationParticipant.findMany({
    where: { userId: user.id, isDeleted: false },
    select: { conversationId: true, lastReadAt: true },
  });

  if (participants.length === 0) return 0;

  let count = 0;
  for (const p of participants) {
    const where: Prisma.InboxMessageWhereInput = {
      conversationId: p.conversationId,
      ...(p.lastReadAt ? { createdAt: { gt: p.lastReadAt } } : {}),
    };
    const unread = await prisma.inboxMessage.count({ where });
    if (unread > 0) count++;
  }

  return count;
}

// ── Conversation List ────────────────────────────────────────────────────

export type ConversationListItem = {
  id: string;
  subject: string | null;
  type: ConversationType;
  lastMessageBody: string | null;
  lastMessageAt: string | null;
  lastMessageSenderName: string | null;
  unread: boolean;
  businessListingName: string | null;
  participantNames: string[];
};

export async function getConversations(
  filter?: ConversationType
): Promise<ConversationListItem[]> {
  const user = await requireUser();

  const where: Prisma.ConversationParticipantWhereInput = {
    userId: user.id,
    isDeleted: false,
    isArchived: false,
    ...(filter ? { conversation: { type: filter } } : {}),
  };

  const participations = await prisma.conversationParticipant.findMany({
    where,
    include: {
      conversation: {
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              sender: { select: { firstName: true, lastName: true } },
            },
          },
          participants: {
            where: { userId: { not: user.id } },
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
          businessListing: { select: { name: true } },
        },
      },
    },
    orderBy: { conversation: { updatedAt: "desc" } },
  });

  return participations.map((p) => {
    const conv = p.conversation;
    const lastMsg = conv.messages[0] ?? null;
    const senderName = lastMsg?.sender
      ? [lastMsg.sender.firstName, lastMsg.sender.lastName].filter(Boolean).join(" ") || "System"
      : conv.type === "SYSTEM"
        ? "System"
        : null;

    return {
      id: conv.id,
      subject: conv.subject,
      type: conv.type,
      lastMessageBody: lastMsg?.body ?? null,
      lastMessageAt: lastMsg?.createdAt?.toISOString() ?? conv.createdAt.toISOString(),
      lastMessageSenderName: senderName,
      unread: lastMsg
        ? !p.lastReadAt || lastMsg.createdAt > p.lastReadAt
        : !p.lastReadAt,
      businessListingName: conv.businessListing?.name ?? null,
      participantNames: conv.participants.map((cp) =>
        [cp.user.firstName, cp.user.lastName].filter(Boolean).join(" ") || cp.user.email
      ),
    };
  });
}

// ── Conversation Messages ────────────────────────────────────────────────

export type ThreadMessage = {
  id: string;
  body: string;
  senderName: string;
  senderId: string | null;
  isCurrentUser: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type ConversationDetail = {
  id: string;
  subject: string | null;
  type: ConversationType;
  businessListingId: string | null;
  businessListingName: string | null;
  participantNames: string[];
  messages: ThreadMessage[];
};

export async function getConversationMessages(
  conversationId: string
): Promise<ConversationDetail | null> {
  const user = await requireUser();

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: user.id },
    },
  });
  if (!participant || participant.isDeleted) return null;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      },
      participants: {
        where: { userId: { not: user.id } },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      },
      businessListing: { select: { id: true, name: true } },
    },
  });

  if (!conversation) return null;

  // Mark as read
  await prisma.conversationParticipant.update({
    where: { id: participant.id },
    data: { lastReadAt: new Date() },
  });

  return {
    id: conversation.id,
    subject: conversation.subject,
    type: conversation.type,
    businessListingId: conversation.businessListing?.id ?? null,
    businessListingName: conversation.businessListing?.name ?? null,
    participantNames: conversation.participants.map((cp) =>
      [cp.user.firstName, cp.user.lastName].filter(Boolean).join(" ") || cp.user.email
    ),
    messages: conversation.messages.map((m) => ({
      id: m.id,
      body: m.body,
      senderName: m.sender
        ? [m.sender.firstName, m.sender.lastName].filter(Boolean).join(" ") || m.sender.email
        : "System",
      senderId: m.senderId,
      isCurrentUser: m.senderId === user.id,
      metadata: m.metadata as Record<string, unknown> | null,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}

// ── Send Direct Message ──────────────────────────────────────────────────

export async function sendDirectMessage(
  recipientId: string,
  subject: string,
  body: string
): Promise<ActionResult<{ conversationId: string }, MsgErrorCode>> {
  const user = await requireUser();

  if (!body.trim() || body.trim().length < 2)
    return fail("VALIDATION_ERROR", "Message is too short.");
  if (!subject.trim())
    return fail("VALIDATION_ERROR", "Subject is required.");

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: { id: true },
  });
  if (!recipient) return fail("RECIPIENT_NOT_FOUND", "Recipient not found.");

  if (recipient.id === user.id)
    return fail("VALIDATION_ERROR", "You cannot message yourself.");

  try {
    // Check for existing DIRECT conversation between these two users
    const existing = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: recipient.id } } },
        ],
      },
    });

    if (existing) {
      await prisma.inboxMessage.create({
        data: { conversationId: existing.id, senderId: user.id, body: body.trim() },
      });
      await prisma.conversation.update({
        where: { id: existing.id },
        data: { updatedAt: new Date() },
      });
      // Un-delete/un-archive for recipient
      await prisma.conversationParticipant.updateMany({
        where: { conversationId: existing.id, userId: recipient.id },
        data: { isDeleted: false, isArchived: false },
      });
      revalidatePath("/account/inbox");
      return ok({ conversationId: existing.id });
    }

    const conversation = await prisma.conversation.create({
      data: {
        subject: subject.trim(),
        type: "DIRECT",
        participants: {
          create: [
            { userId: user.id, lastReadAt: new Date() },
            { userId: recipient.id },
          ],
        },
        messages: {
          create: { senderId: user.id, body: body.trim() },
        },
      },
    });

    revalidatePath("/account/inbox");
    return ok({ conversationId: conversation.id });
  } catch {
    return fail("DB_ERROR", "Unable to send message. Please try again.");
  }
}

// ── Send Business Message (Conversation-based) ──────────────────────────

export async function sendBusinessConversationMessage(
  listingId: string,
  body: string
): Promise<ActionResult<{ conversationId: string }, MsgErrorCode>> {
  const user = await requireUser();

  if (!body.trim() || body.trim().length < 10)
    return fail("VALIDATION_ERROR", "Message must be at least 10 characters.");

  const listing = await prisma.businessListing.findFirst({
    where: { id: listingId, status: "APPROVED" },
    select: { id: true, name: true, createdById: true },
  });
  if (!listing) return fail("LISTING_NOT_FOUND", "Listing not found or not approved.");
  if (!listing.createdById) return fail("LISTING_NOT_FOUND", "Business owner not found.");

  try {
    // Check for existing BUSINESS conversation for this user+listing pair
    const existing = await prisma.conversation.findFirst({
      where: {
        type: "BUSINESS",
        businessListingId: listing.id,
        participants: { some: { userId: user.id } },
      },
    });

    if (existing) {
      await prisma.inboxMessage.create({
        data: { conversationId: existing.id, senderId: user.id, body: body.trim() },
      });
      await prisma.conversation.update({
        where: { id: existing.id },
        data: { updatedAt: new Date() },
      });
      await prisma.conversationParticipant.updateMany({
        where: { conversationId: existing.id, userId: listing.createdById },
        data: { isDeleted: false, isArchived: false },
      });
      revalidatePath("/account/inbox");
      return ok({ conversationId: existing.id });
    }

    const conversation = await prisma.conversation.create({
      data: {
        subject: `Message about ${listing.name}`,
        type: "BUSINESS",
        businessListingId: listing.id,
        participants: {
          create: [
            { userId: user.id, lastReadAt: new Date() },
            { userId: listing.createdById },
          ],
        },
        messages: {
          create: { senderId: user.id, body: body.trim() },
        },
      },
    });

    // Also create legacy BusinessMessage for backward compatibility
    await prisma.businessMessage.create({
      data: { listingId: listing.id, senderId: user.id, body: body.trim() },
    });

    revalidatePath("/account/inbox");
    return ok({ conversationId: conversation.id });
  } catch {
    return fail("DB_ERROR", "Unable to send message. Please try again.");
  }
}

// ── Reply to Conversation ────────────────────────────────────────────────

export async function replyToConversation(
  conversationId: string,
  body: string
): Promise<ActionResult<undefined, MsgErrorCode>> {
  const user = await requireUser();

  if (!body.trim() || body.trim().length < 2)
    return fail("VALIDATION_ERROR", "Message is too short.");

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: user.id },
    },
  });
  if (!participant || participant.isDeleted)
    return fail("CONVERSATION_NOT_FOUND", "Conversation not found.");

  try {
    await prisma.inboxMessage.create({
      data: { conversationId, senderId: user.id, body: body.trim() },
    });
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() },
    });
    // Un-delete/un-archive other participants so they see the reply
    await prisma.conversationParticipant.updateMany({
      where: { conversationId, userId: { not: user.id } },
      data: { isDeleted: false, isArchived: false },
    });

    revalidatePath(`/account/inbox/${conversationId}`);
    revalidatePath("/account/inbox");
    return ok();
  } catch {
    return fail("DB_ERROR", "Unable to send reply. Please try again.");
  }
}

// ── System Notification ──────────────────────────────────────────────────

export async function sendSystemNotification(
  userId: string,
  subject: string,
  body: string,
  metadata?: Record<string, string>
): Promise<string> {
  const conversation = await prisma.conversation.create({
    data: {
      subject,
      type: "SYSTEM",
      participants: {
        create: { userId },
      },
      messages: {
        create: {
          body,
          ...(metadata ? { metadata: metadata as Prisma.JsonObject } : {}),
        },
      },
    },
  });
  return conversation.id;
}

// ── Admin Broadcast ──────────────────────────────────────────────────────

export async function sendAdminBroadcast(
  subject: string,
  body: string,
  targetType: "all" | "zone" | "section",
  targetId?: string
): Promise<ActionResult<{ conversationId: string; recipientCount: number }, MsgErrorCode>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const admin = await prisma.user.findUnique({ where: { clerkId } });
  if (!admin || admin.role !== "ADMIN")
    return fail("UNAUTHORIZED", "Admin access required.");

  if (!subject.trim()) return fail("VALIDATION_ERROR", "Subject is required.");
  if (!body.trim()) return fail("VALIDATION_ERROR", "Message body is required.");

  let userFilter: Prisma.UserWhereInput = { isApproved: true };
  if (targetType === "zone" && targetId) {
    userFilter = { ...userFilter, zoneId: targetId };
  } else if (targetType === "section" && targetId) {
    userFilter = { ...userFilter, section: targetId };
  }

  const recipients = await prisma.user.findMany({
    where: userFilter,
    select: { id: true },
  });

  if (recipients.length === 0)
    return fail("VALIDATION_ERROR", "No recipients match the selected criteria.");

  try {
    const conversation = await prisma.conversation.create({
      data: {
        subject: subject.trim(),
        type: "ADMIN_BROADCAST",
        participants: {
          create: recipients.map((r) => ({
            userId: r.id,
            ...(r.id === admin.id ? { lastReadAt: new Date() } : {}),
          })),
        },
        messages: {
          create: {
            senderId: admin.id,
            body: body.trim(),
          },
        },
      },
    });

    revalidatePath("/account/inbox");
    return ok({ conversationId: conversation.id, recipientCount: recipients.length });
  } catch {
    return fail("DB_ERROR", "Unable to send broadcast. Please try again.");
  }
}

// ── Mark Read ────────────────────────────────────────────────────────────

export async function markConversationRead(
  conversationId: string
): Promise<void> {
  const user = await requireUser();

  await prisma.conversationParticipant.updateMany({
    where: { conversationId, userId: user.id },
    data: { lastReadAt: new Date() },
  });
}

// ── Archive / Delete ─────────────────────────────────────────────────────

export async function archiveConversation(
  conversationId: string
): Promise<ActionResult<undefined, MsgErrorCode>> {
  const user = await requireUser();

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: user.id },
    },
  });
  if (!participant) return fail("CONVERSATION_NOT_FOUND", "Conversation not found.");

  await prisma.conversationParticipant.update({
    where: { id: participant.id },
    data: { isArchived: true },
  });

  revalidatePath("/account/inbox");
  return ok();
}

export async function deleteConversation(
  conversationId: string
): Promise<ActionResult<undefined, MsgErrorCode>> {
  const user = await requireUser();

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: user.id },
    },
  });
  if (!participant) return fail("CONVERSATION_NOT_FOUND", "Conversation not found.");

  await prisma.conversationParticipant.update({
    where: { id: participant.id },
    data: { isDeleted: true },
  });

  revalidatePath("/account/inbox");
  return ok();
}

// ── User Search (for compose) ────────────────────────────────────────────

export type UserSearchResult = {
  id: string;
  name: string;
  email: string;
};

export async function searchUsers(
  query: string
): Promise<UserSearchResult[]> {
  const user = await requireUser();

  if (!query.trim() || query.trim().length < 2) return [];

  const q = query.trim();

  const users = await prisma.user.findMany({
    where: {
      isApproved: true,
      id: { not: user.id },
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, firstName: true, lastName: true, email: true },
    take: 10,
  });

  return users.map((u) => ({
    id: u.id,
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
    email: u.email,
  }));
}

// ── Broadcast Recipient Count Preview ────────────────────────────────────

export async function getBroadcastRecipientCount(
  targetType: "all" | "zone" | "section",
  targetId?: string
): Promise<number> {
  let where: Prisma.UserWhereInput = { isApproved: true };
  if (targetType === "zone" && targetId) {
    where = { ...where, zoneId: targetId };
  } else if (targetType === "section" && targetId) {
    where = { ...where, section: targetId };
  }
  return prisma.user.count({ where });
}
