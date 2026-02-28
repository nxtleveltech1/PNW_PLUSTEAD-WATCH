import { PageLoadingSkeleton } from "@/components/layout/page-loading-skeleton";

export default function IncidentsLoading() {
  return <PageLoadingSkeleton hero cardCount={8} layout="list" />;
}
