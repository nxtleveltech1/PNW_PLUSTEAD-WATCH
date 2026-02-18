import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FindZoneForm } from "./find-zone-form";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default async function FindPage() {
  const zones = await prisma.zone.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Locate</p>
          <h1 className="section-heading mt-2">Find your zone</h1>
          <p className="section-subheading">Enter your postcode to find your neighbourhood watch scheme.</p>
        </div>

        <section className="mt-14">
          <Card className="card-elevated max-w-md border-l-4 border-l-primary">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/10 to-primary/5 px-8 py-8">
              <div className="flex items-center gap-5">
                <span className="icon-badge-primary">
                  <MapPin className="h-7 w-7" />
                </span>
                <div>
                  <CardTitle className="font-display text-xl text-foreground">
                    Search by postcode
                  </CardTitle>
                  <CardDescription>
                    e.g. 7800 for Plumstead
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-8">
              <FindZoneForm zones={zones} />
            </CardContent>
          </Card>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">All zones</h2>
          <div className="mt-8 space-y-4">
            {zones.map((z) => (
              <div
                key={z.id}
                className="card-elevated flex items-center justify-between rounded-2xl border-l-4 border-l-primary bg-card px-6 py-5"
              >
                <div>
                  <p className="font-semibold">{z.name}</p>
                  {z.postcodePrefix && (
                    <p className="text-sm text-muted-foreground">Postcode: {z.postcodePrefix}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/register?zone=${z.id}`}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:-translate-y-0.5"
                  >
                    Join
                  </Link>
                  <Link
                    href="/start-scheme"
                    className="rounded-xl border-2 border-border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-muted hover:border-primary/30"
                  >
                    Start scheme
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
