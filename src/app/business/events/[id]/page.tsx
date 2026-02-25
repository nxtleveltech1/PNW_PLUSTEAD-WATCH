import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { BusinessEventRsvpButton } from "./rsvp-button";

export default async function BusinessEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const event = await prisma.businessEvent.findUnique({
    where: { id },
    include: { listing: { select: { id: true, name: true } } },
  });

  if (!event) notFound();

  let user = null;
  let hasRsvped = false;
  if (userId) {
    user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (user) {
      const rsvp = await prisma.businessEventRsvp.findUnique({
        where: { eventId_userId: { eventId: id, userId: user.id } },
      });
      hasRsvped = !!rsvp;
    }
  }

  const isFuture = event.startAt >= new Date();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link href="/business/events">&lt;- Back to events</Link>
        </Button>

        <article className="panel max-w-3xl">
          <div className="panel-header">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {event.title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {event.location} -{" "}
              {event.startAt.toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {event.listing && (
              <Link
                href={`/business/${event.listing.id}`}
                className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Hosted by {event.listing.name}
              </Link>
            )}
          </div>
          {userId && user && isFuture && (
            <div className="px-6 pt-6">
              <BusinessEventRsvpButton eventId={id} hasRsvped={hasRsvped} />
            </div>
          )}
          {event.description && (
            <div className="mt-4 max-w-2xl px-6 pb-6 text-base leading-relaxed text-foreground">
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
          {!event.description && (
            <div className="px-6 pb-6 pt-4 text-sm text-muted-foreground">
              No event details added yet.
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
