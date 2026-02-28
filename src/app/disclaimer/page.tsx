import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection } from "@/components/ui/animate-section";

export default function DisclaimerPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title="Disclaimer" />
      <AnimateSection className="mt-section section-gradient-muted rounded-2xl px-6 py-8">
        <article className="panel max-w-4xl overflow-hidden">
          <div className="panel-header">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-primary to-accent" aria-hidden />
              Legal Disclaimer
            </h2>
          </div>
          <div className="prose prose-slate max-w-none p-6 dark:prose-invert prose-headings:flex prose-headings:items-center prose-headings:gap-2">
          <p>
            The information on this website is for general information purposes only. Plumstead
            Neighbourhood Watch makes no representations or warranties of any kind, express or
            implied, about the completeness, accuracy, reliability, suitability or availability of
            the website or the information, products, services, or related graphics contained on
            the website for any purpose.
          </p>
          <p>
            Any reliance you place on such information is therefore strictly at your own risk. In
            no event will we be liable for any loss or damage including without limitation,
            indirect or consequential loss or damage, or any loss or damage whatsoever arising from
            loss of data or profits arising out of, or in connection with, the use of this website.
          </p>
          </div>
        </article>
      </AnimateSection>
    </PageShell>
  );
}
