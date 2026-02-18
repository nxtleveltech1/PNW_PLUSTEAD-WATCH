"use server";

import { revalidatePath } from "next/cache";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/db";
import { type VolunteerInterestInput, volunteerInterestSchema } from "@/lib/schemas";

type VolunteerErrorCode = "VALIDATION_ERROR" | "DB_ERROR";
const toNull = (value?: string | null) => (value && value.trim().length > 0 ? value : null);

export async function submitVolunteerInterest(
  input: VolunteerInterestInput
): Promise<ActionResult<undefined, VolunteerErrorCode>> {
  const parsed = volunteerInterestSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    await prisma.volunteerInterest.create({
      data: {
        ...parsed.data,
        phone: toNull(parsed.data.phone),
        zoneId: toNull(parsed.data.zoneId),
        availability: toNull(parsed.data.availability),
        message: toNull(parsed.data.message),
      },
    });
    revalidatePath("/volunteer");
    return ok();
  } catch {
    return fail("DB_ERROR", "Failed to submit");
  }
}
