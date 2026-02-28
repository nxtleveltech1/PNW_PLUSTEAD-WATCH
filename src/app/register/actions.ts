"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { RegistrationPreparationInput } from "@/lib/schemas";
import { registrationPreparationSchema } from "@/lib/schemas";

const REG_COOKIE = "pnw_registration";
const MAX_AGE = 3600;

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

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
  const base = getBaseUrl();
  redirect(`${base}/sign-up?redirect_url=${encodeURIComponent(`${base}/register/complete`)}`);
}
