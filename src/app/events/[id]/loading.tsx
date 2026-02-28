import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <PageShell>
      <div className="mb-6">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="panel max-w-3xl">
        <div className="panel-header">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="mt-2 h-5 w-1/2" />
        </div>
        <div className="px-6 py-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      </div>
    </PageShell>
  );
}
