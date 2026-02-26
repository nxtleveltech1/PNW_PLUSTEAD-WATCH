# PNW Regression Manifest

## Core Flows

| Flow | Entry Route | Action/Dependency | Expected Result |
|---|---|---|---|
| Member registration | `/register` | `prepareRegistration`, Clerk sign-up, `completeRegistration` | User linked to zone and redirected to `/dashboard` |
| Guest registration | `/register/guest` | `prepareRegistration`, Clerk sign-up, `completeRegistration` | User saved with `memberType=GUEST` |
| Incident reporting | `/incidents` | `reportIncident` | Incident record created with user attribution |
| Event RSVP | `/events/[id]` | `rsvpEvent` | RSVP toggles add/remove reliably |
| Contact submission | `/contact` | `submitContactMessage` | Message stored in `ContactMessage` |
| Volunteer interest | `/volunteer` | `submitVolunteerInterest` | Record stored in `VolunteerInterest` |
| Vacation watch | `/vacation-watch` | `submitVacationWatch` | Record stored in `VacationWatch`, date validation enforced |
| Start scheme inquiry | `/start-scheme` | `submitSchemeInquiry` | Record stored in `SchemeInquiry` |
| Safety tip browse | `/safety-tips` -> `[slug]` | Prisma read | Category list and details render |
| Find zone routing | `/find` | Client postcode logic | Match routes to `/register?zone=...` else `/start-scheme` |
| Admin console | `/admin` | `requireAdmin`, `User.role === "ADMIN"` | Admin can view incidents, approve business listings, view contact messages |

## Auth and Security

| Area | Check |
|---|---|
| Clerk middleware | Protected routes (`/dashboard`, `/admin`, `/api/private`) require auth |
| Admin role guard | `requireAdmin()` in admin layout | Non-admin users redirected to `/dashboard` |
| Clerk webhook | user.created, user.updated, user.deleted sync user model |
| Server actions | auth required actions redirect unauthenticated users |

## Build/Release Gate

| Gate | Command |
|---|---|
| Lint | `bun run lint` |
| Bun build | `bun run build:bun` |
| Node build | `bun run build:node` |
| Combined verify | `bun run ci:verify` |
