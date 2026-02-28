import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection } from "@/components/ui/animate-section";

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title="Terms of Use" />
      <AnimateSection className="mt-section section-gradient-muted rounded-2xl px-6 py-8">
        <article className="panel max-w-4xl overflow-hidden">
          <div className="panel-header">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-primary to-accent" aria-hidden />
              Terms and Conditions
            </h2>
          </div>
          <div className="prose prose-slate max-w-none p-6 dark:prose-invert prose-headings:flex prose-headings:items-center prose-headings:gap-2">
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
    </PageShell>
  );
}
