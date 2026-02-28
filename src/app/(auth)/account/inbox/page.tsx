import Link from "next/link";
import { PenSquare, Inbox } from "lucide-react";
import { getConversations } from "@/lib/messaging";
import { ConversationRow } from "@/components/inbox/conversation-row";
import { InboxTabs } from "./inbox-tabs";
import { Button } from "@/components/ui/button";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filterMap: Record<string, "DIRECT" | "SYSTEM" | "BUSINESS" | "ADMIN_BROADCAST"> = {
    direct: "DIRECT",
    system: "SYSTEM",
    business: "BUSINESS",
    announcements: "ADMIN_BROADCAST",
  };
  const filter = params.filter ? filterMap[params.filter] : undefined;
  const conversations = await getConversations(filter);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Inbox</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Messages, notifications, and announcements.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/account/inbox/compose" className="gap-2">
            <PenSquare className="h-4 w-4" />
            Compose
          </Link>
        </Button>
      </div>

      <div className="mt-3">
        <InboxTabs active={params.filter} />
      </div>

      <div className="mt-3 min-h-[200px] space-y-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Inbox className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              {filter ? "No messages in this category" : "Your inbox is empty"}
            </p>
            <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">
              Messages from members, notifications, and announcements will appear here.
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationRow key={conv.id} item={conv} />
          ))
        )}
      </div>
    </section>
  );
}
