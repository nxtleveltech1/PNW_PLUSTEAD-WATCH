"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
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
    <div className="mt-8 rounded-2xl border border-border/80 bg-background/90 p-6 shadow-[var(--shadow-elevation-1)]">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="search" className="mb-1 block text-sm font-medium text-muted-foreground">
            Search
          </label>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
              className="pl-9"
            />
          </div>
        </div>
        <div className="min-w-[160px]">
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-muted-foreground">
            Category
          </label>
          <Select
            value={currentCategory ?? ""}
            onValueChange={(v) => updateFilters({ category: v })}
          >
            <SelectTrigger id="category" className="h-10">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[160px]">
          <label htmlFor="zone" className="mb-1 block text-sm font-medium text-muted-foreground">
            Zone
          </label>
          <Select value={currentZone ?? ""} onValueChange={(v) => updateFilters({ zone: v })}>
            <SelectTrigger id="zone" className="h-10">
              <SelectValue placeholder="All zones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All zones</SelectItem>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10"
          onClick={() => {
            (document.getElementById("search") as HTMLInputElement).value = "";
            updateFilters({ category: "", zone: "", search: "" });
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
