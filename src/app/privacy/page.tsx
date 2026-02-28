import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AnimateSection } from "@/components/ui/animate-section";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Legal</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Privacy Policy</span>
            </h1>
          </div>
        </AnimateSection>
        <AnimateSection className="mt-8">
        <article className="card-elevated max-w-4xl overflow-hidden rounded-2xl border-0 bg-card px-6 py-6">
          <div className="prose prose-slate max-w-none dark:prose-invert">
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
      </main>
      <Footer />
    </div>
  );
}
