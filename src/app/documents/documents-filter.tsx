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
    <div className="flex items-center gap-3">
      <label htmlFor="doc-category" className="text-sm font-medium text-muted-foreground">
        Filter by category
      </label>
      <select
        id="doc-category"
        value={current ?? ""}
        onChange={handleChange}
        className="flex h-9 min-w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
