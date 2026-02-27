import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Help</p>
          <h1 className="section-heading mt-2">PNW Help</h1>
          <p className="section-subheading">
            Guides and reference for using the Plumstead Neighbourhood Watch platform.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/help/member-registration"
            className="group rounded-xl border-0 bg-card p-6 shadow-elevation-1 transition-all hover:shadow-elevation-2"
          >
            <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
              Member registration
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              How to register as a member, what information we collect, and how to update your profile.
            </p>
          </Link>
          <Link
            href="/help/patrol-administration"
            className="group rounded-xl border-0 bg-card p-6 shadow-elevation-1 transition-all hover:shadow-elevation-2"
          >
            <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
              Patrol administration
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Overview of patrol zones, types, resources, and how patrols are managed.
            </p>
          </Link>
          <Link
            href="/help/glossary"
            className="group rounded-xl border-0 bg-card p-6 shadow-elevation-1 transition-all hover:shadow-elevation-2"
          >
            <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
              Glossary
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Definitions of terms used on the platform and in PNW communications.
            </p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
