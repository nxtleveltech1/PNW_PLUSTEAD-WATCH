import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { VacationWatchForm } from "./vacation-watch-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function VacationWatchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Property Watch</p>
          <h1 className="section-heading mt-2">Vacation Watch</h1>
          <p className="section-subheading">Register your property for visual checks while you&apos;re away.</p>
        </div>

        <section className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
          <h2 className="font-display font-semibold text-foreground">Eligibility</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Property unoccupied for 1 week or longer</li>
            <li>Single-family residence only (no apartments or condos)</li>
            <li>Maximum 4 weeks per registration (renewable)</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> Visual checks only. No liability assumed. Complements other security measures. Stop mail, use light timers, and avoid posting travel plans on social media.
          </p>
        </section>

        <section className="mt-12">
          <Card className="max-w-md border-0 shadow-elevation-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <Home className="h-6 w-6 text-primary" />
                </span>
                <div>
                  <CardTitle className="font-display text-xl text-foreground">
                    Register for vacation watch
                  </CardTitle>
                  <CardDescription>
                    We&apos;ll coordinate periodic visual checks of your property.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VacationWatchForm />
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
