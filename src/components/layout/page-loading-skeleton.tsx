import { PageShell } from "./page-shell";
import { Skeleton } from "@/components/ui/skeleton";

type LayoutVariant = "grid" | "list";

export function PageLoadingSkeleton({
  hero = true,
  cardCount = 6,
  layout = "grid",
  cardCols = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  hero?: boolean;
  cardCount?: number;
  layout?: LayoutVariant;
  cardCols?: string;
}) {
  const contentClass =
    layout === "list"
      ? "mt-section space-y-4"
      : `mt-section grid gap-4 ${cardCols}`;

  return (
    <PageShell>
      {hero && (
        <div className="page-hero">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-9 w-64 md:w-80" />
          <Skeleton className="mt-2 h-5 w-full max-w-2xl" />
        </div>
      )}
      <div className={contentClass}>
        {Array.from({ length: cardCount }).map((_, i) =>
          layout === "list" ? (
            <div
              key={i}
              className="card-elevated flex items-center gap-4 rounded-2xl border-0 bg-card px-6 py-5"
            >
              <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ) : (
            <div
              key={i}
              className="card-elevated overflow-hidden rounded-2xl border-0 bg-card"
            >
              <div className="border-b border-border/50 px-6 py-5">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-5">
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          )
        )}
      </div>
    </PageShell>
  );
}
