# Advertisers and Sponsors Discovery

**Document Version:** 1.0  
**Date:** 2026-02-27  
**Purpose:** Single source-of-truth for all discovered advertisers and sponsor businesses from legacy and current platforms.

---

## 1. Summary Table

| Source | Type | Entity | Migration Status |
|--------|------|--------|------------------|
| Legacy site | Sponsors | Tammy Frankland (Camera Project) | Migrated to Sponsor seed |
| Legacy site | Sponsors | Lance Gordon (Camera Project) | Migrated to Sponsor seed |
| Legacy site | Document partner | Ooba Solar | Migrated to Sponsor seed |
| Legacy site | Advertising | Footer: "To advertise" → info@plumsteadwatch.org.za | Footer link added |
| Legacy site | Doc category | Local Business Advertising | Category added to seed |
| Legacy CMS | Banner/side ads | Admin-managed (On Alert) | Not discoverable without admin access |
| Current seed | Sponsors | ADT Security | In Sponsor table |
| Current seed | Sponsors | Combat Force | In Sponsor table |
| Current seed | Sponsors | Zone Security Services | In Sponsor table |
| Current DB | Business listings | BusinessListing (approved/pending) | Self-service directory |

---

## 2. Legacy Sources

### 2.1 Legacy Homepage (plumsteadwatch.org.za)

- **Sponsors:** "Proud Sponsor of PNW" — Tammy Frankland, Lance Gordon (Camera Project)
- **Advertising:** "To advertise on this website please contact PNW" — mailto:info@plumsteadwatch.org.za?subject=Website%20advertising

### 2.2 Document Categories

- **Local Business Advertising** — Business advertising info (documents in this category not yet migrated)
- **Ooba Solar** — Partner content; document "Ooba Solar how to save 25% on your Electricity" (catid 1036)

### 2.3 On Alert CMS (Octox)

- **Banner/side adverts:** Admin-managed; header advert + 5 side ad slots
- **Not discoverable** without On Alert admin access
- Advertiser names and URLs stored in CMS database

---

## 3. Current Platform

### 3.1 Sponsor Model

| Field | Type |
|-------|------|
| name | String |
| content | String? |
| linkUrl | String? |
| logoUrl | String? |
| tier | PREMIUM \| PARTNER \| SUPPORTER |
| order | Int |

### 3.2 Sponsor Seed (Post-Migration)

| Name | Content | Link | Tier |
|------|---------|------|------|
| ADT Security | Security services partner | https://www.adt.co.za | PREMIUM |
| Combat Force | Community security support | https://combatforce.co.za | PREMIUM |
| Zone Security Services | Neighbourhood security | — | PARTNER |
| Tammy Frankland | Camera Project sponsor | — | SUPPORTER |
| Lance Gordon | Camera Project sponsor | — | SUPPORTER |
| Ooba Solar | Save 25% on electricity — solar partner | https://www.ooba.co.za | PARTNER |

### 3.3 Business Directory

- **BusinessListing** — Self-service submissions; admin approval required
- Categories: RETAIL, SERVICES, FOOD, HEALTH, OTHER
- Featured toggle for hub prominence

---

## 4. Out of Scope / Deferred

- Scraping legacy banner/side ad slots (requires On Alert admin access)
- Full "Local Business Advertising" document migration (depends on legacy content)
- WhatsApp integration for B2B intros (schema-ready; deferred)
