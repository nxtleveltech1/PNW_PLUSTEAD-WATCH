import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AccountNav } from "@/components/account/account-nav";
import { isAdmin } from "@/lib/auth-admin";

const accountNav = [
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
      <main id="main" className="page-main">
        <div className="mb-block">
          <h1 className="section-title">Manage your account</h1>
          <p className="mt-2 text-muted-foreground">Update your profile, membership, and preferences.</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="hidden shrink-0 lg:block lg:w-56">
            <AccountNav showAdmin={showAdmin} />
          </aside>

          <nav
            className="flex gap-2 overflow-x-auto pb-4 lg:hidden"
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

          <div className="card-elevated min-w-0 flex-1 rounded-2xl border-0 bg-card p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
