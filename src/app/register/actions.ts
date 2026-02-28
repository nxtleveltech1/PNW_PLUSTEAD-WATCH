"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
