"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserAvatarDropdown } from "@/components/user/user-avatar-dropdown";
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
  { href: "/find", label: "Find Zone" },
  { href: "/safety-tips", label: "Safety Tips" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/documents", label: "Documents" },
];

const organisationLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help" },
  { href: "/donate", label: "Donate" },
  { href: "/sponsors", label: "Sponsors" },
];

const accountLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/account", label: "Account" },
];

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
          className="md:hidden min-h-[44px] min-w-[44px]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-80 rounded-l-2xl rounded-r-none border-l border-border/80">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-6 px-4 pb-8" aria-label="Mobile navigation">
          <div>
            <h3 className="mb-3 flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="inline-block h-3.5 w-0.5 rounded-full bg-primary" aria-hidden />
              Operations
            </h3>
            <ul className="space-y-1" role="list">
              {operationsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
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
            <ul className="space-y-1" role="list">
              {organisationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
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
              <ul className="space-y-1" role="list">
                {accountLinksFiltered.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-2 flex flex-col gap-2 border-t border-border/70 pt-6">
            <Button asChild className="min-h-[44px] w-full justify-center">
              <Link href="/incidents">Report incident</Link>
            </Button>
            {hasClerk ? (
              <>
                <SignedOut>
                  <Button asChild variant="outline" className="min-h-[44px] w-full justify-center">
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild variant="outline" className="min-h-[44px] w-full justify-center">
                    <Link href="/register/guest">Register guest</Link>
                  </Button>
                  <Button asChild className="min-h-[44px] w-full justify-center">
                    <Link href="/register">Join us</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserAvatarDropdown showAdmin={showAdmin} />
                  </div>
                </SignedIn>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="min-h-[44px] w-full justify-center">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild variant="outline" className="min-h-[44px] w-full justify-center">
                  <Link href="/register/guest">Register guest</Link>
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
