export const dynamic = "force-dynamic";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getBusinessMessagesForUser } from "../actions";
import { BusinessDbUnavailable } from "../db-unavailable";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default async function BusinessMessagesPage() {
  let messages;
  try {
    messages = await getBusinessMessagesForUser();
  } catch {
    return <BusinessDbUnavailable />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link href="/business">&lt;- Back to directory</Link>
        </Button>

        <div className="page-hero">
          <p className="eyebrow">Inbox</p>
          <h1 className="section-heading mt-2">Business messages</h1>
          <p className="section-subheading">
            Messages from residents about your business listings. You must own at least one approved listing to receive messages here.
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="panel mt-10 p-12 text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 opacity-40" />
            <p className="mt-4">No messages yet.</p>
            <p className="mt-1 text-sm">
              When residents contact your listings, their messages will appear here.
            </p>
          </div>
        ) : (
          <section className="mt-10 space-y-4">
            {messages.map((msg) => (
              <article
                key={msg.id}
                className="panel overflow-hidden"
              >
                <div className="border-b border-border/60 px-6 py-3 flex items-center justify-between">
                  <Link
                    href={`/business/${msg.listing.id}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {msg.listing.name}
                  </Link>
                  <time className="text-sm text-muted-foreground">
                    {msg.createdAt.toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    From:{" "}
                    {[msg.sender.firstName, msg.sender.lastName].filter(Boolean).join(" ") ||
                      msg.sender.email}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap">{msg.body}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
