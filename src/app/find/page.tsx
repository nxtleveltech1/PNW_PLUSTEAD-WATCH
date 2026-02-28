import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection } from "@/components/ui/animate-section";
import { ZoneMap, type SectionStats } from "@/components/zone/zone-map";
import { ZONE_SECTIONS } from "@/data/zone-polygons";
import { prisma } from "@/lib/db";

export default async function ZoneMapPage() {
  const [streets, memberCounts] = await Promise.all([
    prisma.street.findMany({
      orderBy: { order: "asc" },
      select: { name: true, section: true },
    }),
    prisma.user.groupBy({
      by: ["section"],
      where: { section: { not: null }, isApproved: true },
      _count: { id: true },
    }),
  ]);

  const streetsBySection: Record<string, string[]> = {};
  for (const s of streets) {
    const sec = s.section ?? "unassigned";
    (streetsBySection[sec] ??= []).push(s.name);
  }

  const memberCountMap = Object.fromEntries(
    memberCounts
      .filter((r) => r.section !== null)
      .map((r) => [r.section!, r._count.id])
  );

  const sectionStats: Record<string, SectionStats> = {};
  for (const sec of ZONE_SECTIONS) {
    const secStreets = streetsBySection[sec.id] ?? [];
    sectionStats[sec.id] = {
      id: sec.id,
      streetCount: secStreets.length,
      memberCount: memberCountMap[sec.id] ?? 0,
      streets: secStreets,
    };
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Explore"
        title="Zone map"
        description="Plumstead is divided into 7 sections. Select a section on the map to see details, member counts, and streets."
      />

      <AnimateSection className="mt-section">
        <ZoneMap sectionStats={sectionStats} />
      </AnimateSection>
    </PageShell>
  );
}
