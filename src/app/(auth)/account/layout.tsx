import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AccountNav } from "@/components/account/account-nav";
import { isAdmin } from "@/lib/auth-admin";

const accountNav = [
  { href: "/account/inbox", label: "Inbox" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/membership", label: "Membership" },
  { href: "/account/settings", label: "Settings" },
  { href: "/account/security", label: "Security" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const showAdmin = await isAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main page-main-compact">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
          <aside className="hidden shrink-0 lg:block lg:w-52">
            <AccountNav showAdmin={showAdmin} />
          </aside>

          <nav
            className="flex gap-2 overflow-x-auto pb-2 lg:hidden"
            aria-label="Account navigation"
          >
            {accountNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {showAdmin && (
              <Link
                href="/admin"
                className="shrink-0 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Administration
              </Link>
            )}
          </nav>

          <div className="min-w-0 flex-1">
            <div className="card-elevated rounded-2xl border-0 bg-card p-5 md:p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
