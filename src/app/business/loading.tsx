import { PageLoadingSkeleton } from "@/components/layout/page-loading-skeleton";

export default function BusinessLoading() {
  return (
    <PageLoadingSkeleton
      hero
      cardCount={6}
      cardCols="sm:grid-cols-2 xl:grid-cols-3"
    />
  );
}
