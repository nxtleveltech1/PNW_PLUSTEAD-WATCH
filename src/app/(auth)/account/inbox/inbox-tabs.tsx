"use client";

import Link from "next/link";

const tabs = [
  { key: undefined, label: "All" },
  { key: "direct", label: "Direct" },
  { key: "system", label: "Notifications" },
  { key: "business", label: "Business" },
  { key: "announcements", label: "Announcements" },
] as const;

export function InboxTabs({ active }: { active?: string }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg border bg-muted/50 p-1">
      {tabs.map((tab) => {
        const isActive = active === tab.key || (!active && !tab.key);
        const href = tab.key ? `/account/inbox?filter=${tab.key}` : "/account/inbox";

        return (
          <Link
            key={tab.label}
            href={href}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
