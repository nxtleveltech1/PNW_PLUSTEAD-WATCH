import { AnimateSection } from "@/components/ui/animate-section";

type HeroAccent = "cool" | "warm";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  gradient?: boolean;
  accent?: HeroAccent;
}

export function PageHero({
  eyebrow,
  title,
  description,
  gradient = true,
  accent = "cool",
}: PageHeroProps) {
  const warmOrbs = accent === "warm";

  return (
    <AnimateSection>
      <div className="page-hero relative">
        {/* Decorative gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
          style={{
            background: warmOrbs
              ? "hsl(var(--accent) / 0.5)"
              : "hsl(var(--primary) / 0.5)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 -left-16 h-40 w-40 rounded-full opacity-15 blur-3xl"
          style={{
            background: warmOrbs
              ? "hsl(var(--primary) / 0.4)"
              : "hsl(var(--accent) / 0.4)",
          }}
        />

        <div className="relative flex items-start gap-3">
          {/* Accent bar */}
          <div className="accent-bar mt-0.5 hidden h-12 md:block" />
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="section-heading mt-2">
              {gradient ? (
                <span className="headline-gradient">{title}</span>
              ) : (
                <span className="text-foreground">{title}</span>
              )}
            </h1>
          </div>
        </div>
        {description ? (
          <p className="section-subheading mt-3">{description}</p>
        ) : null}

        {/* Bottom gradient border */}
        <div className="divider-gradient mt-6" />
      </div>
    </AnimateSection>
  );
}
