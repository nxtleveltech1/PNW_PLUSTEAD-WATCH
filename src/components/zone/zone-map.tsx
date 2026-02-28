"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ZONE_SECTIONS, ZONE_POLYGONS } from "@/data/zone-polygons";
import { MapPin, Users, Navigation } from "lucide-react";

import "leaflet/dist/leaflet.css";

export type SectionStats = {
  id: string;
  streetCount: number;
  memberCount: number;
  streets: string[];
};

type ZoneMapProps = {
  sectionStats?: Record<string, SectionStats>;
};

const ZoneMapInner = dynamic(
  () =>
    import("react-leaflet").then(({ MapContainer, TileLayer, Polygon, Tooltip }) => {
      const CENTER: [number, number] = [-34.022, 18.472];
      const ZOOM = 14;
      return function ZoneMapInner({
        selectedId,
        onSelect,
      }: {
        selectedId: string | null;
        onSelect: (id: string | null) => void;
      }) {
        return (
          <MapContainer
            center={CENTER}
            zoom={ZOOM}
            className="h-full w-full"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {ZONE_SECTIONS.map((section) => {
              const coords = ZONE_POLYGONS[section.id];
              if (!coords) return null;
              const isSelected = selectedId === section.id;
              return (
                <Polygon
                  key={section.id}
                  positions={coords}
                  pathOptions={{
                    color: isSelected ? "#000" : section.color,
                    fillColor: section.color,
                    fillOpacity: isSelected ? 0.6 : 0.3,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () =>
                      onSelect(isSelected ? null : section.id),
                  }}
                >
                  <Tooltip sticky>
                    <span className="font-semibold">{section.name}</span>
                  </Tooltip>
                </Polygon>
              );
            })}
          </MapContainer>
        );
      };
    }),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-muted-foreground">Loading map&hellip;</div> }
);

export function ZoneMap({ sectionStats = {} }: ZoneMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const selected = selectedId
    ? ZONE_SECTIONS.find((s) => s.id === selectedId) ?? null
    : null;
  const selectedStats = selectedId ? sectionStats[selectedId] : null;

  return (
    <div className="space-y-8">
      {/* Section buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
            !selectedId
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All sections
        </button>
        {ZONE_SECTIONS.map((s) => {
          const stats = sectionStats[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
                selectedId === s.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <span
                className="h-3 w-3 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: s.color }}
              />
              {s.name}
              {stats && (
                <span className="text-xs opacity-60">
                  ({stats.streetCount})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Map + detail panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-[500px] w-full overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elevation-1)]">
            <ZoneMapInner selectedId={selectedId} onSelect={handleSelect} />
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1">
          {selected && selectedStats ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevation-1)]">
              <div
                className="flex items-center gap-3 px-6 py-5"
                style={{
                  background: `linear-gradient(135deg, ${selected.color}18 0%, ${selected.color}08 100%)`,
                  borderBottom: `3px solid ${selected.color}`,
                }}
              >
                <span
                  className="h-5 w-5 rounded-full ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: selected.color }}
                />
                <h3 className="font-display text-lg font-bold">{selected.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-px bg-border">
                <div className="flex flex-col items-center gap-1 bg-card px-4 py-4">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">{selectedStats.streetCount}</span>
                  <span className="text-xs text-muted-foreground">Streets</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-card px-4 py-4">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">{selectedStats.memberCount}</span>
                  <span className="text-xs text-muted-foreground">Members</span>
                </div>
              </div>

              {selectedStats.streets.length > 0 && (
                <div className="border-t border-border px-6 py-5">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    Streets in this section
                  </h4>
                  <ul className="max-h-48 space-y-1.5 overflow-y-auto">
                    {selectedStats.streets.map((street) => (
                      <li
                        key={street}
                        className="rounded-md bg-muted/50 px-3 py-1.5 text-sm"
                      >
                        {street}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-border px-6 py-4">
                <a
                  href={`/register?section=${selected.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5 hover:bg-accent/90 active:scale-[0.98]"
                >
                  Join {selected.name}
                </a>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/30 px-6 py-16 text-center">
              <MapPin className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-display text-sm font-semibold text-muted-foreground">
                Select a section
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Click a section on the map or use the buttons above to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section grid overview */}
      <div>
        <h3 className="section-title mb-4">
          <span className="headline-gradient">All sections at a glance</span>
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ZONE_SECTIONS.map((s) => {
            const stats = sectionStats[s.id];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                className={`group relative overflow-hidden rounded-2xl border bg-card p-5 text-left shadow-[var(--shadow-elevation-1)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-2)] ${
                  selectedId === s.id
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border/60"
                }`}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: s.color }}
                />
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="font-display font-bold">{s.name}</span>
                </div>
                {stats && (
                  <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      {stats.streetCount} streets
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {stats.memberCount} members
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
