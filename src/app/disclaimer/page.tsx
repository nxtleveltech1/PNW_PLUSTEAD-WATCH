import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection } from "@/components/ui/animate-section";

export default function DisclaimerPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title="Disclaimer" />
      <AnimateSection className="mt-section">
        <article className="card-elevated max-w-4xl overflow-hidden rounded-2xl border-0 bg-card px-6 py-6">
          <div className="prose prose-slate max-w-none dark:prose-invert">
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
