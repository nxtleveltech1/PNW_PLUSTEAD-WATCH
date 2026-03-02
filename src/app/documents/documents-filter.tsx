"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Category = { id: string; name: string };

export function DocumentsFilter({
  categories,
  defaultCategoryId,
}: {
  categories: Category[];
  defaultCategoryId: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? defaultCategoryId;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/documents${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <label htmlFor="doc-category" className="shrink-0 text-sm font-medium text-muted-foreground">
        Filter by category
      </label>
      <select
        id="doc-category"
        value={current ?? ""}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-auto sm:min-w-[200px]"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
