"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Zone } from "@prisma/client";

const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "RETAIL", label: "Retail" },
  { value: "SERVICES", label: "Services" },
  { value: "FOOD", label: "Food & Dining" },
  { value: "HEALTH", label: "Health" },
  { value: "OTHER", label: "Other" },
];

export function BusinessDirectoryFilters({
  zones,
  currentCategory,
  currentZone,
  search,
}: {
  zones: Zone[];
  currentCategory?: string;
  currentZone?: string;
  search?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilters(updates: { category?: string; zone?: string; search?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.category !== undefined) {
      if (updates.category) params.set("category", updates.category);
      else params.delete("category");
    }
    if (updates.zone !== undefined) {
      if (updates.zone) params.set("zone", updates.zone);
      else params.delete("zone");
    }
    if (updates.search !== undefined) {
      if (updates.search) params.set("search", updates.search);
      else params.delete("search");
    }
    router.push(`/business?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="search" className="mb-1 block text-sm font-medium text-muted-foreground">
          Search
        </label>
        <Input
          id="search"
          type="search"
          placeholder="Search businesses..."
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              updateFilters({ search: (e.target as HTMLInputElement).value });
            }
          }}
          className="max-w-sm"
        />
      </div>
      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-muted-foreground">
          Category
        </label>
        <select
          id="category"
          value={currentCategory ?? ""}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="zone" className="mb-1 block text-sm font-medium text-muted-foreground">
          Zone
        </label>
        <select
          id="zone"
          value={currentZone ?? ""}
          onChange={(e) => updateFilters({ zone: e.target.value })}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All zones</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          (document.getElementById("search") as HTMLInputElement).value = "";
          updateFilters({ category: "", zone: "", search: "" });
        }}
      >
        Clear
      </Button>
    </div>
  );
}
