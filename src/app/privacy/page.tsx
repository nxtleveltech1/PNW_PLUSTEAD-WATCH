import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Legal</p>
          <h1 className="section-heading mt-2">Privacy Policy</h1>
        </div>
        <article className="panel mt-8 max-w-4xl px-6 py-6">
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
      </main>
      <Footer />
    </div>
  );
}
