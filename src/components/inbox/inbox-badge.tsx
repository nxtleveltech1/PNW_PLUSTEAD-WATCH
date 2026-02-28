"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

async function fetchUnread(): Promise<number> {
  const res = await fetch("/api/inbox/unread");
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count ?? 0;
}

export function InboxBadge() {
  const { data: count = 0 } = useQuery({
    queryKey: ["inbox-unread"],
    queryFn: fetchUnread,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  return (
    <Button variant="ghost" size="icon" className="relative h-9 w-9" asChild>
      <Link href="/account/inbox" aria-label={`Inbox${count > 0 ? ` (${count} unread)` : ""}`}>
        <Mail className="h-4.5 w-4.5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
