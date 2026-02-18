import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

const opsLinks = [
  { href: "/incidents", label: "Incidents" },
  { href: "/events", label: "Events" },
  { href: "/find", label: "Find Zone" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/safety-tips", label: "Safety Tips" },
  { href: "/documents", label: "Documents" },
];

const orgLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/donate", label: "Donate" },
  { href: "/sponsors", label: "Sponsors" },
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
      className="mt-auto border-t border-border/80 bg-secondary/40"
    >
      <div className="container py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-10 lg:gap-x-12">
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
              <div className="relative h-48 w-[320px] shrink-0 overflow-hidden">
                <Image
                  src="/images/full%20logo.jpg"
                  alt="Plumstead Neighbourhood Watch"
                  fill
                  className="object-contain object-left"
                  sizes="320px"
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
                className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg bg-alert-muted px-4 py-3 text-sm font-semibold text-accent transition-colors hover:bg-alert-muted/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`Call CVIC emergency line: ${CVIC_NUMBER}`}
              >
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
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Operations
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {opsLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-foreground/90 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Organisation
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {orgLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-foreground/90 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Legal
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-foreground/90 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
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

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border/60 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <small className="text-sm text-muted-foreground">
              © {year} Plumstead Neighbourhood Watch. All rights reserved.
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
