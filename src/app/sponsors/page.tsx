import Link from "next/link";
import { ExternalLink, Handshake } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header-server";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Local Partners</p>
          <h1 className="section-heading mt-2">Sponsors and Security Partners</h1>
          <p className="section-subheading">
            Organisations that support operational continuity and neighbourhood safety programs.
          </p>
        </div>

        {sponsors.length === 0 ? (
          <div className="panel mt-10 p-12 text-center text-muted-foreground">No sponsors listed yet.</div>
        ) : (
          <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sponsors.map((sponsor) => (
              <article key={sponsor.id} className="panel">
                <div className="panel-header">
                  <p className="font-display text-lg font-semibold">{sponsor.name}</p>
                  {sponsor.content && <p className="mt-2 text-sm text-muted-foreground">{sponsor.content}</p>}
                </div>
                <div className="px-6 py-5">
                  {sponsor.linkUrl ? (
                    <a
                      href={sponsor.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      Visit partner website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Community partner</p>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="mt-10 panel p-6 md:flex md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 font-display text-xl font-semibold">
              <Handshake className="h-5 w-5 text-primary" />
              Become a sponsor
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Support patrol operations and community communications while building trusted local visibility.
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/contact">Contact us</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
