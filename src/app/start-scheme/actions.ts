"use server";

import { revalidatePath } from "next/cache";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/db";
import { type SchemeInquiryInput, schemeInquirySchema } from "@/lib/schemas";

type SchemeErrorCode = "VALIDATION_ERROR" | "DB_ERROR";
const toNull = (value?: string | null) => (value && value.trim().length > 0 ? value : null);

export async function submitSchemeInquiry(
  input: SchemeInquiryInput
): Promise<ActionResult<undefined, SchemeErrorCode>> {
  const parsed = schemeInquirySchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    await prisma.schemeInquiry.create({
      data: {
        ...parsed.data,
        phone: toNull(parsed.data.phone),
        address: toNull(parsed.data.address),
        message: toNull(parsed.data.message),
      },
    });
    revalidatePath("/start-scheme");
    return ok();
  } catch {
    return fail("DB_ERROR", "Failed to submit");
  }
}
