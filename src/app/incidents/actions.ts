"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/db";
import { incidentReportSchema, type IncidentReportInput } from "@/lib/schemas";

type IncidentErrorCode = "VALIDATION_ERROR" | "USER_NOT_FOUND" | "DB_ERROR";

export async function reportIncident(
  input: IncidentReportInput
): Promise<ActionResult<undefined, IncidentErrorCode>> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return fail("USER_NOT_FOUND", "User not found. Please complete registration.");

  const parsed = incidentReportSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid incident report.");
  }

  try {
    await prisma.incident.create({
      data: {
        type: parsed.data.type,
        location: parsed.data.location,
        dateTime: new Date(parsed.data.dateTime),
        createdById: user.id,
        reportedBy: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email,
      },
    });
    return ok();
  } catch {
    return fail("DB_ERROR", "Unable to report incident right now. Please try again.");
  }
}
