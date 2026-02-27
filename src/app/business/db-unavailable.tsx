import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function BusinessDbUnavailable() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="panel max-w-2xl border-accent/30 bg-alert-muted/50 p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold">Business directory unavailable</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The database is being updated. Please try again in a few minutes.
              </p>
              <Button asChild className="mt-6">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
