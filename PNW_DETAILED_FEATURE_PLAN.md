# PNW Detailed Feature Plan — Research-Backed Roadmap

**Document Version:** 1.0  
**Date:** 2026-02-18  
**Context:** Plumstead Neighbourhood Watch (Cape Town, South Africa) — Feature expansion based on global best practices

---

## 1. Executive Summary

This plan extends the existing [PNW_PLATFORM_UPGRADE_PLAN.md](./PNW_PLATFORM_UPGRADE_PLAN.md) with research-backed features, opportunities, and a detailed implementation roadmap. Research covered 15+ neighborhood watch sites (US, UK, SA), apps (Nextdoor, Ring Neighbors, Closeby), and platforms (Neighbourhood Alert, CrimeMapping, NeighborhoodLink).

**Local context:** PNW operates under SAPS Diep River, uses CVIC (0860 002 669) for incident reporting, has 80+ volunteer patrollers, radio network, CCTV, and sponsors (ADT, Combat Force, Zone Security). Founded 2007.

---

## 2. Discovered Opportunities (New)

### 2.1 High-Impact Additions

| Opportunity | Source | Value | Effort |
|-------------|--------|-------|--------|
| **Scheme/Zone finder** | OurWatch, Fresno, Greenwich | Postcode/address search + map to find local groups | Medium |
| **Vacation watch** | Livermore, Burlington, Johnston | Residents register when away; volunteers/patrols check property | Medium |
| **Safety tips library** | Fresno, OurWatch, NNW | Crime prevention articles (burglary, scams, vehicle crime, ASB) | Low |
| **Newsletter archive** | NeighborhoodLink, Fresno | Past newsletters searchable; builds trust | Low |
| **Volunteer roles & recruitment** | OurWatch, NNW | Block captain, coordinator, patroller sign-up; role descriptions | Medium |
| **Push notifications** | The App Office (UK NHW app) | 10× more effective than email for alerts | High |
| **Neighbourhood Alert integration** | UK police platform | Real-time police-community messaging (if available in SA) | TBD |
| **Crime mapping** | CrimeMapping.com, LexisNexis | Visual crime data by area (requires data source) | High |
| **PWA / installable app** | UK NHW app, Neighborhood Bulletin | Mobile-first, offline-capable, push-ready | Medium |

### 2.2 Content & Engagement

| Opportunity | Source | Value | Effort |
|-------------|--------|-------|--------|
| **Step-by-step "Start a scheme"** | Fresno, OurWatch | 4–5 step guide with inquiry form | Low |
| **Impact stories** | OurWatch | Volunteer testimonials, crime prevention wins | Low |
| **Event types** | Neighbourhood Watch Week | Street parties, litter picks, listening campaigns, family fun days | Low |
| **Donate CTA** | Fresno, OurWatch | Prominent; 501c3/NPO tax-deductible messaging | Low |
| **Instagram/social feed** | Fresno | Embedded feed or link; builds community | Low |

### 2.3 Technical & UX

| Opportunity | Source | Value | Effort |
|-------------|--------|-------|--------|
| **WCAG 2.2 / Section 508** | NNW, Neighbourhood Watch Scotland | Accessibility compliance; screen reader support | Medium |
| **Reduced-motion respect** | Best practice | `prefers-reduced-motion` for animations | Low |
| **Mobile-first / PWA** | The App Office | Install prompt; offline fallback | Medium |
| **Email frequency preference** | Newsletter best practice | 1–3×/month; let users choose | Low |

### 2.4 Funding & Sustainability

| Opportunity | Source | Value | Effort |
|-------------|--------|-------|--------|
| **Grant eligibility** | Memphis NCP Grant | Up to $2,500 equivalent for cameras, lighting, events | Research SA |
| **Sponsor showcase** | PNW already has sponsors | Dedicated sponsor page; tiered visibility | Low |
| **Easyfundraising / affiliate** | OurWatch | Residents shop; % goes to PNW | Low |
| **Lottery / raffle** | OurWatch | Fundraising with prizes | Low |

