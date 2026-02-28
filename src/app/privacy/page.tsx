import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection } from "@/components/ui/animate-section";

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <AnimateSection className="mt-section section-gradient-muted rounded-2xl px-6 py-8">
        <article className="panel max-w-4xl overflow-hidden">
          <div className="panel-header">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-primary to-accent" aria-hidden />
              Privacy and Data Protection
            </h2>
          </div>
          <div className="prose prose-slate max-w-none p-6 dark:prose-invert prose-headings:flex prose-headings:items-center prose-headings:gap-2">
          <p>
            Plumstead Neighbourhood Watch is committed to protecting your privacy. This policy
            explains how we collect, use, and safeguard your personal information when you use our
            website and services.
          </p>
          <p>
            We collect information that you provide when registering, including your name, email
            address, and contact details. We use this information to communicate with you about
            neighbourhood watch matters, incidents, and community events.
          </p>
          <p>
            We do not sell or share your personal information with third parties for marketing
            purposes. Your data may be shared with authorised committee members for the purpose of
            administering the neighbourhood watch.
          </p>
          <p>
            By using this website and registering as a member, you consent to our Privacy Policy and
            agree to its terms.
          </p>
          </div>
        </article>
      </AnimateSection>
    </PageShell>
  );
}
