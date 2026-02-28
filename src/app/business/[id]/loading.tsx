import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessDetailLoading() {
  return (
    <PageShell>
      <div className="mb-6">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="card-elevated max-w-3xl overflow-hidden rounded-2xl border-0 bg-card">
        <div className="border-b border-border/50 px-6 py-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[70%]" />
          <div className="flex flex-wrap gap-4 pt-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
