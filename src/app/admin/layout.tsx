import Link from "next/link";
import { requireAdmin } from "@/lib/auth-admin";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { LayoutDashboard, Building2, Megaphone, MessageSquare, AlertTriangle, Users, Calendar, FileText } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/business", label: "Business approvals", icon: Building2 },
  { href: "/admin/members", label: "Member approvals", icon: Users },
  { href: "/admin/messages", label: "Contact messages", icon: MessageSquare },
  { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone },
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
      <main id="main" className="page-main page-main-compact">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Admin Console</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Manage incidents, events, business listings, and contact messages.</p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
          <nav
            className="flex shrink-0 flex-wrap gap-2 lg:w-56 lg:flex-col lg:gap-1"
            aria-label="Admin navigation"
          >
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
