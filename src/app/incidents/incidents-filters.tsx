"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Zone = { id: string; name: string };

export function IncidentsFilters({
  zones,
  currentZone,
  currentType,
}: {
  zones: Zone[];
  currentZone?: string;
  currentType?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/incidents?${params.toString()}`);
  }

  const types = ["Theft", "Arrest", "Burglary", "Assault", "Other"];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
      {zones.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm font-medium text-muted-foreground">Zone:</span>
          <select
            className="h-9 min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm sm:w-auto"
            value={currentZone ?? ""}
            onChange={(e) => setFilter("zone", e.target.value || null)}
            aria-label="Filter by zone"
          >
            <option value="">All</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Type:</span>
        <Button
          variant={!currentType ? "default" : "outline"}
          size="sm"
          className="h-9"
          onClick={() => setFilter("type", "")}
        >
          All
        </Button>
        {types.map((t) => (
          <Button
            key={t}
            variant={currentType === t ? "default" : "outline"}
            size="sm"
            className="h-9"
            onClick={() => setFilter("type", currentType === t ? "" : t)}
          >
            {t}
          </Button>
        ))}
      </div>
    </div>
  );
}
