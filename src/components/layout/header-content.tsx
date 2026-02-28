"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { AlertTriangle, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatarDropdown } from "@/components/user/user-avatar-dropdown";
import { MobileNav } from "./mobile-nav";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const primaryNavLinks = [
  { href: "/incidents", label: "Incidents" },
  { href: "/events", label: "Events" },
  { href: "/business", label: "Business" },
  { href: "/find", label: "Find Zone" },
];

const moreNavLinks = [
  { href: "/safety-tips", label: "Safety Tips" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help" },
];

export function HeaderContent({ showAdmin = false }: { showAdmin?: boolean }) {
  const filteredMoreLinks = showAdmin
    ? [...moreNavLinks, { href: "/admin", label: "Admin" }, { href: "/account", label: "Account" }]
    : moreNavLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="topbar-premium border-b border-accent/15">
        <div className="container flex min-h-[2.625rem] items-center gap-3 py-1">
          <p className="hidden items-center gap-2 text-xs font-semibold tracking-wide text-accent sm:inline-flex">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Report incidents immediately
          </p>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="tel:0860002669"
              className="topbar-phone inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-accent hover:text-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Call CVIC 0860 002 669"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              CVIC 0860 002 669
            </a>
            <Button
              asChild
              size="sm"
              className="topbar-report-btn min-h-[34px] bg-accent px-3.5 text-xs font-semibold text-accent-foreground shadow-[0_8px_20px_rgb(206_67_44_/_0.38)] hover:bg-accent/90"
            >
              <Link href="/incidents">Report</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="container flex min-h-[4.75rem] items-center gap-6 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-lg px-1.5 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Plumstead Neighbourhood Watch home"
        >
          <div className="relative h-11 w-[116px] shrink-0 overflow-hidden md:h-12 md:w-[128px]">
            <Image
              src="/images/header%20logo.jpg"
              alt=""
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 120px, 140px"
              priority
            />
          </div>
          <span className="hidden text-[0.95rem] font-semibold tracking-tight text-foreground md:inline lg:text-base">
            PLUMSTEAD NEIGHBOURHOOD WATCH
          </span>
        </Link>
        <div className="ml-auto md:hidden">
          <MobileNav showAdmin={showAdmin} />
        </div>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="header-nav-link flex min-h-[44px] min-w-[44px] items-center rounded-md px-3 py-2.5 text-sm font-semibold text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="header-nav-link inline-flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-md px-3 py-2.5 text-sm font-semibold text-foreground"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                More
                <ChevronDown className="h-4 w-4" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              {filteredMoreLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="hidden items-center gap-1.5 md:flex">
          {hasClerk ? (
            <>
              <SignedOut>
                <Button asChild variant="ghost" size="sm" className="min-h-[44px] px-3 font-medium">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="min-h-[44px] px-4 shadow-[0_10px_24px_rgb(24_39_75_/_0.16)]">
                  <Link href="/register">Join</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <UserAvatarDropdown showAdmin={showAdmin} />
              </SignedIn>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="min-h-[44px] px-3 font-medium">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="min-h-[44px] px-4 shadow-[0_10px_24px_rgb(24_39_75_/_0.16)]">
                <Link href="/register">Join</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
