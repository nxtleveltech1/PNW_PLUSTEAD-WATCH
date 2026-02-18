# PNW Platform Upgrade Plan — Comprehensive Review & Roadmap

**Document Version:** 1.0  
**Date:** 2026-02-18  
**Scope:** Plumstead Neighbourhood Watch (plumsteadwatch.org.za) — Full platform audit, upgrade, and world-class delivery

---

## 1. Executive Summary

This document provides a meticulous, module-by-module review of the PNW platform, identifies gaps against the declared stack and world-class standards, and defines a phased implementation plan. **BREAK NOTHING** is the primary constraint.

### 1.1 Stack (Immutable)

| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Framework | Next.js 15 App Router (RSC) |
| UI | React 19, TypeScript strict |
| Components | shadcn/ui, Radix, Tailwind, Lucide |
| State | Zustand |
| Data | TanStack Query, TanStack Table |
| Forms | RHF + Zod |
| Motion | Motion (framer-motion) |
| Database | Neon Postgres, Prisma |
| Auth | Clerk |
| AI | Vercel AI |
| Feedback | Sonner |
| Drawer | Vaul |
| Charts | Recharts |

### 1.2 MCP & Skills in Use

- **Neon MCP** — Schema, migrations, queries, tuning
- **Clerk MCP** — Auth patterns, snippets
- **Context7 MCP** — Next.js, Clerk, shadcn docs
- **meta-WhatsApp MCP** — *Not available in current toolset; document for future integration*
- **Skills:** cursor-project-manager, frontend-architect, graphic-web-design-expert, neon-database-expert, shadcn-ui-specialist, tailwind-expert

---

## 2. Current State Audit

### 2.1 File & Module Map

```
pnw/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, ClerkProvider, fonts
│   │   ├── page.tsx            # Home: hero, emergency, incidents, events
│   │   ├── globals.css         # Design tokens, dark mode
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── dashboard/page.tsx   # Protected, minimal
│   │   ├── documents/page.tsx
│   │   ├── events/page.tsx, events/[id]/page.tsx
│   │   ├── incidents/page.tsx, incidents/[id]/page.tsx
│   │   ├── register/page.tsx   # Member — redirect only
│   │   ├── register/guest/page.tsx  # Guest — redirect only
│   │   ├── terms/page.tsx
│   │   ├── disclaimer/page.tsx
│   │   └── privacy/page.tsx
│   ├── components/
│   │   ├── layout/header.tsx, footer.tsx
│   │   └── ui/button.tsx, card.tsx, badge.tsx
│   ├── lib/db.ts, utils.ts
│   └── middleware.ts           # Clerk protect: /dashboard, /admin, /api/private
├── prisma/schema.prisma, seed.ts
├── public/images/             # logo.png, hero-2.png, hero-logo.jpg
├── tailwind.config.ts
└── components.json            # shadcn new-york, RSC
```

### 2.2 Database Schema (Neon)

| Table | Purpose |
|-------|---------|
| User | clerkId, email, memberType, zoneId, isApproved, whatsappOptIn |
| Incident | type, location, dateTime, zoneId, createdById |
| Event | title, location, startAt, endAt, content |
| EventRsvp | eventId, userId |
| Zone | name, mapUrl |
| Document | name, categoryId, fileUrl |
| DocumentCategory | name |
| CommitteeMember | role, name, phone, email, order |
| EmergencyContact | service, number, order |
| Sponsor | name, content, linkUrl, order |
| ContactMessage | name, email, message, createdAt (new — for contact form) |

### 2.3 Seed Data Coverage

- Zone: Plumstead
- Incidents: 5 sample
- Events: 6 sample
- CommitteeMember: 5
- EmergencyContact: 8
- **Missing:** DocumentCategory, Document, Sponsor

---

## 3. Gap Analysis

### 3.1 Stack Gaps (Declared vs Implemented)

| Capability | Status | Action |
|------------|--------|--------|
| Zustand | Not used | Add for client state (e.g. UI preferences, filters) |
| TanStack Query | Not used | Add for client-side caching, mutations |
| TanStack Table | Not used | Add for incidents/events admin tables |
| RHF + Zod | Not used | Register forms, contact form, report incident |
| Motion | Package present | Add page/section transitions, staggered reveals |
| Sonner | Not used | Add Toaster, use for form feedback |
| Vaul | Not used | Add Drawer for mobile nav, filters |
| Recharts | Not used | Add incident/event charts for dashboard |
| Vercel AI | Not used | Optional: FAQ bot, incident summarisation |
| Server Actions | Not used | All mutations via Server Actions |

### 3.2 Feature Gaps

