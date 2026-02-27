import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AccountNav } from "@/components/account/account-nav";

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Account</p>
          <h1 className="section-heading mt-2">Manage your account</h1>
          <p className="section-subheading">
            Update your profile, membership, and preferences.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-8 lg:flex-row">
          <aside className="hidden shrink-0 lg:block lg:w-56">
            <AccountNav />
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
          </nav>

          <div className="min-w-0 flex-1 rounded-2xl border bg-card p-6 shadow-[var(--shadow-elevation-1)] md:p-8">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
