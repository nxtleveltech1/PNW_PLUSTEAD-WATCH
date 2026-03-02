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
  { href: "/associations", label: "Associations" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help" },
  { href: "/donate", label: "Donate" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "mailto:info@plumsteadwatch.org.za?subject=Website%20advertising", label: "Advertise" },
];

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const membershipLinks = [
  { href: "/register", label: "Register" },
];

const CVIC_NUMBER = "0860 002 669";
const CVIC_TEL = "tel:0860002669";

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-2 space-y-0.5" role="list">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex py-1.5 text-[0.8125rem] text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      role="contentinfo"
      tabIndex={-1}
      className="footer-surface mt-auto"
    >
      <div className="divider-gradient" />

      <div className="container py-8 md:py-16">
        <div className="grid gap-8 md:grid-cols-12 md:gap-x-8 lg:gap-x-12">
          {/* Brand */}
          <section className="md:col-span-4 lg:col-span-3" aria-labelledby="footer-brand">
            <h2 id="footer-brand" className="sr-only">Plumstead Neighbourhood Watch</h2>

            <div className="flex items-start gap-4 sm:flex-col sm:gap-0">
              <Link
                href="/"
                aria-label="Plumstead Neighbourhood Watch home"
                className="inline-block shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="relative h-16 w-[100px] overflow-hidden sm:h-28 sm:w-[180px]">
                  <Image
                    src="/images/full%20logo.jpg"
                    alt="Plumstead Neighbourhood Watch"
                    fill
                    className="object-contain object-left"
                    sizes="(max-width: 640px) 100px, 180px"
                  />
                </div>
              </Link>

              <p className="max-w-xs text-[0.8125rem] leading-relaxed text-muted-foreground sm:mt-4">
                Community-led safety coordination for Plumstead. Stay informed,
                report incidents, and support local response operations.
              </p>
            </div>

            <address className="mt-4 not-italic sm:mt-5">
              <a
                href={CVIC_TEL}
                className="inline-flex items-center gap-2 rounded-lg bg-alert-muted px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-alert-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`Call CVIC emergency line: ${CVIC_NUMBER}`}
              >
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                CVIC {CVIC_NUMBER}
              </a>
            </address>
          </section>

          {/* Nav columns */}
          <nav className="md:col-span-8 lg:col-span-9" aria-label="Site map">
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-6 md:grid-cols-4 md:gap-x-8">
              <FooterColumn title="Operations" links={opsLinks} />
              <FooterColumn title="Organisation" links={orgLinks} />
              <div className="space-y-5">
                <FooterColumn title="Legal" links={legalLinks} />
                <FooterColumn title="Join" links={membershipLinks} />
              </div>
              <div className="hidden md:block">
                <FooterColumn title="Membership" links={membershipLinks} />
              </div>
            </div>
          </nav>
        </div>

        {/* CTA row */}
        <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/incidents">Report incident</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/register">Join us</Link>
          </Button>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-border/40 pt-4 sm:mt-8 sm:pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <small className="text-xs text-muted-foreground sm:text-sm">
              &copy; {year} Plumstead Neighbourhood Watch. All rights reserved.{" "}
              <a
                href="https://www.octoxgroup.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/70 hover:text-foreground hover:underline"
              >
                Development Copyright
              </a>
            </small>
            <p className="text-[0.6875rem] text-muted-foreground/70 sm:text-xs">
              On Alert &mdash; Community safety coordination
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
