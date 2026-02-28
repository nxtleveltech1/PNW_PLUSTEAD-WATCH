import type { ThreadMessage } from "@/lib/messaging";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  const time = d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return time;

  return `${d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })} ${time}`;
}

export function MessageBubble({ message }: { message: ThreadMessage }) {
  const isSystem = !message.senderId;

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="max-w-lg rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-center">
          <p className="text-sm text-foreground">{message.body}</p>
          {typeof message.metadata?.actionUrl === "string" && (
            <a
              href={message.metadata.actionUrl}
              className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
            >
              View details
            </a>
          )}
          <p className="mt-1 text-[10px] text-muted-foreground">
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          message.isCurrentUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted"
        }`}
      >
        {!message.isCurrentUser && (
          <p className="mb-0.5 text-[11px] font-semibold text-muted-foreground">
            {message.senderName}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>
        <p
          className={`mt-1 text-[10px] ${
            message.isCurrentUser ? "text-primary-foreground/60" : "text-muted-foreground"
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
