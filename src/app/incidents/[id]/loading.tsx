import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function IncidentDetailLoading() {
  return (
    <PageShell>
      <div className="mb-6">
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="panel max-w-3xl">
        <div className="panel-header">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="mt-2 h-5 w-1/2" />
        </div>
        <div className="px-6 py-5">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </PageShell>
  );
}
