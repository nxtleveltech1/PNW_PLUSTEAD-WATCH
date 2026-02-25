import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/user-profile(.*)",
  "/admin(.*)",
  "/api/private(.*)",
  "/business/submit",
  "/business/messages",
  "/business/referrals",
]);

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerkHandler = hasClerk
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) await auth.protect();
    })
  : null;

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!clerkHandler) return NextResponse.next();
  return clerkHandler(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
