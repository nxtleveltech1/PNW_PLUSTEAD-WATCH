import { prisma } from "@/lib/db";
import { MessagesTable } from "./messages-table";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Contact messages</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Messages submitted via the contact form.
      </p>
      <div className="mt-6">
        <MessagesTable messages={rows} />
      </div>
    </section>
  );
}