| Area | Gap | Priority |
|------|-----|----------|
| Register | No form; only redirect to Clerk sign-up. No zone/memberType/WhatsApp capture | P0 |
| Dashboard | Placeholder only; no personalisation, RSVPs, incidents | P0 |
| User sync | No Clerk → User sync; User table unused | P0 |
| Documents | No seed data; categories empty | P1 |
| Admin | /admin protected but no admin UI | P1 |
| Event RSVP | Schema exists; no UI to RSVP | P1 |
| Incident report | No user-submitted incident form | P1 |
| Contact form | Static committee/emergency; no message form | P2 |
| Mobile nav | No hamburger/drawer | P2 |
| Dark mode | Tokens exist; no toggle | P2 |
| Search | No search across incidents/events | P2 |
| WhatsApp | Schema ready; no integration (MCP unavailable) | P3 |

### 3.3 Design & UX Gaps

| Area | Gap |
|------|-----|
| Loading | No loading.tsx, Suspense boundaries |
| Error | No error.tsx, not-found customisation |
| Accessibility | No skip link, focus management |
| Motion | No reduced-motion respect, no transitions |
| Typography | Prose not configured for event/incident content |
| Responsive | No mobile nav; header may overflow |

---

## 4. Module & Process Map

### 4.1 Auth Flow

```
Current:
  Sign in/up → Clerk hosted → Redirect
  Middleware protects /dashboard, /admin, /api/private
  Dashboard: auth() → redirect if !userId

Missing:
  - Clerk webhook → sync User to DB (clerkId, email, etc.)
  - Post-sign-up redirect based on memberType
  - Role/permission checks for admin
```

### 4.2 Registration Flow

```
Current:
  /register → "Continue with sign up" → /sign-up (Clerk)
  /register/guest → same

Missing:
  - Form: zone selection, member vs guest, WhatsApp opt-in
  - Server Action to create/update User after Clerk sign-up
  - Post-registration onboarding
```

### 4.3 Incident Flow

```
Current:
  List (RSC) → Detail (RSC)
  No create/edit

Missing:
  - Report incident form (auth required)
  - Server Action create
  - Zone filter, type filter
```

### 4.4 Event Flow

```
Current:
  List (RSC) → Detail (RSC)
  No RSVP

Missing:
  - RSVP button + Server Action
  - Past vs upcoming filter
  - Calendar view option
```

### 4.5 Document Flow

```
Current:
  List by category (RSC)
  No upload (admin)

Missing:
  - DocumentCategory + Document seed
  - Admin upload (future)
```

### 4.6 Contact Flow

```
Current:
  Committee + Emergency (static from DB)

Missing:
  - Contact form (name, email, message)
  - Server Action → email or store
```

---

## 5. Phased Implementation Plan

### Phase 0: Foundation (No Breaking Changes)

| # | Task | Verification |
|---|------|--------------|
| 0.1 | Add Sonner Toaster to layout | Toast appears on trigger |
| 0.2 | Add loading.tsx for key routes | Loading UI shows |
| 0.3 | Add error.tsx, not-found | Errors handled |
| 0.4 | Seed DocumentCategory + Document (if files exist) | Documents page shows data |
| 0.5 | Add Toaster to layout, verify build | `bun run build` passes |

### Phase 1: User Sync & Registration

| # | Task | Verification |
|---|------|--------------|
| 1.1 | Clerk webhook API route → sync User | New sign-up creates User |
| 1.2 | Registration form (RHF+Zod): zone, memberType, whatsappOptIn | Form validates, submits |
| 1.3 | Server Action: create/update User after sign-up | User record correct |
| 1.4 | Post-sign-up redirect to dashboard | Flow works end-to-end |

### Phase 2: Dashboard & Core UX

| # | Task | Verification |
|---|------|--------------|
| 2.1 | Dashboard: user info, recent incidents, upcoming events, RSVPs | Data displays |
| 2.2 | Event RSVP Server Action + UI | RSVP persists |
| 2.3 | Vaul Drawer for mobile nav | Mobile nav works |
| 2.4 | Motion: hero stagger, section fade-in | Animations respect reduced-motion |

### Phase 3: Incident Report & Admin Prep

| # | Task | Verification |
|---|------|--------------|
| 3.1 | Report incident form (auth required) | Incident created |
| 3.2 | Incident filters (zone, type) | Filters work |
| 3.3 | Admin layout + incidents table (TanStack Table) | Admin can view |
| 3.4 | ContactMessage schema + contact form Server Action | Messages stored |

### Phase 4: Polish & Extras

