import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AnimateSection } from "@/components/ui/animate-section";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Legal</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Terms of Use</span>
            </h1>
          </div>
        </AnimateSection>
        <AnimateSection className="mt-8">
        <article className="card-elevated max-w-4xl overflow-hidden rounded-2xl border-0 bg-card px-6 py-6">
          <div className="prose prose-slate max-w-none dark:prose-invert">
          <p>
            By accessing this Website, you agree to be bound by the terms and conditions appearing in
            this document and you accept our Privacy Policy. If there is anything you do not
            understand please email any enquiry to Membership Queries.
          </p>
          <p>
            In these terms and conditions &quot;We/us/our&quot; means Plumstead Neighbourhood Watch,
            &quot;Website&quot; means the website located at plumsteadwatch.org.za (or any subsequent
            URL which may replace it) and all associated websites and micro sites and sub-domains,
            and &quot;You/your&quot; means you as a user of the Website.
          </p>
          <p>You shall not use the Website for any illegal purposes, and you will use it in compliance with all applicable laws and regulations.</p>
          <p>You agree not to use the Website in a way that may cause the Website to be interrupted, damaged, rendered less efficient or such that the effectiveness or functionality of the Website is in any way impaired.</p>
          <p>You agree not to attempt any unauthorised access to any part or component of the Website.</p>
          <p>
            We reserve the right to modify or withdraw, temporarily or permanently, the Website (or
            any part of) with or without notice to you. We may alter these terms and conditions from
            time to time, and your use of the Website following such change shall be deemed to be
            your acceptance of such change.
          </p>
          <p>
            We make no warranties, whether express or implied, in relation to the accuracy of any
            information we place on the Website. The Website is provided on an &quot;AS IS&quot; and
            &quot;AS AVAILABLE&quot; basis.
          </p>
          <p>
            Nothing in the Conditions shall exclude or limit our liability for death or personal
            injury resulting from our negligence or that of our servants, agents or employees.
          </p>
          </div>
        </article>
        </AnimateSection>
      </main>
      <Footer />
    </div>
  );
}
