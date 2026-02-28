"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const filteredMoreLinks = showAdmin
    ? [...moreNavLinks, { href: "/admin", label: "Admin" }, { href: "/account", label: "Account" }]
    : moreNavLinks;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      {/* Topbar */}
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

      {/* Main header */}
      <div className="border-b border-border/60">
        <div className="container flex h-16 items-center gap-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Plumstead Neighbourhood Watch home"
          >
            <div className="relative h-10 w-[108px] shrink-0 overflow-hidden md:h-11 md:w-[120px]">
              <Image
                src="/images/header%20logo.jpg"
                alt=""
                fill
                className="object-contain object-left"
                sizes="(max-width: 768px) 108px, 120px"
                priority
              />
            </div>
            <span className="hidden text-sm font-bold uppercase tracking-wide text-foreground md:inline">
              Plumstead Neighbourhood Watch
            </span>
          </Link>

          <div className="ml-auto md:hidden">
            <MobileNav showAdmin={showAdmin} />
          </div>

          <nav className="ml-auto hidden items-center md:flex" aria-label="Main navigation">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex h-16 items-center px-4 text-[0.8125rem] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive(link.href)
                    ? "text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-[2px] after:rounded-full after:bg-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative flex h-16 items-center gap-1 px-4 text-[0.8125rem] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    filteredMoreLinks.some((l) => isActive(l.href))
                      ? "text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-[2px] after:rounded-full after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-haspopup="menu"
                >
                  More
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[10rem]">
                {filteredMoreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={
                        isActive(link.href)
                          ? "font-semibold text-primary"
                          : ""
                      }
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {hasClerk ? (
              <>
                <SignedOut>
                  <Button asChild variant="ghost" size="sm" className="h-9 px-3 text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground">
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild size="sm" className="h-9 px-4 text-[0.8125rem] font-semibold">
                    <Link href="/register">Join</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserAvatarDropdown showAdmin={showAdmin} />
                </SignedIn>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="h-9 px-3 text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="h-9 px-4 text-[0.8125rem] font-semibold">
                  <Link href="/register">Join</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
