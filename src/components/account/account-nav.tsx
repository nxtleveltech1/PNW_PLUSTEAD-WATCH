"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Shield, User, Users } from "lucide-react";
import { ShieldCheck } from "lucide-react";

const accountNav = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/membership", label: "Membership", icon: Users },
  { href: "/account/settings", label: "Settings", icon: Settings },
  { href: "/account/security", label: "Security", icon: Shield },
];

export function AccountNav({ showAdmin = false }: { showAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-24 space-y-1 rounded-lg border bg-card p-2"
      aria-label="Account navigation"
    >
      {accountNav.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
      <div className="my-2 h-px bg-border" />
      {showAdmin && (
        <Link
          href="/admin"
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
            pathname?.startsWith("/admin") ? "bg-primary/10 text-primary" : "text-muted-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Administration
        </Link>
      )}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LayoutDashboard className="h-4 w-4 shrink-0" />
        Dashboard
      </Link>
    </nav>
  );
}
