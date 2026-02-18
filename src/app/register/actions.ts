"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import type { RegistrationPreparationInput } from "@/lib/schemas";
import { registrationPreparationSchema } from "@/lib/schemas";

const REG_COOKIE = "pnw_registration";
const MAX_AGE = 3600;

export async function prepareRegistration(data: RegistrationPreparationInput) {
  const parsed = registrationPreparationSchema.parse(data);
  const cookieStore = await cookies();
  cookieStore.set(REG_COOKIE, JSON.stringify(parsed), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  redirect(`${base}/sign-up?redirect_url=${encodeURIComponent(`${base}/register/complete`)}`);
}

export async function completeRegistration() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const cookieStore = await cookies();
  const raw = cookieStore.get(REG_COOKIE)?.value;
  cookieStore.delete(REG_COOKIE);

  if (!raw) {
    redirect("/dashboard");
    return;
  }

  let data: RegistrationPreparationInput;
  try {
    data = registrationPreparationSchema.parse(JSON.parse(raw));
  } catch {
    redirect("/dashboard");
    return;
  }

  await prisma.user.updateMany({
    where: { clerkId: userId },
    data: {
      zoneId: data.zoneId,
      memberType: data.memberType,
      whatsappOptIn: data.whatsappOptIn,
      whatsappPhone: data.whatsappPhone ?? null,
    },
  });

  redirect("/dashboard");
}
