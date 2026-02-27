export const dynamic = "force-dynamic";

import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { getBusinessMessagesForUser, getBusinessIntroRequestsForUser } from "../actions";
import { BusinessDbUnavailable } from "../db-unavailable";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus } from "lucide-react";
import { IntroRequestActions } from "./intro-request-actions";

export default async function BusinessMessagesPage() {
  let messages;
  let introRequests;
  try {
    [messages, introRequests] = await Promise.all([
      getBusinessMessagesForUser(),
      getBusinessIntroRequestsForUser(),
    ]);
  } catch {
    return <BusinessDbUnavailable />;
  }

  const pendingIntros = introRequests.filter((r) => r.status === "PENDING");

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
            Messages and intro requests from residents about your business listings. You must own at least one approved
            listing to receive these here.
          </p>
        </div>

        {/* Intro requests */}
        {pendingIntros.length > 0 && (
          <section className="mt-10" aria-labelledby="intro-requests-heading">
            <h2 id="intro-requests-heading" className="flex items-center gap-2 text-lg font-semibold">
              <UserPlus className="h-5 w-5" />
              Intro requests
            </h2>
            <div className="mt-4 space-y-4">
              {pendingIntros.map((intro) => (
                <article key={intro.id} className="panel overflow-hidden">
                  <div className="border-b border-border/60 px-6 py-3 flex items-center justify-between">
                    <Link
                      href={`/business/${intro.targetListing.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {intro.targetListing.name}
                    </Link>
                    <time className="text-sm text-muted-foreground">
                      {intro.createdAt.toLocaleDateString("en-ZA", {
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
                      {[intro.requester.firstName, intro.requester.lastName].filter(Boolean).join(" ") ||
                        intro.requester.email}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{intro.message}</p>
                    <IntroRequestActions introId={intro.id} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Messages */}
        <section className={pendingIntros.length > 0 ? "mt-10" : "mt-10"} aria-labelledby="messages-heading">
          <h2 id="messages-heading" className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5" />
            Messages
          </h2>
          {messages.length === 0 ? (
            <div className="panel mt-4 p-12 text-center text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 opacity-40" />
              <p className="mt-4">No messages yet.</p>
              <p className="mt-1 text-sm">When residents contact your listings, their messages will appear here.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {messages.map((msg) => (
                <article key={msg.id} className="panel overflow-hidden">
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
                      {[msg.sender.firstName, msg.sender.lastName].filter(Boolean).join(" ") || msg.sender.email}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{msg.body}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
