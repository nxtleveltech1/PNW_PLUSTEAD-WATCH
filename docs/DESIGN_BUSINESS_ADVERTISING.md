# Business Advertising & Networking - Design Document

## Overview

The Business Advertising & Networking feature extends PNW with a self-service business directory, in-app messaging, business events, and a referral system. It is separate from the existing Sponsor model (admin-managed premium partners).

## Architecture

```
Client (RSC + Client Components)
    ↓
Server Actions / API Routes
    ↓
Prisma → Neon Postgres
    ↑
Clerk (auth)
```

## Data Model

### BusinessListing

- Self-service submissions with `PENDING` status; admin approval required for `APPROVED`
- Categories: RETAIL, SERVICES, FOOD, HEALTH, OTHER
- Linked to Zone (optional) and User (creator)
- Sponsor model remains for premium/featured partners

### BusinessMessage

- Resident → Listing owner communication
- One-way: resident sends, listing owner receives
- Listing owner = User who created the listing (`createdById`)

### BusinessEvent

- Events hosted by businesses (optional `listingId`)
- RSVP via BusinessEventRsvp
- Future events only for RSVP button

### BusinessReferral

- Resident refers a friend (name, email) to a listing
- Referrer must be authenticated

## Routes

| Route | Auth | Purpose |
|-------|------|---------|
| `/business` | No | Directory with filters |
| `/business/[id]` | No | Listing detail, message/referral CTA |
| `/business/submit` | Yes | Self-service listing form |
| `/business/messages` | Yes | Inbox for listing owners |
| `/business/events` | No | Business events list |
| `/business/events/[id]` | No | Event detail + RSVP |
| `/business/referrals` | Yes | Referral form |

## API Endpoints

See `docs/openapi/business-advertising.yaml` for full OpenAPI spec.

## MCP Integration

- **user-neon**: Schema, migrations, query tuning
- **user-clerk**: Auth patterns
- **user-context7**: Next.js, shadcn docs
- **user-n8n-mcp**: Optional webhooks for new listing/referral
- **cursor-ide-browser**: E2E testing

## WhatsApp

Schema-ready (`User.whatsappOptIn`, `User.whatsappPhone`). Integration deferred.
