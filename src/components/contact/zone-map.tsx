"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ZONE_SECTIONS, ZONE_POLYGONS } from "@/data/zone-polygons";

import "leaflet/dist/leaflet.css";

const ZoneMapInner = dynamic(
  () =>
    import("react-leaflet").then(({ MapContainer, TileLayer, Polygon }) => {
      const CENTER: [number, number] = [-34.022, 18.472];
      const ZOOM = 14;
      return function ZoneMapInner({ selectedId }: { selectedId: string | null }) {
        return (
          <MapContainer center={CENTER} zoom={ZOOM} className="h-full w-full" scrollWheelZoom>
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
                    fillOpacity: isSelected ? 0.6 : 0.35,
                    weight: isSelected ? 3 : 1.5,
                  }}
                />
              );
            })}
          </MapContainer>
        );
      };
    }),
  { ssr: false }
);

export function ZoneMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            !selectedId ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          All sections
        </button>
        {ZONE_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedId === s.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </button>
        ))}
      </div>
      <div className="h-[400px] w-full overflow-hidden rounded-xl border border-border">
        <ZoneMapInner selectedId={selectedId} />
      </div>
    </div>
  );
}