| # | Task | Verification |
|---|------|--------------|
| 4.1 | Contact form UI (Server Action stores in DB) | Message stored |
| 4.2 | Dark mode toggle | Theme persists |
| 4.3 | Recharts: incident trends (dashboard) | Chart renders |
| 4.4 | Search (incidents, events) | Results correct |

---

## 6. Before / During / After Checklist (Per Area)

### 6.1 Hero & Home

| Stage | Check |
|-------|-------|
| Before | Hero image (hero-2.png), overlay opacity, logo size |
| During | No layout shift; images load with priority |
| After | Contrast, readability, CTA visibility |

### 6.2 Auth & Middleware

| Stage | Check |
|-------|-------|
| Before | Protected routes: /dashboard, /admin, /api/private |
| During | Clerk keys optional; app works without |
| After | Webhook sync; no duplicate Users |

### 6.3 Register

| Stage | Check |
|-------|-------|
| Before | Redirect to sign-up only |
| During | Form captures zone, memberType, whatsappOptIn |
| After | User created/updated; redirect to dashboard |

### 6.4 Dashboard

| Stage | Check |
|-------|-------|
| Before | Placeholder text |
| During | User data, incidents, events, RSVPs |
| After | Personalised, actionable |

### 6.5 Incidents & Events

| Stage | Check |
|-------|-------|
| Before | List + detail; no create, no RSVP |
| During | Report form; RSVP button; filters |
| After | Full CRUD where appropriate |

### 6.6 Documents & Contact

| Stage | Check |
|-------|-------|
| Before | Documents empty; contact static |
| During | Seed docs; contact form |
| After | Downloads work; messages received |

---

## 7. Verification & Self-Review Protocol

1. **After each task:** Run `bun run build`; fix any errors.
2. **After each phase:** Manual smoke test of affected routes.
3. **Before merge:** No new `any`; no console errors in browser.
4. **Database:** Use Neon MCP to verify schema and data after migrations.

---

## 8. Decisions (Resolved)

| Item | Decision |
|------|----------|
| WhatsApp | Schema only — no integration; `whatsappOptIn`, `whatsappPhone` remain for future use |
| Document upload | Yes — implement upload; store in Vercel Blob or S3 (TBD in Phase 3) |
| Contact form | Store in DB — new `ContactMessage` table; admin views in dashboard |
| Admin roles | Yes — use Clerk org roles or custom `User.role` for admin access |

---

## 9. Next Steps

1. **Confirm plan** — Review this document; approve or adjust phases.
2. **Resolve blockers** — Answer questions in §8.
3. **Execute Phase 0** — Foundation tasks; verify build.
4. **Iterate** — Phase 1 → verify → Phase 2 → verify → …

---

## 10. Multi-Pass Review Protocol (Agent Simulation)

Each phase completion requires **three verification passes** before marking done:

| Pass | Focus | Actions |
|------|-------|---------|
| **Pass 1 — Build** | Implementation | Code written; `bun run build` passes |
| **Pass 2 — Functional** | Behaviour | Manual test of new flows; no regressions |
| **Pass 3 — Standards** | Stack & rules | No `any`; RSC default; shadcn primitives; Zod schemas |

Document each pass result before proceeding to next phase.

---

## 11. Implementation Checklist (Quick Reference)

```
[x] Phase 0: Sonner, loading, error, seed docs
[x] Phase 1: Clerk webhook, registration form, User sync
[x] Phase 2: Dashboard content, RSVP, Vaul nav
[x] Phase 3: Report incident, Contact form (DB)
[x] Phase 4: Contact form UI (integrated in Phase 3)
[ ] Phase 4 remaining: dark mode, Recharts, search
```

---

## 12. Delivered (2026-02-18)

| Item | Status |
|------|--------|
| Sonner Toaster | Done |
| loading.tsx, error.tsx, not-found.tsx | Done |
| Document seed (Forms, Policies) | Done via Neon |
| Clerk webhook (user.created/updated/deleted) | Done |
| Registration form (zone, memberType, WhatsApp) | Done |
| prepareRegistration + completeRegistration | Done |
| Dashboard (incidents, events, RSVPs) | Done |
| Event RSVP button | Done |
| Vaul mobile nav drawer | Done |
| Report incident form | Done |
| Contact form (stores in DB) | Done |
| ContactMessage schema + migration | Done |

**Env:** Set `NEXT_PUBLIC_APP_URL` (e.g. `https://yoursite.com`) for registration redirect. Set `CLERK_WEBHOOK_SECRET` for Clerk webhook.

---

*This plan follows: Plan → Build → Verify → Document. Re-plan on drift. Act immediately. Ask only if blocked.*
