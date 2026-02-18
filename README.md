# Plumstead Neighbourhood Watch (PNW)

Modern platform for Plumstead Neighbourhood Watch — incidents, events, documents, and community engagement.

## Stack

- **Bun** — Runtime
- **Next.js 15** — App Router, RSC
- **React 19** — UI
- **Neon** — Postgres database
- **Clerk** — Authentication
- **TanStack** — Query, Table
- **Prisma** — ORM
- **shadcn/ui** — Components
- **Tailwind** — Styling

## Setup

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env.local`
   - Add Neon connection strings (from [Neon Console](https://console.neon.tech))
   - Add Clerk keys (from [Clerk Dashboard](https://dashboard.clerk.com))

3. **Database**
   ```bash
   bunx prisma db push
   bun run prisma/seed.ts
   ```

4. **Run**
   ```bash
   bun run dev
   ```

## Clerk (optional)

Without Clerk keys, the app runs with a simplified header (no sign-in/sign-up). Add keys to enable full auth:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Scripts

| Command | Description |
|--------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run build:bun` | Build with Bun runtime |
| `bun run build:node` | Build with Node runtime |
| `bun run ci:verify` | Lint + Bun build + Node build |
| `bun run start` | Start production server |
| `bun run db:push` | Push schema to DB |
| `bun run db:seed` | Seed database |

## Delivery Governance

- `docs/EVIDENCE_MATRIX.md` - before/during/after evidence checklist
- `docs/REGRESSION_MANIFEST.md` - route and flow regression checklist
- `docs/ACTION_LOG.md` - implementation and review log
- `docs/RELEASE_RUNBOOK.md` - staging and production deployment controls
- `docs/SCREENSHOT_CAPTURE.md` - evidence screenshot capture procedure
