import { PageLoadingSkeleton } from "@/components/layout/page-loading-skeleton";

export default function EventsLoading() {
  return (
    <PageLoadingSkeleton
      hero
      cardCount={6}
      cardCols="sm:grid-cols-2 lg:grid-cols-3"
    />
  );
}
