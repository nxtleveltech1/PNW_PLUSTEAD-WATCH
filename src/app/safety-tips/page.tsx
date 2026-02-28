import Link from "next/link";
import { Shield } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header-server";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
          <p className="eyebrow">Safety Library</p>
          <h1 className="section-heading mt-2">
            <span className="headline-gradient">Operational Safety Guidance</span>
          </h1>
          <p className="section-subheading">
            Practical, local prevention guidance for residents, households, and community patrol volunteers.
          </p>
        </div>
        </AnimateSection>

        {tips.length === 0 ? (
          <AnimateSection className="mt-10">
            <AnimateItem>
              <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
                No safety tips available yet.
              </div>
            </AnimateItem>
          </AnimateSection>
        ) : (
          <AnimateSection className="mt-8">
            <section className="flex flex-wrap gap-2">
              {categoryKeys.map((category) => (
                <a
                  key={category}
                  href={`#category-${category}`}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
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
                      <h2 className="font-display text-2xl font-semibold">
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
                          className="rounded-xl border border-border/70 bg-background/70 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-elevation-2)]"
                        >
                          <p className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                            <Shield className="h-4 w-4 text-primary" />
                            {tip.title}
                          </p>
                          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                            {tip.summary ?? tip.content.slice(0, 140)}
                          </p>
                          <p className="mt-4 text-sm font-semibold text-primary">Read guidance</p>
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
      </main>
      <Footer />
    </div>
  );
}
