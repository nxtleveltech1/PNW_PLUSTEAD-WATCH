import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AnimateSection } from "@/components/ui/animate-section";

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Legal</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Disclaimer</span>
            </h1>
          </div>
        </AnimateSection>
        <AnimateSection className="mt-8">
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
      </main>
      <Footer />
    </div>
  );
}
