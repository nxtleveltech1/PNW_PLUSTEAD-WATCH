import { PrismaClient } from "@prisma/client";
import { ZONE_SECTIONS, ZONE_POLYGONS, type LatLng } from "../src/data/zone-polygons";

const prisma = new PrismaClient();

function pointInPolygon(lat: number, lng: number, polygon: LatLng[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [yi, xi] = polygon[i];
    const [yj, xj] = polygon[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function polygonCentroid(polygon: LatLng[]): [number, number] {
  let latSum = 0, lngSum = 0;
  for (const [lat, lng] of polygon) { latSum += lat; lngSum += lng; }
  return [latSum / polygon.length, lngSum / polygon.length];
}

function distSq(a: [number, number], b: [number, number]): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

function findSection(lat: number, lng: number): string | null {
  for (const sec of ZONE_SECTIONS) {
    const polygon = ZONE_POLYGONS[sec.id];
    if (polygon && pointInPolygon(lat, lng, polygon)) return sec.id;
  }
  return null;
}

function findNearestSection(lat: number, lng: number): string {
  let bestId = "section-1";
  let bestDist = Infinity;
  for (const sec of ZONE_SECTIONS) {
    const polygon = ZONE_POLYGONS[sec.id];
    if (!polygon) continue;
    const centroid = polygonCentroid(polygon);
    const d = distSq([lat, lng], centroid);
    if (d < bestDist) { bestDist = d; bestId = sec.id; }
  }
  return bestId;
}

const ABBREV_MAP: Record<string, string> = {
  RD: "Road", STR: "Street", ST: "Street", AVE: "Avenue",
  CL: "Close", DR: "Drive", CLOSE: "Close", CRESCENT: "Crescent",
  LANE: "Lane", WAY: "Way", TERRACE: "Terrace",
};

function expandStreetName(name: string): string[] {
  let cleaned = name
    .replace(/\s*-\s*\d+.*$/, "")
    .replace(/\s+\d+.*$/, "")
    .replace(/\s+\(.*\)$/, "")
    .replace(/\s+to\s+.*$/i, "")
    .replace(/\s+and\s+.*$/i, "")
    .replace(/\s*-\s*[A-Za-z].*$/, "")
    .trim();

  const variants: string[] = [cleaned];

  for (const [abbr, full] of Object.entries(ABBREV_MAP)) {
    const regex = new RegExp(`\\b${abbr}\\b`, "i");
    if (regex.test(cleaned)) {
      variants.push(cleaned.replace(regex, full));
    }
  }

  return [...new Set(variants)];
}

async function geocodeStreet(
  streetName: string
): Promise<{ lat: number; lng: number } | null> {
  const variants = expandStreetName(streetName);

  for (const variant of variants) {
    const query = `${variant}, Plumstead, Cape Town, South Africa`;
    const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
      q: query,
      format: "json",
      limit: "1",
    })}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "PNW-StreetMapper/1.0 (info@plumsteadwatch.org.za)" },
    });

    if (!res.ok) { await sleep(1100); continue; }

    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    await sleep(1100);
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const unassigned = await prisma.street.findMany({
    where: { section: null },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  console.log(`Pass 2: ${unassigned.length} unassigned streets\n`);

  let assigned = 0;
  let nearestAssigned = 0;
  let stillFailed = 0;

  for (let i = 0; i < unassigned.length; i++) {
    const street = unassigned[i];
    console.log(`[${i + 1}/${unassigned.length}] ${street.name}`);

    const coords = await geocodeStreet(street.name);

    if (!coords) {
      console.log(`  STILL FAILED`);
      stillFailed++;
      continue;
    }

    let section = findSection(coords.lat, coords.lng);

    if (section) {
      const sName = ZONE_SECTIONS.find((s) => s.id === section)?.name ?? section;
      console.log(`  -> ${sName}`);
      assigned++;
    } else {
      section = findNearestSection(coords.lat, coords.lng);
      const sName = ZONE_SECTIONS.find((s) => s.id === section)?.name ?? section;
      console.log(`  -> ${sName} (nearest)`);
      nearestAssigned++;
    }

    await prisma.street.update({
      where: { id: street.id },
      data: { section },
    });
  }

  console.log(`\n--- Pass 2 Results ---`);
  console.log(`Assigned (exact): ${assigned}`);
  console.log(`Assigned (nearest): ${nearestAssigned}`);
  console.log(`Still failed: ${stillFailed}`);

  const remaining = await prisma.street.count({ where: { section: null } });
  console.log(`\nRemaining unassigned: ${remaining}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