---

## 3. Page-by-Page Detailed Plan

### 3.1 Homepage Enhancements

| Section | Current | Add | Priority |
|---------|---------|-----|----------|
| **Hero** | Logo, tagline, 2 CTAs | Add "Find your zone" quick link; consider "Report incident" tertiary CTA | P1 |
| **Emergency** | CVIC, SAPS | Add "When to call 911 vs non-emergency" tip; link to safety tips | P2 |
| **Primary CTAs** | Register member, Register guest | Add "Start a scheme" (if no group in zone), "Donate" | P1 |
| **Incidents** | Recent 5 | Add type filter chips; "Report incident" CTA for logged-in users | P2 |
| **Events** | Upcoming 6 | Add "Neighbourhood Watch Week" / community events promo | P2 |
| **New sections** | — | Safety tips teaser (3 cards); Volunteer roles teaser; Sponsor logos | P1 |

### 3.2 New Pages to Add

| Page | Purpose | Content | Priority |
|------|---------|---------|----------|
| **/find** | Scheme/zone finder | Postcode/address input → map + zone info + "Join" / "Start scheme" | P1 |
| **/safety-tips** | Crime prevention library | Categories: Burglary, Scams, Vehicle crime, ASB, General. Articles with headings, lists, links | P1 |
| **/volunteer** | Volunteer recruitment | Roles (Patroller, Block captain, Coordinator); sign-up form; impact stats | P1 |
| **/vacation-watch** | Vacation watch sign-up | Form: dates, address, contact; eligibility (1+ week, single-family); disclaimer | P2 |
| **/donate** | Donations | Bank details (existing); why donate; sponsor tiers; optional payment link | P1 |
| **/start-scheme** | Start a new scheme | 4–5 step guide; inquiry form; contact CSO | P2 |
| **/about** | About PNW | History (2007), mission, structure, committee, partners (CVIC, SAPS, DOCS) | P1 |
| **/sponsors** | Sponsor showcase | ADT, Combat Force, Zone Security; sponsor benefits; become a sponsor CTA | P2 |

### 3.3 Existing Page Enhancements

| Page | Add | Priority |
|------|-----|----------|
| **/incidents** | Filters (zone, type, date range); "Report incident" prominent; crime mapping placeholder (future) | P1 |
| **/events** | Calendar view toggle; past events archive; RSVP count on cards | P2 |
| **/contact** | Committee + emergency (keep); add "General inquiry" vs "Report incident" routing | P2 |
| **/documents** | Newsletter archive; category: Safety Tips, Forms, Policies | P1 |
| **/dashboard** | Vacation watch status; volunteer hours (if tracked); quick "Report incident" | P2 |
| **/register** | Zone selector (from Zone table); "Find my zone" link | P1 |

---

## 4. Feature Specifications

### 4.1 Scheme/Zone Finder (`/find`)

**User flow:**
1. User enters postcode or address (or selects from dropdown if zones are discrete).
2. Map shows zone boundary (or marker); zone name, coordinator contact, member count.
3. CTAs: "Join this scheme" (→ register with zone pre-filled) or "No scheme? Start one" (→ /start-scheme).

**Data:** Zone table has `name`, `mapUrl`. Add `postcodes` (array or JSON) or `boundary` (GeoJSON) if mapping needed. For MVP: manual zone list with postcode prefixes.

**Tech:** Server Component; optional Google Maps/Mapbox for boundary display. Fallback: zone list with search.

### 4.2 Safety Tips Library (`/safety-tips`)

**Structure:**
- Categories: Burglary prevention, Scam awareness, Vehicle crime, Anti-social behaviour, General safety.
- Each article: title, summary, body (prose), last updated, related links.
- Source content from OurWatch toolkits, SAPS, CVIC; adapt for SA context.

