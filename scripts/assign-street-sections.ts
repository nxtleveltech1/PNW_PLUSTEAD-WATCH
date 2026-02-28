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

function findSection(lat: number, lng: number): string | null {
  for (const sec of ZONE_SECTIONS) {
    const polygon = ZONE_POLYGONS[sec.id];
    if (polygon && pointInPolygon(lat, lng, polygon)) {
      return sec.id;
    }
  }
  return null;
}

async function geocodeStreet(
  streetName: string
): Promise<{ lat: number; lng: number } | null> {
  const cleanName = streetName
    .replace(/\s*-\s*\d+.*$/, "")
    .replace(/\s+\d+.*$/, "")
    .replace(/\s+\(.*\)$/, "")
    .trim();

  const query = `${cleanName}, Plumstead, Cape Town, South Africa`;
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    q: query,
    format: "json",
    limit: "1",
  })}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "PNW-StreetMapper/1.0 (info@plumsteadwatch.org.za)" },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (data.length === 0) return null;

  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const streets = await prisma.street.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, section: true },
  });

  console.log(`Found ${streets.length} streets to process\n`);

  let assigned = 0;
  let skipped = 0;
  let failed = 0;
  let noMatch = 0;
  const failures: string[] = [];
  const noMatches: string[] = [];

  for (let i = 0; i < streets.length; i++) {
    const street = streets[i];

    if (street.section) {
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${streets.length}] Geocoding: ${street.name}`);

    const coords = await geocodeStreet(street.name);

    if (!coords) {
      console.log(`  FAILED: Could not geocode`);
      failed++;
      failures.push(street.name);
      await sleep(1100);
      continue;
    }

    const section = findSection(coords.lat, coords.lng);

    if (!section) {
      console.log(
        `  NO MATCH: (${coords.lat}, ${coords.lng}) outside all sections`
      );
      noMatch++;
      noMatches.push(`${street.name} (${coords.lat}, ${coords.lng})`);
      await sleep(1100);
      continue;
    }

    const sectionName =
      ZONE_SECTIONS.find((s) => s.id === section)?.name ?? section;
    console.log(`  -> ${sectionName}`);

    await prisma.street.update({
      where: { id: street.id },
      data: { section },
    });

    assigned++;
    await sleep(1100);
  }

  console.log(`\n--- Results ---`);
  console.log(`Assigned: ${assigned}`);
  console.log(`Skipped (already assigned): ${skipped}`);
  console.log(`Failed to geocode: ${failed}`);
  console.log(`No section match: ${noMatch}`);

  if (failures.length > 0) {
    console.log(`\nFailed streets:`);
    failures.forEach((f) => console.log(`  - ${f}`));
  }

  if (noMatches.length > 0) {
    console.log(`\nNo-match streets:`);
    noMatches.forEach((f) => console.log(`  - ${f}`));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
