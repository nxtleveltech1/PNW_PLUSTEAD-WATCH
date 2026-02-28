import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { getConversationMessages } from "@/lib/messaging";
import { MessageBubble } from "@/components/inbox/message-bubble";
import { ReplyForm } from "./reply-form";
import { ConversationActions } from "./conversation-actions";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversationMessages(id);
  if (!conversation) notFound();

  const isRepliable = conversation.type !== "SYSTEM";

  return (
    <section className="flex min-h-[400px] flex-col">
      <div className="flex items-center gap-3 border-b pb-3">
        <Link
          href="/account/inbox"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to inbox</span>
        </Link>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">
            {conversation.subject ?? "Conversation"}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {conversation.participantNames.join(", ") || "System"}
          </p>
        </div>

        <ConversationActions conversationId={conversation.id} />
      </div>

      {conversation.type === "BUSINESS" && conversation.businessListingId && (
        <Link
          href={`/business/${conversation.businessListingId}`}
          className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Building2 className="h-3.5 w-3.5" />
          {conversation.businessListingName}
        </Link>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto px-1 py-4">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {isRepliable && (
        <div className="pb-1">
          <ReplyForm conversationId={conversation.id} />
        </div>
      )}
    </section>
  );
}
