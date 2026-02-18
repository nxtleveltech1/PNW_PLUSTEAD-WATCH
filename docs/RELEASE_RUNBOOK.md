# PNW Release Runbook (Vercel + Neon + Clerk)

## 1. Pre-Release Checks
- Confirm environment variables in Vercel project:
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_APP_URL`
- Run full verification:
  - `bun run lint`
  - `bun run build:bun`
  - `bun run build:node`

## 2. Database Controls
- Apply schema safely:
  - `bun run db:generate`
  - `bun run db:push` (or migration strategy per environment)
- Optional seed (non-destructive reference data only):
  - `bun run db:seed`

## 3. Clerk Webhook
- Ensure production Clerk webhook points to:
  - `/api/webhooks/clerk`
- Confirm `CLERK_WEBHOOK_SECRET` matches Clerk dashboard.

## 4. Staging Validation
- Deploy preview build.
- Execute smoke checks:
  - auth sign-in/sign-up
  - registration complete
  - report incident
  - RSVP toggle
  - all public routes render
- Capture required evidence in `docs/EVIDENCE_MATRIX.md`.

## 5. Production Release
- Deploy in maintenance window.
- Monitor:
  - Vercel function/runtime logs
  - Prisma errors
  - Clerk webhook events
  - form submission success rates

## 6. Rollback Strategy
- If severe regression detected:
  - rollback deployment in Vercel to previous stable commit
  - verify auth and DB connectivity
  - announce incident and recovery timeline
