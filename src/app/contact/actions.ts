"use server";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/db";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/schemas";

type ContactErrorCode = "VALIDATION_ERROR" | "DB_ERROR";

export async function submitContactMessage(
  input: ContactMessageInput
): Promise<ActionResult<undefined, ContactErrorCode>> {
  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  try {
    await prisma.contactMessage.create({
      data: parsed.data,
    });
    return ok();
  } catch {
    return fail("DB_ERROR", "Unable to send message right now. Please try again.");
  }
}
