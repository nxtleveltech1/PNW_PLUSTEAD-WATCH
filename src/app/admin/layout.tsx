import Link from "next/link";
import { requireAdmin } from "@/lib/auth-admin";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AnimateSection } from "@/components/ui/animate-section";
import { LayoutDashboard, Building2, MessageSquare, AlertTriangle, Users, Calendar, FileText } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/business", label: "Business approvals", icon: Building2 },
  { href: "/admin/members", label: "Member approvals", icon: Users },
  { href: "/admin/messages", label: "Contact messages", icon: MessageSquare },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Admin</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Admin Console</span>
            </h1>
            <p className="section-subheading">Manage incidents, events, business listings, and contact messages.</p>
          </div>
        </AnimateSection>

        <nav
          className="mt-8 flex flex-wrap gap-2 border-b border-border pb-6"
          aria-label="Admin navigation"
        >
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
