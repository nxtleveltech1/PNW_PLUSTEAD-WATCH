"use client";

import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const operationsLinks = [
  { href: "/incidents", label: "Incidents" },
  { href: "/events", label: "Events" },
  { href: "/business", label: "Business" },
  { href: "/find", label: "Zone Map" },
  { href: "/safety-tips", label: "Safety Tips" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/documents", label: "Documents" },
];

const organisationLinks = [
  { href: "/about", label: "About" },
  { href: "/associations", label: "Associations" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help" },
  { href: "/donate", label: "Donate" },
  { href: "/sponsors", label: "Sponsors" },
];

const accountLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/account", label: "Account" },
];

function MobileUserInfo() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded || !user) return null;

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.primaryEmailAddress?.emailAddress ||
    "Member";
  const initials = user.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
        <Avatar className="h-9 w-9 shrink-0 border-2 border-primary/20">
          <AvatarImage src={user.imageUrl} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="min-h-[44px] w-full justify-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={async () => {
          await signOut({ redirectUrl: "/" });
          router.push("/");
        }}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}

export function MobileNav({ showAdmin = false }: { showAdmin?: boolean }) {
  const accountLinksFiltered = showAdmin
    ? [...accountLinks, { href: "/admin", label: "Admin" }]
    : accountLinks;

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="min-h-[44px] min-w-[44px] md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="inset-y-0 right-0 h-full w-[min(20rem,85vw)] rounded-l-2xl rounded-r-none border-l border-border/80 bg-background/95">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-8" aria-label="Mobile navigation">
          <div>
            <h3 className="mb-3 flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="inline-block h-3.5 w-0.5 rounded-full bg-primary" aria-hidden />
              Operations
            </h3>
            <ul className="space-y-0.5" role="list">
              {operationsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-[44px] items-center rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="inline-block h-3.5 w-0.5 rounded-full bg-primary" aria-hidden />
              Organisation
            </h3>
            <ul className="space-y-0.5" role="list">
              {organisationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-[44px] items-center rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {hasClerk && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <span className="inline-block h-3.5 w-0.5 rounded-full bg-primary" aria-hidden />
                Account
              </h3>
              <ul className="space-y-0.5" role="list">
                {accountLinksFiltered.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-[44px] items-center rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-2 flex flex-col gap-2 border-t border-border/70 pt-6">
            <Button
              asChild
              className="min-h-[44px] w-full justify-center bg-accent text-accent-foreground shadow-[0_10px_24px_rgb(206_67_44_/_0.24)] hover:bg-accent/90"
            >
              <Link href="/incidents">Report incident</Link>
            </Button>
            {hasClerk ? (
              <>
                <SignedOut>
                  <Button asChild variant="outline" className="min-h-[44px] w-full justify-center">
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild className="min-h-[44px] w-full justify-center">
                    <Link href="/register">Join us</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <MobileUserInfo />
                </SignedIn>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="min-h-[44px] w-full justify-center">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild className="min-h-[44px] w-full justify-center">
                  <Link href="/register">Join us</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
