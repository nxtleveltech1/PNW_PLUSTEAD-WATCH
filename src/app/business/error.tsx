"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HeaderClient } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function BusinessError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Business section error:", error);
  }, [error]);

  const isDbError =
    error?.message?.includes("does not exist") ||
    error?.message?.includes("relation") ||
    error?.message?.includes("P1001") ||
    error?.message?.includes("P2021");

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderClient />
      <main id="main" className="page-main">
        <div className="panel max-w-2xl border-accent/30 bg-alert-muted/50 p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold">Something went wrong</h2>
              {isDbError ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  The business directory is not yet available. The database may need to be updated.
                  Please try again later or contact support.
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  An unexpected error occurred. Please try again.
                </p>
              )}
              <div className="mt-6 flex gap-3">
                <Button onClick={reset}>Try again</Button>
                <Button asChild variant="outline">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
