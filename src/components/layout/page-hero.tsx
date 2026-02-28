import { AnimateSection } from "@/components/ui/animate-section";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  gradient?: boolean;
}

export function PageHero({ eyebrow, title, description, gradient = true }: PageHeroProps) {
  return (
    <AnimateSection>
      <div className="page-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-heading mt-2">
          {gradient ? (
            <span className="headline-gradient">{title}</span>
          ) : (
            <span className="text-foreground">{title}</span>
          )}
        </h1>
        {description ? <p className="section-subheading">{description}</p> : null}
      </div>
    </AnimateSection>
  );
}
