import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <PageShell>
      <div className="page-hero">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-72" />
      </div>
      <div className="mt-section grid gap-8 lg:grid-cols-2">
        <div className="card-elevated rounded-2xl border-0 bg-card p-6">
          <Skeleton className="h-6 w-40" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3"
              >
                <Skeleton className="h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-4 h-9 w-20" />
        </div>
        <div className="card-elevated rounded-2xl border-0 bg-card p-6">
          <Skeleton className="h-6 w-40" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3"
              >
                <Skeleton className="h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-4 h-9 w-20" />
        </div>
      </div>
    </PageShell>
  );
}
