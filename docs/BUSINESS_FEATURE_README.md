# Business Advertising & Networking Feature

## Summary

Self-service business directory with in-app messaging, events, and referrals for the Plumstead Neighborhood Watch platform.

## Routes

- **`/business`** — Directory of approved listings (filters: category, zone, search)
- **`/business/[id]`** — Listing detail; message and refer-a-friend when signed in
- **`/business/submit`** — Submit listing (auth required)
- **`/business/messages`** — Inbox for listing owners (auth required)
- **`/business/events`** — Business events list
- **`/business/events/[id]`** — Event detail with RSVP
- **`/business/referrals`** — Referral form (auth required)

## Database

Run migration when DB is reachable:

```bash
bun run db:generate
bunx prisma migrate dev --name add_business_advertising
```

Or use `db:push` for development:

```bash
bun run db:push
```

## API

See `docs/openapi/business-advertising.yaml` for the OpenAPI spec.

## Admin

Listings are created with `status: PENDING`. To approve, update via Prisma or a future admin UI:

```ts
await prisma.businessListing.update({
  where: { id: "..." },
  data: { status: "APPROVED" },
});
```

## Tests

- Unit: Zod schemas
- Integration: Server actions
- Contract: API vs OpenAPI
- E2E: cursor-ide-browser (directory, submit, message, RSVP)
