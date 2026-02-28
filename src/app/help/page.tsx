import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";

export default function HelpPage() {
  const helpLinks = [
    { href: "/help/member-registration", title: "Member registration", description: "How to register as a member, what information we collect, and how to update your profile." },
    { href: "/help/member-faq", title: "Member FAQ", description: "Common questions about membership, registration, and using the platform." },
    { href: "/help/troubleshooting", title: "Troubleshooting", description: "Browser support, sign-in issues, email preferences, and session problems." },
    { href: "/help/security", title: "Security of information", description: "How we protect your data, who has access, and your privacy options." },
    { href: "/help/patrol-administration", title: "Patrol administration", description: "Overview of patrol zones, types, resources, and how patrols are managed." },
    { href: "/help/glossary", title: "Glossary", description: "Definitions of terms used on the platform and in PNW communications." },
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow="Help"
        title="PNW Help"
        description="Guides and reference for using the Plumstead Neighbourhood Watch platform."
      />

      <AnimateSection className="mt-section">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {helpLinks.map((link) => (
            <AnimateItem key={link.href}>
              <Link
                href={link.href}
                className="card-elevated group block rounded-2xl border-0 bg-card p-6"
              >
                <h2 className="block-title text-foreground group-hover:text-primary transition-colors">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{link.description}</p>
              </Link>
            </AnimateItem>
          ))}
        </div>
      </AnimateSection>
    </PageShell>
  );
}
