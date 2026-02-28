import Link from "next/link";
import { Bell, Building2, Mail, Megaphone } from "lucide-react";
import type { ConversationListItem } from "@/lib/messaging";

const typeIcons = {
  DIRECT: Mail,
  SYSTEM: Bell,
  BUSINESS: Building2,
  ADMIN_BROADCAST: Megaphone,
} as const;

const typeLabels = {
  DIRECT: "Direct",
  SYSTEM: "Notification",
  BUSINESS: "Business",
  ADMIN_BROADCAST: "Announcement",
} as const;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export function ConversationRow({ item }: { item: ConversationListItem }) {
  const Icon = typeIcons[item.type];
  const label = typeLabels[item.type];
  const preview = item.lastMessageBody
    ? item.lastMessageBody.length > 80
      ? item.lastMessageBody.slice(0, 80) + "..."
      : item.lastMessageBody
    : "No messages yet";

  const displayName =
    item.type === "SYSTEM"
      ? "System"
      : item.type === "ADMIN_BROADCAST"
        ? item.lastMessageSenderName ?? "Admin"
        : item.participantNames[0] ?? item.businessListingName ?? "Unknown";

  return (
    <Link
      href={`/account/inbox/${item.id}`}
      className={`group flex items-start gap-3.5 rounded-xl border px-4 py-3.5 transition-colors hover:bg-muted/50 ${
        item.unread ? "border-primary/20 bg-primary/[0.03]" : "border-border/60"
      }`}
    >
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          item.unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={`truncate text-sm ${
              item.unread ? "font-semibold text-foreground" : "font-medium text-foreground"
            }`}
          >
            {item.subject ?? displayName}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {item.lastMessageAt ? timeAgo(item.lastMessageAt) : ""}
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">{preview}</p>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-muted/80 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {label}
          </span>
          {item.unread && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </div>
      </div>
    </Link>
  );
}
