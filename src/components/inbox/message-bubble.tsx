import { Bell } from "lucide-react";
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
        <div className="max-w-lg rounded-xl border border-primary/10 bg-primary/[0.04] px-4 py-3">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-3 w-3 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-foreground">{message.body}</p>
              {typeof message.metadata?.actionUrl === "string" && (
                <a
                  href={message.metadata.actionUrl}
                  className="mt-1.5 inline-block text-xs font-semibold text-primary hover:underline"
                >
                  View details
                </a>
              )}
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
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
