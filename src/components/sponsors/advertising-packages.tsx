"use client";

import { Check, X, Store, TrendingUp, Crown, Mail } from "lucide-react";

const ADVERTISE_EMAIL = "info@plumsteadwatch.org.za";

interface Feature {
  label: string;
  community: boolean;
  growth: boolean;
  premium: boolean;
}

const FEATURES: Feature[] = [
  { label: "Business directory listing", community: true, growth: true, premium: true },
  { label: "Featured placement on hub page", community: false, growth: true, premium: true },
  { label: "Newsletter mention (monthly)", community: false, growth: true, premium: true },
  { label: "Banner ad on incident page", community: false, growth: false, premium: true },
  { label: "Social media spotlight post", community: false, growth: false, premium: true },
  { label: "Priority response to enquiries", community: false, growth: false, premium: true },
];

function FeatureRow({ included, label }: { included: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2.5 py-1.5">
      {included ? (
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
          <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
        </span>
      ) : (
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted">
          <X className="h-2.5 w-2.5 text-muted-foreground/60" strokeWidth={3} />
        </span>
      )}
      <span className={`text-sm ${included ? "text-foreground" : "text-muted-foreground/70"}`}>
        {label}
      </span>
    </li>
  );
}

function CommunityCard() {
  const subject = encodeURIComponent("Community advertising enquiry — PNW");
  return (
    <div className="card-package flex h-full flex-col">
      <div className="border-b border-border/50 bg-muted/30 px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Store className="h-5 w-5 text-muted-foreground" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">Community</p>
            <p className="text-xs text-muted-foreground">Get found locally</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 py-5 sm:px-6">
        <ul className="flex-1 space-y-0.5">
          {FEATURES.map((f) => (
            <FeatureRow key={f.label} included={f.community} label={f.label} />
          ))}
        </ul>
        <a
          href={`mailto:${ADVERTISE_EMAIL}?subject=${subject}`}
          className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
        >
          <Mail className="h-4 w-4" />
          Enquire
        </a>
      </div>
    </div>
  );
}

function GrowthCard() {
  const subject = encodeURIComponent("Growth advertising enquiry — PNW");
  return (
    <div className="card-package-featured flex h-full flex-col">
      {/* Popular ribbon */}
      <div className="package-ribbon" aria-hidden />
      <div className="border-b border-primary/20 bg-gradient-to-br from-primary/8 to-transparent px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <TrendingUp className="h-5 w-5 text-primary" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">Growth</p>
            <p className="text-xs text-primary/70">Most popular choice</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 py-5 sm:px-6">
        <ul className="flex-1 space-y-0.5">
          {FEATURES.map((f) => (
            <FeatureRow key={f.label} included={f.growth} label={f.label} />
          ))}
        </ul>
        <a
          href={`mailto:${ADVERTISE_EMAIL}?subject=${subject}`}
          className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Mail className="h-4 w-4" />
          Enquire
        </a>
      </div>
    </div>
  );
}

function PremiumAdCard() {
  const subject = encodeURIComponent("Premium advertising enquiry — PNW");
  return (
    <div className="card-package flex h-full flex-col" style={{ borderTop: "3px solid #f59e0b" }}>
      <div className="border-b border-border/50 bg-gradient-to-br from-amber-50 to-transparent px-4 py-5 dark:from-amber-950/20 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
            <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">Premium</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Maximum visibility</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 py-5 sm:px-6">
        <ul className="flex-1 space-y-0.5">
          {FEATURES.map((f) => (
            <FeatureRow key={f.label} included={f.premium} label={f.label} />
          ))}
        </ul>
        <a
          href={`mailto:${ADVERTISE_EMAIL}?subject=${subject}`}
          className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          <Mail className="h-4 w-4" />
          Enquire
        </a>
      </div>
    </div>
  );
}

export function AdvertisingPackages() {
  return (
    <section aria-labelledby="ad-packages-heading">
      {/* Section header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Grow your business
          </span>
          <h2 id="ad-packages-heading" className="section-heading mt-2">
            <span className="headline-gradient">Advertising packages</span>
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Reach 500+ Plumstead households. Choose a package that fits your goals — from local
            directory visibility to full community partnership.
          </p>
        </div>
      </div>

      {/* Reach stat strip */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { label: "Households reached", value: "500+" },
          { label: "Monthly page views", value: "2 000+" },
          { label: "Active members", value: "300+" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2"
          >
            <span className="font-display text-base font-bold text-primary">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Package cards — Growth is centre and slightly taller via -mt offset on sm+ */}
      <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-3">
        <CommunityCard />
        <div className="sm:-mt-4">
          <GrowthCard />
        </div>
        <PremiumAdCard />
      </div>

      {/* Footer note */}
      <p className="mt-5 text-center text-xs text-muted-foreground">
        All enquiries are responded to within 2 business days.{" "}
        <a
          href={`mailto:${ADVERTISE_EMAIL}`}
          className="font-semibold text-primary hover:underline"
        >
          {ADVERTISE_EMAIL}
        </a>
      </p>
    </section>
  );
}