**Schema:** New `SafetyTip` model or use `Document` with category "Safety Tip". Prefer dedicated model for structured content.

```prisma
model SafetyTip {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  category    String   // burglary, scams, vehicle, asb, general
  summary     String?
  content     String   // markdown or rich text
  order       Int      @default(0)
  updatedAt   DateTime @updatedAt
}
```

### 4.3 Volunteer Recruitment (`/volunteer`)

**Content:**
- Roles: Patroller (80+), Block captain, Coordinator, Committee (chair, secretary, treasurer).
- Per role: description, time commitment, requirements, "Apply" CTA.
- Impact stats: "80+ patrollers", "X incidents reported", "X members".

**Form:** Name, email, phone, role interest, zone, availability. → ContactMessage or new `VolunteerInterest` table. Notify committee.

### 4.4 Vacation Watch (`/vacation-watch`)

**Eligibility:** 1+ week away; single-family residence; max 4 weeks (renewable).

**Form fields:** Name, address, contact number, away dates, emergency contact, special instructions (e.g. pets, keys).

**Disclaimer:** "Visual checks only; no liability; complements other security."

**Backend:** New `VacationWatch` model or extend Incident/Event. Committee/patrol coordinator receives notification.

### 4.5 Newsletter & Email Preferences

**Current:** Email to members. **Add:**
- Archive page (past newsletters as documents or posts).
- User preference: frequency (weekly, bi-weekly, monthly); categories (incidents, events, tips).
- Schema: `User.newsletterFrequency`, `User.newsletterCategories` (JSON or relation).

### 4.6 Push Notifications (Future)

**Source:** UK NHW app reports 10× effectiveness vs email.

**Options:**
- Web Push (PWA): Service worker, VAPID keys, backend (e.g. web-push library).
- Third-party: OneSignal, Firebase Cloud Messaging.
- WhatsApp: Schema ready; API integration when available.

**Use cases:** Incident alerts, event reminders, urgent safety messages.

---

## 5. Integration & Partnership Opportunities

### 5.1 Confirmed Local

| Partner | Role | Integration |
|---------|------|-------------|
| **CVIC** | Incident control | Prominent number; link to reporting flow |
| **SAPS Diep River** | Police | Contact info; crime prevention resources |
| **DOCS** | Accreditation | Badge/mention on About |
| **Sponsors** | ADT, Combat Force, Zone Security | Sponsor page; logos; tier visibility |

### 5.2 Research for SA

| Item | Action |
|------|--------|
| **Community messaging platform** | Check if SA police have equivalent to Neighbourhood Alert |
| **Crime data API** | SAPS or local gov open data for crime mapping |
| **NPO/trust status** | Confirm tax-deductible donations; update Donate page |
| **Grants** | Western Cape / City of Cape Town community safety grants |

---

## 6. Accessibility & Compliance

| Requirement | Action |
|-------------|--------|
| **WCAG 2.2 AA** | Audit; fix contrast, focus, labels, alt text |
| **Section 508** | If targeting US donors; same as WCAG |
| **Reduced motion** | `prefers-reduced-motion: reduce` → disable or simplify Motion |
| **Skip link** | Add `#main` skip; ensure all interactive elements focusable |
| **Screen reader** | Test with NVDA/VoiceOver; aria-labels where needed |

---

## 7. Phased Implementation Roadmap

### Phase A: Content & Navigation (2–3 weeks)

| # | Task | Verification |
|---|------|--------------|
| A.1 | Add /about page (mission, history, committee, partners) | Content renders |
| A.2 | Add /safety-tips with seed content (5+ articles) | Categories, articles display |
| A.3 | Add /donate page (bank details, why donate, sponsors) | Donate CTA works |
| A.4 | Add /sponsors page | Sponsor logos, tiers |
| A.5 | Homepage: Safety tips teaser (3 cards), Donate CTA, Sponsor logos | Sections visible |
| A.6 | Footer: Add About, Safety Tips, Donate, Sponsors links | Nav complete |

