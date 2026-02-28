import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { registrationPreparationSchema } from "@/lib/schemas";
import type { RegistrationPreparationInput } from "@/lib/schemas";

const REG_COOKIE = "pnw_registration";

export async function GET() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const cookieStore = await cookies();
  const raw = cookieStore.get(REG_COOKIE)?.value;
  cookieStore.delete(REG_COOKIE);

  if (!raw) {
    redirect("/dashboard");
  }

  let data: RegistrationPreparationInput;
  try {
    data = registrationPreparationSchema.parse(JSON.parse(raw));
  } catch {
    redirect("/dashboard");
  }

  await prisma.user.updateMany({
    where: { clerkId: userId },
    data: {
      zoneId: data.zoneId,
      memberType: data.memberType,
      streetId: data.streetId ?? null,
      houseNumber: data.houseNumber ?? null,
      hideFromNeighbours: data.hideFromNeighbours ?? false,
      patrolOptIn: data.patrolOptIn ?? false,
      secondaryContactName: data.secondaryContactName ?? null,
      secondaryContactPhone: data.secondaryContactPhone ?? null,
      secondaryContactEmail: data.secondaryContactEmail ?? null,
      emailPrefs: data.emailPrefs ? (data.emailPrefs as object) : undefined,
      whatsappOptIn: data.whatsappOptIn,
      whatsappPhone: data.whatsappPhone ?? null,
    },
  });

  if (data.memberType === "MEMBER") {
    redirect("/register/payment");
  }

  redirect("/dashboard");
}
