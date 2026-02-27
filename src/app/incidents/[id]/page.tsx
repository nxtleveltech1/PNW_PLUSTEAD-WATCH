import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground hover:text-foreground">
          <Link href="/incidents">&lt;- Back to incidents</Link>
        </Button>
        <article className="panel max-w-3xl">
          <div className="panel-header">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {incident.type}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {incident.location} -{" "}
              {incident.dateTime.toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">
              Incident detail logs are intentionally concise. For complete report data contact the control desk.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
