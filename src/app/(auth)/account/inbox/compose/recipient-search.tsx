"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import type { UserSearchResult } from "@/lib/messaging";

async function fetchUsers(q: string): Promise<UserSearchResult[]> {
  if (q.length < 2) return [];
  const res = await fetch(`/api/inbox/users?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  return res.json();
}

export function RecipientSearch({
  value,
  selectedName,
  onChange,
}: {
  value: string;
  selectedName: string;
  onChange: (id: string, name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: results = [] } = useQuery({
    queryKey: ["user-search", query],
    queryFn: () => fetchUsers(query),
    enabled: query.length >= 2,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (value && selectedName) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2">
        <span className="flex-1 text-sm">{selectedName}</span>
        <button
          type="button"
          onClick={() => {
            onChange("", "");
            setQuery("");
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search by name or email..."
          className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-[240px] w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
          {results.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => {
                onChange(user.id, user.name);
                setQuery("");
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-3 text-center shadow-md">
          <p className="text-sm text-muted-foreground">No members found.</p>
        </div>
      )}
    </div>
  );
}
