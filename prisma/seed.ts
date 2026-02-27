import { PrismaClient } from "@prisma/client";
import { STREET_NAMES } from "../src/data/streets";
import { ZONE_POLYGONS } from "../src/data/zone-polygons";

const prisma = new PrismaClient();

async function main() {
  let zone = await prisma.zone.findFirst({ where: { name: "Plumstead" } });
  if (!zone) {
    zone = await prisma.zone.create({
      data: {
        name: "Plumstead",
        postcodePrefix: "7800",
        boundary: ZONE_POLYGONS as object,
      },
    });
  } else {
    const updates: { postcodePrefix?: string; boundary?: object } = {};
    if (!zone.postcodePrefix) updates.postcodePrefix = "7800";
    if (!zone.boundary) updates.boundary = ZONE_POLYGONS as object;
    if (Object.keys(updates).length > 0) {
      await prisma.zone.update({ where: { id: zone.id }, data: updates });
    }
  }

  const streetCount = await prisma.street.count();
  if (streetCount === 0) {
    await prisma.street.createMany({
      data: STREET_NAMES.map((name, i) => ({
        name,
        zoneId: zone!.id,
        order: i,
      })),
    });
  }

  const incidentCount = await prisma.incident.count();
  if (incidentCount === 0) {
    await prisma.incident.createMany({
      data: [
        { type: "Theft Cables", location: "SOUTHFIELD RD 16-160 (ODD)", dateTime: new Date("2026-02-12T02:30:00"), zoneId: zone.id },
        { type: "Theft Common", location: "MAIN RD 1-174", dateTime: new Date("2026-02-11T13:45:00"), zoneId: zone.id },
        { type: "Theft Cables", location: "SOUTHFIELD RD 16-160 (ODD)", dateTime: new Date("2026-02-09T17:45:00"), zoneId: zone.id },
        { type: "Arrest", location: "HEMYOCK RD", dateTime: new Date("2026-02-08T21:06:00"), zoneId: zone.id },
        { type: "Theft out/from M/Vehicle", location: "GABRIEL RD", dateTime: new Date("2026-02-06T10:20:00"), zoneId: zone.id },
      ],
    });
  }

  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.createMany({
      data: [
      { title: "Bingo", location: "Second Plumstead Sea Scout Group Melville Road", startAt: new Date("2026-03-28T16:00:00") },
      { title: "Raffle on line", location: "Other - See content", startAt: new Date("2026-04-01T07:00:00") },
      { title: "Quiz Night", location: "South Peninsula High School", startAt: new Date("2026-07-25T16:00:00") },
      { title: "PNW ANNUAL GENERAL MEETING", location: "Plumstead Bowling Club", startAt: new Date("2026-08-06T19:00:00") },
      { title: "Bingo Night", location: "South Peninsula High School", startAt: new Date("2026-09-05T16:00:00") },
      { title: "Jamboree", location: "Cape Town Cricket Club", startAt: new Date("2026-11-07T10:00:00") },
    ],
    });
  }

  const committeeCount = await prisma.committeeMember.count();
  if (committeeCount === 0) {
    await prisma.committeeMember.createMany({
    data: [
      { role: "Chairperson", name: "Anthea Klugman", phone: "072 675 9777", email: "chairperson@mypnw.org.za", order: 1 },
      { role: "Assistant Chairperson", name: "Brenda Besterfield", phone: "084 589 1702", email: "assistantchairperson@mypnw.org.za", order: 2 },
      { role: "Operations Manager", name: "Jarryd Munro", phone: "078 457 2313", email: "ops.manager@mypnw.org.za", order: 3 },
      { role: "Secretary", name: "Sharon Botes", phone: "079 469 9885", email: "secretary@mypnw.org.za", order: 4 },
      { role: "Treasurer", name: "Glynnis Okkers", phone: "072 470 3136", email: "treasurer@mypnw.org.za", order: 5 },
    ],
    });
  }

  const emergencyCount = await prisma.emergencyContact.count();
  if (emergencyCount === 0) {
    await prisma.emergencyContact.createMany({
    data: [
      { service: "CVIC", number: "0860 002 669", order: 1 },
      { service: "SAPS Flying Squad", number: "10111", order: 2 },
      { service: "Ambulance", number: "10177", order: 3 },
      { service: "Fire", number: "107", order: 4 },
      { service: "Metro Police Control Room", number: "021 596 1999", order: 5 },
      { service: "Power Failure", number: "086 012 5001", order: 6 },
      { service: "Water", number: "086 010 3054", order: 7 },
      { service: "Diep River SAPS", number: "021 710 7306/7", order: 8 },
    ],
    });
  }

  async function getOrCreateDocCat(name: string) {
    let cat = await prisma.documentCategory.findFirst({ where: { name } });
    if (!cat) cat = await prisma.documentCategory.create({ data: { name } });
    return cat;
  }
  const [forms, policies, newsletter, financials, news, debitOrder, oobaSolar] = await Promise.all([
    getOrCreateDocCat("Forms"),
    getOrCreateDocCat("Policies"),
    getOrCreateDocCat("Newsletter Archive"),
    getOrCreateDocCat("Financials"),
    getOrCreateDocCat("News"),
    getOrCreateDocCat("Debit Order Instruction"),
    getOrCreateDocCat("Ooba Solar"),
  ]);

  const legacyDocNames = [
    "SAGA Media Release Jan 2026",
    "Financials Year End March 2025",
    "Debit Order Form",
    "Ooba Solar - Save 25% on Electricity",
  ];
  const existingDocs = await prisma.document.findMany({ where: { name: { in: legacyDocNames } }, select: { name: true } });
  const existingNames = new Set(existingDocs.map((d) => d.name));
  if (existingNames.size < legacyDocNames.length) {
    const toCreate = [
      { name: "SAGA Media Release Jan 2026", categoryId: news.id, fileUrl: "/documents/legacy/SAGA_Release_26_January_2026.pdf" },
      { name: "Financials Year End March 2025", categoryId: financials.id, fileUrl: "/documents/legacy/March_2025.pdf" },
      { name: "Debit Order Form", categoryId: debitOrder.id, fileUrl: "/documents/legacy/Netcash_EFT_Mandate___Plumstead_Neighbourhood_Watch.pdf" },
      { name: "Ooba Solar - Save 25% on Electricity", categoryId: oobaSolar.id, fileUrl: "/documents/legacy/Ooba_flyer_with_QR_link_Copy.pdf" },
    ].filter((d) => !existingNames.has(d.name));
    if (toCreate.length > 0) await prisma.document.createMany({ data: toCreate });
  }

  const baseDocCount = await prisma.document.count();
  if (baseDocCount < 5) {
    const baseDocs = [
      { name: "Membership Application Form", categoryId: forms.id, fileUrl: "/documents/membership-form.pdf" },
      { name: "Guest Registration Form", categoryId: forms.id, fileUrl: "/documents/guest-form.pdf" },
      { name: "Terms of Use", categoryId: policies.id, fileUrl: "/terms" },
      { name: "Privacy Policy", categoryId: policies.id, fileUrl: "/privacy" },
      { name: "Newsletter January 2026", categoryId: newsletter.id, fileUrl: "/documents/newsletter-jan-2026.pdf" },
    ];
    const existing = await prisma.document.findMany({ where: { name: { in: baseDocs.map((d) => d.name) } }, select: { name: true } });
    const existingSet = new Set(existing.map((d) => d.name));
    const toAdd = baseDocs.filter((d) => !existingSet.has(d.name));
    if (toAdd.length > 0) await prisma.document.createMany({ data: toAdd });
  }

  const sponsorCount = await prisma.sponsor.count();
  if (sponsorCount === 0) {
    await prisma.sponsor.createMany({
      data: [
        { name: "ADT Security", content: "Security services partner", linkUrl: "https://www.adt.co.za", order: 1 },
        { name: "Combat Force", content: "Community security support", linkUrl: "https://combatforce.co.za", order: 2 },
        { name: "Zone Security Services", content: "Neighbourhood security", linkUrl: null, order: 3 },
      ],
    });
  }

  const safetyTipCount = await prisma.safetyTip.count();
  if (safetyTipCount === 0) {
    const now = new Date();
    await prisma.safetyTip.createMany({
      data: [
        {
          title: "Secure your home",
          slug: "secure-your-home",
          category: "burglary",
          summary: "Lock doors and windows, use lighting, and display alarm signs.",
          content: "## Secure doors and windows\n\nAlways lock doors and windows when leaving. Consider security gates and burglar bars. Use timers on lights when away.\n\n## Lighting\n\nWell-lit exteriors deter intruders. Install motion-sensor lights.\n\n## Alarm signs\n\nVisible alarm signage can deter would-be burglars. Report incidents to SAPS 10111 and CVIC 0860 002 669.",
          order: 1,
          updatedAt: now,
        },
        {
          title: "Avoid phone and banking scams",
          slug: "avoid-scams",
          category: "scams",
          summary: "Be wary of unsolicited calls asking for banking details or personal information.",
          content: "## Phone scams\n\nNever share banking details, PINs, or OTPs over the phone. Legitimate banks do not ask for these.\n\n## Doorstep scams\n\nVerify identity before allowing access. Report suspicious activity to SAPS.\n\n## Report\n\nReport scams to SAPS 10111 and your bank immediately.",
          order: 2,
          updatedAt: now,
        },
        {
          title: "Protect your vehicle",
          slug: "vehicle-safety",
          category: "vehicle",
          summary: "Lock cars, remove valuables, and park in well-lit areas.",
          content: "## Lock your vehicle\n\nAlways lock doors and close windows. Never leave keys in the ignition.\n\n## No valuables\n\nDo not leave bags, laptops, or phones visible. Store items in the boot.\n\n## Parking\n\nPark in well-lit, busy areas when possible.",
          order: 3,
          updatedAt: now,
        },
        {
          title: "Report anti-social behaviour",
          slug: "anti-social-behaviour",
          category: "asb",
          summary: "Log incidents and report to SAPS. Community mediation can help.",
          content: "## Report to SAPS\n\nReport incidents to SAPS 10111 and CVIC 0860 002 669.\n\n## Log incidents\n\nKeep a record of dates, times, and descriptions. This helps authorities.\n\n## Community\n\nNeighbourhood Watch can support community mediation where appropriate.",
          order: 4,
          updatedAt: now,
        },
        {
          title: "When to call CVIC vs SAPS",
          slug: "cvic-vs-saps",
          category: "general",
          summary: "Report incidents to CVIC; report crimes to SAPS 10111.",
          content: "## CVIC\n\nReport incidents to CVIC at 0860 002 669. CVIC coordinates with local security and SAPS.\n\n## SAPS 10111\n\nReport crimes directly to SAPS at 10111. Less reported incidents = fewer resources allocated.\n\n## Emergency\n\nFor life-threatening emergencies, call 10111 immediately.",
          order: 5,
          updatedAt: now,
        },
      ],
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
