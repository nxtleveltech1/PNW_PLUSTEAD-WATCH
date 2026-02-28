import { PrismaClient } from "@prisma/client";
import {
  ZONE_SECTIONS,
  ZONE_POLYGONS,
  type LatLng,
} from "../src/data/zone-polygons";

const prisma = new PrismaClient();

/* ---- geometry helpers ---- */

function pointInPolygon(lat: number, lng: number, poly: LatLng[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i];
    const [yj, xj] = poly[j];
    if (
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      inside = !inside;
  }
  return inside;
}

function centroid(poly: LatLng[]): [number, number] {
  let la = 0,
    lo = 0;
  for (const [a, b] of poly) {
    la += a;
    lo += b;
  }
  return [la / poly.length, lo / poly.length];
}

function distSq(a: [number, number], b: [number, number]): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

function findSection(lat: number, lng: number): string | null {
  for (const sec of ZONE_SECTIONS) {
    const poly = ZONE_POLYGONS[sec.id];
    if (poly && pointInPolygon(lat, lng, poly)) return sec.id;
  }
  return null;
}

function nearestSection(lat: number, lng: number): string {
  let best = "section-1";
  let bd = Infinity;
  for (const sec of ZONE_SECTIONS) {
    const poly = ZONE_POLYGONS[sec.id];
    if (!poly) continue;
    const c = centroid(poly);
    const d = distSq([lat, lng], c);
    if (d < bd) {
      bd = d;
      best = sec.id;
    }
  }
  return best;
}

/* ---- geocoding helpers ---- */

const PLUMSTEAD_VIEWBOX = "18.45,−34.04,18.49,−34.01";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function geocode(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
    {
      q: query,
      format: "json",
      limit: "1",
      viewbox: "18.45,-34.045,18.495,-34.005",
      bounded: "1",
    }
  )}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "PNW-StreetMapper/1.0 (info@plumsteadwatch.org.za)",
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function nameVariants(raw: string): string[] {
  let base = raw
    .replace(/\s*-\s*\d+.*$/, "")
    .replace(/\s+\d+.*$/, "")
    .replace(/\s+\(.*\)$/, "")
    .replace(/\s+to\s+.*$/i, "")
    .replace(/\s+and\s+.*$/i, "")
    .replace(/\s*-\s*[A-Za-z].*$/, "")
    .trim();

  const suffixes: Record<string, string[]> = {
    RD: ["Road"],
    STR: ["Street"],
    ST: ["Street"],
    AVE: ["Avenue"],
    CL: ["Close"],
    DR: ["Drive"],
    CLOSE: [],
    CRESCENT: [],
    LANE: [],
    WAY: [],
    TERRACE: [],
    ROAD: [],
  };

  const out = new Set<string>();
  out.add(base);

  for (const [abbr, alts] of Object.entries(suffixes)) {
    const re = new RegExp(`\\b${abbr}$`, "i");
    if (re.test(base)) {
      for (const alt of alts) out.add(base.replace(re, alt));
      out.add(base.replace(re, "").trim());
    }
  }

  out.add(base.replace(/\bST\b/i, "Saint"));

  return [...out];
}

async function tryGeocode(
  streetName: string
): Promise<{ lat: number; lng: number } | null> {
  const variants = nameVariants(streetName);

  for (const v of variants) {
    const coords = await geocode(`${v}, Plumstead, Cape Town, South Africa`);
    if (coords) return coords;
    await sleep(1100);
  }

  for (const v of variants) {
    const coords = await geocode(`${v}, Plumstead, Cape Town`);
    if (coords) return coords;
    await sleep(1100);
  }

  for (const v of variants) {
    const coords = await geocode(`${v}, Cape Town, South Africa`);
    if (coords) return coords;
    await sleep(1100);
  }

  return null;
}

/* ---- main ---- */

async function main() {
  const unassigned = await prisma.street.findMany({
    where: { section: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  console.log(`Pass 3: ${unassigned.length} unassigned streets\n`);

  let exactMatch = 0;
  let nearMatch = 0;
  let stillFailed = 0;
  const failedNames: string[] = [];

  for (let i = 0; i < unassigned.length; i++) {
    const street = unassigned[i];
    process.stdout.write(
      `[${i + 1}/${unassigned.length}] ${street.name} ... `
    );

    const coords = await tryGeocode(street.name);

    if (coords) {
      let section = findSection(coords.lat, coords.lng);
      if (section) {
        exactMatch++;
        console.log(
          ZONE_SECTIONS.find((s) => s.id === section)?.name ?? section
        );
      } else {
        section = nearestSection(coords.lat, coords.lng);
        nearMatch++;
        console.log(
          `${ZONE_SECTIONS.find((s) => s.id === section)?.name ?? section} (nearest)`
        );
      }
      await prisma.street.update({
        where: { id: street.id },
        data: { section },
      });
    } else {
      stillFailed++;
      failedNames.push(street.name);
      console.log("FAILED");
    }
  }

  // For any still-failed streets, assign them to the most common section
  // among their alphabetical neighbours (streets with similar names).
  if (failedNames.length > 0) {
    console.log(
      `\nAssigning ${failedNames.length} remaining streets by neighbour proximity...`
    );

    const allStreets = await prisma.street.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, section: true, order: true },
    });

    const remaining = allStreets.filter((s) => s.section === null);

    for (const street of remaining) {
      const idx = allStreets.findIndex((s) => s.id === street.id);
      const nearby: string[] = [];
      for (let d = 1; d <= 5; d++) {
        if (idx - d >= 0 && allStreets[idx - d].section)
          nearby.push(allStreets[idx - d].section!);
        if (idx + d < allStreets.length && allStreets[idx + d].section)
          nearby.push(allStreets[idx + d].section!);
      }

      if (nearby.length > 0) {
        const freq: Record<string, number> = {};
        for (const s of nearby) freq[s] = (freq[s] ?? 0) + 1;
        const best = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
        await prisma.street.update({
          where: { id: street.id },
          data: { section: best },
        });
        console.log(
          `  ${street.name} -> ${ZONE_SECTIONS.find((s) => s.id === best)?.name ?? best} (neighbour)`
        );
      } else {
        // Fallback: section-5 (largest central section)
        await prisma.street.update({
          where: { id: street.id },
          data: { section: "section-5" },
        });
        console.log(`  ${street.name} -> SECTION 5 (fallback)`);
      }
    }
  }

  const finalCounts = await prisma.street.groupBy({
    by: ["section"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  console.log("\n--- Final counts ---");
  let total = 0;
  for (const row of finalCounts) {
    console.log(
      `  ${row.section ?? "(unassigned)"}: ${row._count.id} streets`
    );
    total += row._count.id;
  }
  console.log(`  TOTAL: ${total}`);

  const nullCount = await prisma.street.count({ where: { section: null } });
  console.log(`\nStill unassigned: ${nullCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
