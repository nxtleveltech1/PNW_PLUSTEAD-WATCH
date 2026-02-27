import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatarDropdown } from "@/components/user/user-avatar-dropdown";
import { MobileNav } from "./mobile-nav";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const allNavLinks = [
  { href: "/incidents", label: "Incidents" },
  { href: "/events", label: "Events" },
  { href: "/business", label: "Business" },
  { href: "/admin", label: "Admin" },
  { href: "/account", label: "Account" },
  { href: "/find", label: "Find Zone" },
  { href: "/safety-tips", label: "Safety Tips" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function HeaderContent({ showAdmin = false }: { showAdmin?: boolean }) {
  const navLinks = showAdmin
    ? allNavLinks
    : allNavLinks.filter((l) => l.href !== "/admin");

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="border-b border-accent/15 bg-gradient-to-r from-alert-muted via-alert-muted/95 to-background/70">
        <div className="container flex h-10 items-center justify-end gap-6 text-xs font-semibold text-accent">
          <p className="inline-flex items-center gap-2 tracking-wide">
            <AlertTriangle className="h-3.5 w-3.5" />
            Report incidents immediately
          </p>
          <a href="tel:0860002669" className="inline-flex items-center gap-1.5 hover:text-accent/80">
            <Phone className="h-3.5 w-3.5" />
            CVIC 0860 002 669
          </a>
        </div>
      </div>
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-0">
          <div className="relative h-16 w-[140px] shrink-0 overflow-hidden">
            <Image
              src="/images/header%20logo.jpg"
              alt="Header logo"
              fill
              className="object-contain object-left"
              sizes="140px"
              priority
            />
          </div>
          <span className="-ml-12 hidden text-lg font-semibold tracking-tight text-foreground md:inline">
            PLUMSTEAD NEIGHBORHOOD WATCH
          </span>
        </Link>
        <div className="md:hidden">
          <MobileNav showAdmin={showAdmin} />
        </div>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="hidden border-accent/40 text-accent hover:bg-accent/10 sm:inline-flex">
            <Link href="/incidents">Report</Link>
          </Button>
          {hasClerk ? (
            <>
              <SignedOut>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Join</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserAvatarDropdown />
              </SignedIn>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Join</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
