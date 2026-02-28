import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const opsLinks = [
  { href: "/incidents", label: "Incidents" },
  { href: "/events", label: "Events" },
  { href: "/business", label: "Business" },
  { href: "/find", label: "Find Zone" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/safety-tips", label: "Safety Tips" },
  { href: "/documents", label: "Documents" },
];

const orgLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help" },
  { href: "/donate", label: "Donate" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "mailto:info@plumsteadwatch.org.za?subject=Website%20advertising", label: "Advertise" },
];

const membershipLinks = [
  { href: "/register", label: "Register (member)" },
  { href: "/register/guest", label: "Register (guest)" },
];

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const CVIC_NUMBER = "0860 002 669";
const CVIC_TEL = "tel:0860002669";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      role="contentinfo"
      tabIndex={-1}
      className="mt-auto bg-gradient-to-b from-secondary/60 to-muted/30"
    >
      <div className="divider-gradient" />
      <div className="container py-10 md:py-12">
        <div className="footer-shell grid gap-10 rounded-2xl border border-border/60 bg-background/70 p-6 shadow-[var(--shadow-elevation-1)] backdrop-blur-sm md:grid-cols-12 md:gap-x-6 md:p-8 lg:gap-x-8">
          {/* Brand block */}
          <section
            className="md:col-span-5 lg:col-span-4"
            aria-labelledby="footer-brand"
          >
            <h2 id="footer-brand" className="sr-only">
              Plumstead Neighbourhood Watch
            </h2>
            <Link
              href="/"
              aria-label="Plumstead Neighbourhood Watch home"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
            >
              <div className="relative h-32 w-[200px] shrink-0 overflow-hidden">
                <Image
                  src="/images/full%20logo.jpg"
                  alt="Plumstead Neighbourhood Watch"
                  fill
                  className="object-contain object-left"
                  sizes="200px"
                />
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Community-led safety coordination for Plumstead. Stay informed,
              report incidents, and support local response operations.
            </p>
            <address className="mt-6 not-italic">
              <a
                href={CVIC_TEL}
                className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg bg-alert-muted px-4 py-3 text-sm font-semibold text-accent shadow-[0_8px_20px_rgb(206_67_44_/_0.15)] transition-colors hover:bg-alert-muted/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`Call CVIC emergency line: ${CVIC_NUMBER}`}
              >
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                CVIC {CVIC_NUMBER}
              </a>
            </address>
          </section>

          {/* Nav columns */}
          <nav
            className="md:col-span-7 lg:col-span-8 w-full"
            aria-label="Site map"
          >
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
              <div>
                <h3 className="footer-eyebrow flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <span className="inline-block h-3.5 w-0.5 rounded-full bg-primary" aria-hidden />
                  Membership
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {membershipLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="footer-link rounded text-sm font-medium text-foreground/90 transition-colors hover:text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="footer-eyebrow flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <span className="inline-block h-3.5 w-0.5 rounded-full bg-primary" aria-hidden />
                  Operations
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {opsLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="footer-link rounded text-sm font-medium text-foreground/90 transition-colors hover:text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="footer-eyebrow flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <span className="inline-block h-3.5 w-0.5 rounded-full bg-primary" aria-hidden />
                  Organisation
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {orgLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="footer-link rounded text-sm font-medium text-foreground/90 transition-colors hover:text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="footer-eyebrow flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <span className="inline-block h-3.5 w-0.5 rounded-full bg-primary" aria-hidden />
                  Legal
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="footer-link rounded text-sm font-medium text-foreground/90 transition-colors hover:text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="sm" className="bg-accent px-4 text-accent-foreground shadow-[0_10px_24px_rgb(206_67_44_/_0.22)] hover:bg-accent/90">
            <Link href="/incidents">Report incident</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="bg-background/70">
            <Link href="/register">Join us</Link>
          </Button>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-border/60 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <small className="text-sm text-muted-foreground">
              © {year} Plumstead Neighbourhood Watch. All rights reserved.{" "}
              <a
                href="https://www.octoxgroup.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/80 hover:text-foreground hover:underline"
              >
                Development Copyright
              </a>
            </small>
            <p className="text-xs text-muted-foreground/80">
              On Alert — Community safety coordination
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
