import Link from "next/link";
import { ExternalLink, Handshake, Shield, Star, Users, ArrowRight } from "lucide-react";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";

type SponsorTier = "PREMIUM" | "PARTNER" | "SUPPORTER";

interface Sponsor {
  id: string;
  name: string;
  content: string | null;
  tagline: string | null;
  linkUrl: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  tier: SponsorTier;
  order: number;
}

interface SponsorShowcaseProps {
  sponsors: Sponsor[];
  showCta?: boolean;
}

function SponsorLogo({
  logoUrl,
  name,
  size = "md",
}: {
  logoUrl: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = {
    sm: { outer: "h-8 w-8", img: "max-h-6", icon: "h-4 w-4" },
    md: { outer: "h-14 w-14", img: "max-h-10", icon: "h-6 w-6" },
    lg: { outer: "h-20 w-20", img: "max-h-14", icon: "h-8 w-8" },
  };
  const cls = sizeMap[size];

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={name}
        width={size === "lg" ? 80 : size === "md" ? 56 : 32}
        height={size === "lg" ? 80 : size === "md" ? 56 : 32}
        className={`${cls.img} w-auto shrink-0 rounded-xl object-contain`}
      />
    );
  }

  return (
    <span
      className={`flex ${cls.outer} shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm`}
    >
      <Shield className={cls.icon} />
    </span>
  );
}

function PremiumSponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <article className="card-sponsor-premium group h-full">
      {/* Banner area */}
      <div className="sponsor-banner">
        {sponsor.bannerUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sponsor.bannerUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="sponsor-banner-gradient flex h-full items-center justify-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <Shield className="h-16 w-16 text-white/30" />
          </div>
        )}
        {/* Logo floating over banner */}
        <div className="absolute bottom-4 left-5 flex items-end gap-3">
          <div className="rounded-2xl bg-white p-2 shadow-elevation-2">
            <SponsorLogo logoUrl={sponsor.logoUrl} name={sponsor.name} size="md" />
          </div>
          <div className="mb-1">
            <span className="tier-badge-premium">
              <Star className="h-3 w-3" />
              Premium Partner
            </span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-5">
        <h3 className="font-display text-xl font-bold text-foreground">{sponsor.name}</h3>
        {sponsor.tagline && (
          <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
            {sponsor.tagline}
          </p>
        )}
        {sponsor.content && (
          <p className="mt-2 text-sm text-muted-foreground">{sponsor.content}</p>
        )}
        <div className="mt-4">
          {sponsor.linkUrl ? (
            <a
              href={sponsor.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Visit partner site
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">Community partner</span>
          )}
        </div>
      </div>
    </article>
  );

  return content;
}

function PartnerSponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const inner = (
    <article className="card-sponsor-partner group h-full">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent px-5 py-5">
          <div className="rounded-xl bg-white p-2 shadow-elevation-1 ring-1 ring-border/30">
            {sponsor.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-contain"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-foreground">{sponsor.name}</h3>
              <span className="tier-badge-partner">Partner</span>
            </div>
            {sponsor.tagline && (
              <p className="mt-1 text-xs font-medium text-primary/80">{sponsor.tagline}</p>
            )}
          </div>
        </div>
        {/* Body */}
        <div className="flex flex-1 flex-col justify-between px-5 py-4">
          {sponsor.content && (
            <p className="text-sm text-muted-foreground">{sponsor.content}</p>
          )}
          <div className="mt-3">
            {sponsor.linkUrl ? (
              <a
                href={sponsor.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Visit partner
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">Community partner</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );

  return <div className="h-full">{inner}</div>;
}

function SupporterWall({ supporters }: { supporters: Sponsor[] }) {
  return (
    <div className="mt-6 rounded-2xl border border-border/50 bg-muted/30 px-6 py-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Community Supporters
      </p>
      <div className="flex flex-wrap gap-3">
        {supporters.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 shadow-elevation-1"
          >
            {s.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.logoUrl}
                alt={s.name}
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-contain"
              />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                <Users className="h-3 w-3 text-muted-foreground" />
              </span>
            )}
            <span className="text-sm font-medium text-foreground/80">{s.name}</span>
            {s.linkUrl && (
              <a
                href={s.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label={`Visit ${s.name}`}
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BecomeSponsorCta() {
  return (
    <AnimateItem className="mt-8">
      <Link href="/contact" className="block">
        <div className="sponsor-cta-banner group relative px-8 py-8 md:flex md:items-center md:justify-between md:gap-8">
          {/* Ambient grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Glow blobs */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />

          <div className="relative flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
              <Handshake className="h-7 w-7 text-white" />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-white">Become a sponsor</p>
              <p className="mt-1 text-sm text-white/75">
                Support patrol operations and build trusted local visibility. Our sponsors reach
                500+ households across Plumstead.
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-white/60">
                <span>✓ Logo on website</span>
                <span>✓ Newsletter mentions</span>
                <span>✓ Community recognition</span>
              </div>
            </div>
          </div>

          <div className="relative mt-6 shrink-0 md:mt-0">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-elevation-2 transition-all duration-200 group-hover:shadow-elevation-3 group-hover:scale-[1.02]">
              Partner with us
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </AnimateItem>
  );
}

export function SponsorShowcase({ sponsors, showCta = true }: SponsorShowcaseProps) {
  const premium = sponsors.filter((s) => s.tier === "PREMIUM");
  const partners = sponsors.filter((s) => s.tier === "PARTNER");
  const supporters = sponsors.filter((s) => s.tier === "SUPPORTER");

  if (sponsors.length === 0) return null;

  return (
    <AnimateSection aria-labelledby="sponsors-heading">
      {/* Section header */}
      <AnimateItem className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Community Partners
          </span>
          <h2 id="sponsors-heading" className="section-heading mt-2">
            <span className="headline-gradient">Supported by</span>
          </h2>
        </div>
        <Link href="/sponsors" className="text-sm font-semibold text-primary hover:underline">
          View all sponsors
        </Link>
      </AnimateItem>

      {/* PREMIUM — hero cards, 2 col */}
      {premium.length > 0 && (
        <AnimateItem className="mt-6">
          <div className={`grid gap-5 ${premium.length === 1 ? "max-w-lg" : "sm:grid-cols-2"}`}>
            {premium.map((s) => (
              <PremiumSponsorCard key={s.id} sponsor={s} />
            ))}
          </div>
        </AnimateItem>
      )}

      {/* PARTNER — professional cards, 3 col */}
      {partners.length > 0 && (
        <AnimateItem className={premium.length > 0 ? "mt-5" : "mt-6"}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((s) => (
              <PartnerSponsorCard key={s.id} sponsor={s} />
            ))}
          </div>
        </AnimateItem>
      )}

      {/* SUPPORTER — logo wall */}
      {supporters.length > 0 && (
        <AnimateItem>
          <SupporterWall supporters={supporters} />
        </AnimateItem>
      )}

      {/* CTA */}
      {showCta && <BecomeSponsorCta />}
    </AnimateSection>
  );
}
