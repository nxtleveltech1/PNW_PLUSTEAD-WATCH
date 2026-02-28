import Link from "next/link";
import { Shield } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { prisma } from "@/lib/db";

const CATEGORY_LABELS: Record<string, string> = {
  burglary: "Burglary Prevention",
  scams: "Scam Awareness",
  vehicle: "Vehicle Crime",
  asb: "Anti-Social Behaviour",
  general: "General Safety",
};

export default async function SafetyTipsPage() {
  const tips = await prisma.safetyTip.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  const byCategory = tips.reduce<Record<string, typeof tips>>((acc, tip) => {
    const category = tip.category || "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push(tip);
    return acc;
  }, {});

  const categoryKeys = Object.keys(byCategory);

  return (
    <PageShell>
      <PageHero
        eyebrow="Safety Library"
        title="Operational Safety Guidance"
        description="Practical, local prevention guidance for residents, households, and community patrol volunteers."
      />

      {tips.length === 0 ? (
          <AnimateSection className="mt-section">
            <AnimateItem>
              <EmptyState
                icon={Shield}
                heading="No safety tips available yet"
                description="Safety guidance content is being prepared. Check back soon."
              />
            </AnimateItem>
          </AnimateSection>
        ) : (
          <AnimateSection className="mt-section">
            <section className="flex flex-wrap gap-2">
              {categoryKeys.map((category) => (
                  <a
                  key={category}
                  href={`#category-${category}`}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {CATEGORY_LABELS[category] ?? category}
                </a>
              ))}
            </section>

            <div className="mt-8 space-y-6">
              {categoryKeys.map((category) => {
                const categoryTips = byCategory[category];
                return (
                  <AnimateItem key={category}>
                  <section id={`category-${category}`} className="card-elevated overflow-hidden rounded-2xl border-0 bg-card">
                    <div className="panel-header flex items-center justify-between gap-4">
                      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
                        <Shield className="h-5 w-5 text-primary/40" />
                        {CATEGORY_LABELS[category] ?? category}
                      </h2>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {categoryTips.length} guidance item{categoryTips.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="grid gap-4 p-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                      {categoryTips.map((tip) => (
                        <Link
                          key={tip.id}
                          href={`/safety-tips/${tip.slug}`}
                          className="card-tip group p-5"
                        >
                          <p className="inline-flex items-center gap-2 font-display text-base font-semibold transition-colors group-hover:text-primary">
                            <Shield className="h-4 w-4 text-primary" />
                            {tip.title}
                          </p>
                          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                            {tip.summary ?? tip.content.slice(0, 140)}
                          </p>
                          <p className="mt-3 text-sm font-semibold text-primary">Read guidance &rarr;</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                  </AnimateItem>
                );
              })}
            </div>
          </AnimateSection>
        )}
    </PageShell>
  );
}
