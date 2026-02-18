"use server";

import { revalidatePath } from "next/cache";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/db";
import { type VacationWatchInput, vacationWatchSchema } from "@/lib/schemas";

type VacationWatchErrorCode = "VALIDATION_ERROR" | "DB_ERROR";
const toNull = (value?: string | null) => (value && value.trim().length > 0 ? value : null);

export async function submitVacationWatch(
  input: VacationWatchInput
): Promise<ActionResult<undefined, VacationWatchErrorCode>> {
  const parsed = vacationWatchSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    await prisma.vacationWatch.create({
      data: {
        ...parsed.data,
        awayFrom: new Date(parsed.data.awayFrom),
        awayUntil: new Date(parsed.data.awayUntil),
        emergencyContact: toNull(parsed.data.emergencyContact),
        specialInstructions: toNull(parsed.data.specialInstructions),
      },
    });
    revalidatePath("/vacation-watch");
    return ok();
  } catch {
    return fail("DB_ERROR", "Failed to register");
  }
}
