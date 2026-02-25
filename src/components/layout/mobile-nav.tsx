"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/user-profile", label: "Account" },
  { href: "/incidents", label: "Incidents" },
  { href: "/events", label: "Events" },
  { href: "/find", label: "Find Zone" },
  { href: "/safety-tips", label: "Safety Tips" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/about", label: "About" },
  { href: "/documents", label: "Documents" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-80 rounded-l-2xl rounded-r-none border-l border-border/80">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-2 px-4 pb-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-border/70 pt-4">
            <Button asChild className="w-full justify-center">
              <Link href="/incidents">Report incident</Link>
            </Button>
            {hasClerk ? (
              <>
                <SignedOut>
                  <Button asChild variant="outline" className="w-full justify-center">
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link href="/register">Join us</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button asChild variant="outline" className="w-full justify-center">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <div className="flex justify-center">
                    <UserButton
                      afterSignOutUrl="/"
                      userProfileUrl="/user-profile"
                      userProfileMode="navigation"
                    >
                      <UserButton.MenuItems>
                        <UserButton.Link
                          label="Account"
                          labelIcon={<User className="h-4 w-4" />}
                          href="/user-profile"
                        />
                      </UserButton.MenuItems>
                    </UserButton>
                  </div>
                </SignedIn>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild className="w-full justify-center">
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
