# PNW Master Implementation Plan — Full Specification

**Document Version:** 1.0  
**Date:** 2026-02-18  
**Constraint:** BREAK NOTHING

---

## 1. Scope & Modules

| Module | Before | During | After |
|--------|--------|--------|-------|
| **Database** | Zone, User, Incident, Event, Document, CommitteeMember, EmergencyContact, Sponsor, ContactMessage | Add SafetyTip, VolunteerInterest, VacationWatch; Zone.postcodePrefix | All migrations applied; seed runs |
| **Auth** | Clerk sign-in/up, webhook sync, middleware | No changes | Unchanged |
| **Register** | Zone dropdown, member/guest | Add "Find my zone" link; zone pre-fill from ?zone= | Zone selector + finder link |
| **Homepage** | Hero, emergency, incidents, events | Add safety tips teaser, donate CTA, sponsor logos | Full sections |
| **Find** | — | New page: postcode → zone | /find works |
| **About** | — | New page: mission, history, committee, partners | /about works |
| **Safety Tips** | — | New page + SafetyTip model + seed | /safety-tips works |
| **Donate** | — | New page: bank details, why donate | /donate works |
| **Sponsors** | — | New page + Sponsor seed | /sponsors works |
| **Volunteer** | — | New page + VolunteerInterest + action | /volunteer works |
| **Vacation Watch** | — | New page + VacationWatch + action | /vacation-watch works |
| **Start Scheme** | — | New page + inquiry action | /start-scheme works |
| **Incidents** | List, report form | Add zone/type filters (client) | Filters work |
| **Navigation** | Header, footer, mobile | Add Find, About, Safety Tips, Donate, Sponsors | Full nav |
| **Accessibility** | — | Skip link, reduced-motion | WCAG-ready |

---

## 2. Database Schema Changes

### 2.1 New Models

```prisma
model SafetyTip {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  category  String   // burglary, scams, vehicle, asb, general
  summary   String?  @db.Text
  content   String   @db.Text
  order     Int      @default(0)
  updatedAt DateTime @updatedAt
}

model VolunteerInterest {
  id          String   @id @default(cuid())
  name        String
  email       String
  phone       String?
  roleInterest String
  zoneId      String?
  availability String? @db.Text
  message     String?  @db.Text
  createdAt   DateTime @default(now())
}

model VacationWatch {
  id              String   @id @default(cuid())
  name            String
  address         String
  contactPhone    String
  awayFrom        DateTime
  awayUntil       DateTime
  emergencyContact String?
  specialInstructions String? @db.Text
  createdAt       DateTime @default(now())
}

model SchemeInquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  address   String?
  message   String?  @db.Text
  createdAt DateTime @default(now())
}
```

### 2.2 Zone Alteration

```prisma
model Zone {
  id             String    @id @default(cuid())
  name           String
  postcodePrefix String?   // e.g. "7800" for Plumstead
  mapUrl         String?
  members        User[]
  incidents      Incident[]
}
```

---

## 3. Page Specifications

### 3.1 /about
- Mission statement
- History (founded 2007)
- Committee (from CommitteeMember)
- Partners: CVIC, SAPS Diep River, DOCS
- Layout: Header, Footer, prose

### 3.2 /safety-tips
- List by category (tabs or filter)
- Detail: /safety-tips/[slug]
- Content from SafetyTip

### 3.3 /donate
- Bank details (FNB, ACC, Code)
- Why donate
- Link to /sponsors

### 3.4 /sponsors
- Sponsor cards from Sponsor table
- Become a sponsor CTA → /contact

### 3.5 /find
- Input: postcode or address
- Match Zone by postcodePrefix
- Show zone name, "Join" (→ /register?zone=id), "Start scheme" (→ /start-scheme)

### 3.6 /volunteer
- Roles: Patroller, Block captain, Coordinator, Committee
- Impact stats (80+ patrollers)
- Form → submitVolunteerInterest

### 3.7 /vacation-watch
- Eligibility notice
- Form: name, address, phone, awayFrom, awayUntil, emergencyContact, specialInstructions
- Disclaimer
- submitVacationWatch action

### 3.8 /start-scheme
- 4-step guide
- Inquiry form → submitSchemeInquiry

---

## 4. Server Actions

| Action | Input | Output |
|--------|-------|--------|
| submitVolunteerInterest | name, email, phone?, roleInterest, zoneId?, availability?, message? | revalidatePath |
| submitVacationWatch | name, address, contactPhone, awayFrom, awayUntil, emergencyContact?, specialInstructions? | revalidatePath |
| submitSchemeInquiry | name, email, phone?, address?, message? | revalidatePath |

---

## 5. Navigation Updates

### Header + Mobile
- Add: Find, About, Safety Tips, Donate, Sponsors (or group under "Get involved")
- Order: Events, Incidents, Find, About, Safety Tips, Documents, Donate, Contact

### Footer
- Add: About, Safety Tips, Donate, Sponsors, Find
- Keep: Terms, Disclaimer, Privacy

---

## 6. Accessibility

- Skip link: `<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>`
- main id: `id="main"` on main
- Reduced motion: AnimateSection already; verify prefers-reduced-motion in globals.css

---

## 7. MCP & Skills Used

| Tool | Use |
|------|-----|
| Neon MCP | Schema migration, seed data |
| Clerk MCP | Auth patterns (existing) |
| Context7 MCP | Next.js, shadcn docs |
| meta-WhatsApp MCP | **Not available** — schema ready for future |

---

## 8. Verification Checklist

- [x] `bun run build` passes
- [x] All new routes render
- [x] Forms submit and store data
- [x] Register zone pre-fill from ?zone=
- [x] Incidents filters work
- [x] No console errors
- [x] No `any` types

---

## 9. Implementation Complete (2026-02-18)

| Module | Status |
|--------|--------|
| Schema (SafetyTip, VolunteerInterest, VacationWatch, SchemeInquiry, Zone.postcodePrefix) | Done |
| Neon migration | Applied |
| Seed (SafetyTip, Sponsor, Newsletter) | Done |
| /about | Done |
| /safety-tips, /safety-tips/[slug] | Done |
| /donate | Done |
| /sponsors | Done |
| /find, FindZoneForm | Done |
| /volunteer, VolunteerForm, submitVolunteerInterest | Done |
| /vacation-watch, VacationWatchForm, submitVacationWatch | Done |
| /start-scheme, SchemeInquiryForm, submitSchemeInquiry | Done |
| Homepage: safety tips teaser, donate CTA, sponsor logos | Done |
| Hero: Find your zone, Donate CTAs | Done |
| Header, footer, mobile nav: full links | Done |
| Register: zone pre-fill from ?zone=, Find your zone link | Done |
| Incidents: zone + type filters | Done |
| Skip link, id="main" on all pages | Done |
