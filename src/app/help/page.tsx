import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Help</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">PNW Help</span>
            </h1>
            <p className="section-subheading">
              Guides and reference for using the Plumstead Neighbourhood Watch platform.
            </p>
          </div>
        </AnimateSection>
        <AnimateSection className="mt-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimateItem>
          <Link
            href="/help/member-registration"
            className="card-elevated group block rounded-2xl border-0 bg-card p-6"
          >
            <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
              Member registration
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              How to register as a member, what information we collect, and how to update your profile.
            </p>
          </Link>
          </AnimateItem>
          <AnimateItem>
          <Link
            href="/help/patrol-administration"
            className="card-elevated group block rounded-2xl border-0 bg-card p-6"
          >
            <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
              Patrol administration
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Overview of patrol zones, types, resources, and how patrols are managed.
            </p>
          </Link>
          </AnimateItem>
          <AnimateItem>
          <Link
            href="/help/glossary"
            className="card-elevated group block rounded-2xl border-0 bg-card p-6"
          >
            <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
              Glossary
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Definitions of terms used on the platform and in PNW communications.
            </p>
          </Link>
          </AnimateItem>
          </div>
        </AnimateSection>
      </main>
      <Footer />
    </div>
  );
}