### Phase B: Finder & Volunteer (2 weeks)

| # | Task | Verification |
|---|------|--------------|
| B.1 | Zone model: add postcodePrefix or boundary if needed | Schema updated |
| B.2 | /find page: postcode/address input → zone match | Finder returns zone |
| B.3 | /find: "Join" pre-fills zone in register; "Start scheme" links to /start-scheme | Flow works |
| B.4 | /volunteer page: roles, impact stats, form | Form submits |
| B.5 | VolunteerInterest schema + Server Action | Data stored |
| B.6 | /start-scheme: 4-step guide + inquiry form | Form submits |

### Phase C: Vacation Watch & Enhancements (2 weeks)

| # | Task | Verification |
|---|------|--------------|
| C.1 | VacationWatch schema + migration | Table exists |
| C.2 | /vacation-watch page: form, eligibility, disclaimer | Form validates |
| C.3 | Vacation watch Server Action → notify committee | Notification sent |
| C.4 | Register: zone selector from DB; "Find my zone" link | Zone pre-fill works |
| C.5 | Incidents: type filter, zone filter | Filters work |
| C.6 | Documents: Newsletter archive category + seed | Archive visible |

### Phase D: Polish & Future Prep (1–2 weeks)

| # | Task | Verification |
|---|------|--------------|
| D.1 | Accessibility audit: contrast, focus, skip link, reduced-motion | Passes checks |
| D.2 | PWA manifest + service worker (optional) | Installable on mobile |
| D.3 | Email preference fields on User (newsletter frequency) | Preferences saved |
| D.4 | Recharts: incident trends on dashboard (from Phase 4) | Chart renders |
| D.5 | Search: incidents, events (from Phase 4) | Search works |

---

## 8. Content Checklist (Safety Tips — Seed)

| Category | Article ideas |
|----------|---------------|
| **Burglary** | Secure doors/windows; lighting; alarm signs; when to call SAPS |
| **Scams** | Phone scams, banking fraud, doorstep scams; report to SAPS |
| **Vehicle** | Lock cars; no valuables; park in well-lit areas |
| **ASB** | Report to SAPS; log incidents; community mediation |
| **General** | CVIC vs SAPS; when to call 10111; emergency vs non-emergency |

---

## 9. Decisions & Open Questions

| Item | Decision / Question |
|------|---------------------|
| **Zone finder data** | Manual postcode list vs map boundary? Start with postcode prefixes. |
| **Vacation watch liability** | Legal disclaimer required; committee to approve wording. |
| **Push notifications** | Phase D or later; requires PWA + backend. |
| **Crime mapping** | Requires data source; defer until SAPS/local data available. |
| **Neighbourhood Alert SA** | Research if equivalent exists; document for future. |

---

## 10. Quick Reference — Best Practices Applied

| Practice | Source | PNW Implementation |
|----------|--------|---------------------|
| Primary CTAs above fold | Fresno, OurWatch | Register, Find zone, Donate |
| Group/scheme finder | OurWatch, Fresno, Greenwich | /find with postcode |
| Safety tips library | Fresno, OurWatch | /safety-tips |
| Step-by-step start guide | Fresno, OurWatch | /start-scheme |
| Volunteer recruitment | OurWatch, NNW | /volunteer |
| Vacation watch | Livermore, Burlington | /vacation-watch |
| Donate prominence | Fresno, OurWatch | /donate, footer CTA |
| Sponsor showcase | Fresno | /sponsors |
| Newsletter archive | NeighborhoodLink | Documents category |
| Impact stories | OurWatch | About, Volunteer pages |
| Accessibility | NNW, NHW Scotland | WCAG 2.2, reduced-motion |
| Mobile-first | The App Office | Responsive, PWA optional |

---

*Plan follows: Plan → Build → Verify → Document. Re-plan on drift.*
