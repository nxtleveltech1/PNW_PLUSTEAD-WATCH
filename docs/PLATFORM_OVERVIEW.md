# Plumstead Neighbourhood Watch -- Digital Community Safety Platform

**Platform Overview: Features, Functions, and Capabilities**

Version 1.0 | March 2026

---

## Document Governance

| Item               | Detail                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Prepared for       | PNW Executive Committee, prospective partners, and community stakeholders                |
| Classification     | Internal / Pre-proposal                                                                  |
| Frameworks applied | UNDP Digital Participation Guide (2025), ISO 37120/37122 Community Indicators, SaaS Proposal Best Practice |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement and Community Context](#2-problem-statement-and-community-context)
3. [Platform Architecture Overview](#3-platform-architecture-overview)
4. [Community-Facing Features](#4-community-facing-features)
5. [Membership and Identity](#5-membership-and-identity)
6. [Business Networking Hub](#6-business-networking-hub)
7. [Platform Administration](#7-platform-administration)
8. [Data Architecture and Security](#8-data-architecture-and-security)
9. [Integration and API Layer](#9-integration-and-api-layer)
10. [Quality Assurance and Governance](#10-quality-assurance-and-governance)
11. [Community Value and Impact](#11-community-value-and-impact)
12. [Roadmap and Future Capabilities](#12-roadmap-and-future-capabilities)

---

## 1. Executive Summary

The Plumstead Neighbourhood Watch (PNW) digital platform is a purpose-built community safety and engagement system that replaces legacy paper-based processes, fragmented phone trees, and outdated web technology with a modern, integrated digital experience.

The platform serves three distinct audiences -- residents seeking safety information, committee members administering community operations, and local businesses building neighbourhood visibility -- through a single, unified web application.

### Key Platform Metrics

| Dimension          | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Geographic coverage | Plumstead, Cape Town (postcode 7800)                        |
| Patrol sections    | 7 defined zones with street-level granularity                |
| Registered streets | 230+                                                         |
| Volunteer base     | 80+ active patrollers                                        |
| Operational since  | 2007 (community); 2025 (digital platform)                    |
| Admin roles        | 5 tiered roles with 11 granular permissions                  |
| Business categories | 5 (Retail, Services, Food and Dining, Health, Other)        |
| Sponsorship tiers  | 3 (Premium, Partner, Supporter)                              |
| Partner agencies   | CVIC, SAPS Diep River, Department of Community Safety (DOCS) |

### Technology Foundation

The platform is engineered for performance, accessibility, and maintainability using an enterprise-grade open-source stack: Next.js 15 with React 19 Server Components for fast, SEO-optimised rendering; Neon serverless Postgres for a scalable relational data layer; Clerk for identity management; and Tailwind CSS with shadcn/ui for a consistent, accessible design system. It is deployed on Vercel's global edge network, ensuring sub-second page loads for all South African users.

---

## 2. Problem Statement and Community Context

### The Challenge

Traditional neighbourhood watch operations face persistent structural limitations that reduce their effectiveness:

- **Fragmented communication.** Incident reports, meeting notices, and safety updates circulate via WhatsApp chains, printed flyers, and word of mouth. Information reaches some residents and misses others. There is no single source of truth.
- **Manual administration.** Member registration, volunteer coordination, payment reconciliation, and document distribution require committee time that should be directed toward safety operations.
- **Limited situational awareness.** Residents lack a consolidated, real-time view of local incident activity. Under-reporting to CVIC and SAPS reduces the data that drives resource allocation -- fewer reported incidents translate directly to fewer patrol resources.
- **No business engagement channel.** Local businesses that benefit from community safety have no structured mechanism to connect with residents, support operations through sponsorship, or participate in community events.
- **Technology debt.** The legacy platform (On Alert ASP.NET WebForms CMS) is no longer actively maintained, lacks mobile responsiveness, and provides limited administrative capability.

### The Opportunity

A purpose-built digital platform addresses each of these gaps by providing a centralised, always-available system that unites residents, committee members, volunteers, partner agencies, and local businesses around shared community safety objectives. It transforms the neighbourhood watch from a coordination group into a digitally-enabled community safety network.

---

## 3. Platform Architecture Overview

The platform follows a layered architecture designed for security, performance, and operational simplicity.

### Architectural Layers

| Layer                   | Technology              | Purpose                                                                    |
| ----------------------- | ----------------------- | -------------------------------------------------------------------------- |
| Presentation            | React 19 Server Components, Tailwind CSS, shadcn/ui | Server-rendered pages with progressive client-side enhancement |
| Application framework   | Next.js 15 App Router   | File-based routing, server actions, API routes, middleware                 |
| Authentication          | Clerk                   | Identity management, SSO, MFA readiness, webhook-based user sync           |
| Data access             | Prisma ORM              | Type-safe database queries, schema migrations, referential integrity       |
| Database                | Neon serverless Postgres | Scalable relational storage with branching for staging environments        |
| Deployment              | Vercel Edge Network     | Global CDN, preview deployments, zero-downtime releases                   |

### Access Tiers

The platform defines four access tiers that govern what each visitor can see and do:

1. **Public visitor** -- Unrestricted access to safety information, events calendar, incident feed, zone map, safety tips, documents, and business directory.
2. **Registered member** -- All public content plus incident reporting, event RSVP, member dashboard, digital membership card, business messaging, and account management.
3. **Registered guest** -- Simplified registration with WhatsApp opt-in; read access to member-level content without full membership privileges.
4. **Administrator** -- Full platform management console with role-based permission controls across all operational domains.

---

## 4. Community-Facing Features

### 4.1 Home and Emergency Access

The home page functions as the platform's operational command surface, providing immediate access to critical safety resources.

**Emergency strip.** A persistent, high-contrast banner displays the CVIC crime reporting number (0860 002 669) and SAPS Flying Squad number (10111) with direct click-to-call functionality. The accompanying message -- "Less reported incidents = fewer resources" -- reinforces the reporting imperative.

**Emergency and support cards.** Two prominent cards provide:
- Direct-dial links to CVIC (24-hour crime reporting) and SAPS (10111)
- Banking details for community donations (FNB account 631 463 987 05, branch 255355) with one-click copy functionality and a "Donate now" call to action

**Content feeds.** The home page surfaces live data from the platform's operational systems:
- Up to 3 safety tips with category labels and read-more links
- Up to 6 upcoming community events with date, time, and venue
- Up to 5 recent incidents with type, location, and timestamp
- Sponsor acknowledgements with links to partner websites

### 4.2 Incident Reporting and Tracking

Residents use the incident system to report and review local criminal and suspicious activity.

- **Incident feed.** A filterable, reverse-chronological list of all recorded incidents. Filters include zone and incident type. Each entry shows the incident type, location, and date/time.
- **Incident detail.** Individual incident pages provide full details including type classification, street-level location, and precise date/time.
- **Report form.** Authenticated members can submit new incident reports specifying the incident type, location, and date/time. Reports are attributed to the submitting user and available for administrative review.

### 4.3 Community Events

The events system manages the full lifecycle of community gatherings, meetings, and social events.

- **Event listing.** All events displayed with title, location, and date. Upcoming events (future start date) appear first, sorted chronologically.
- **Event detail.** Full event information including content/description, location, start and end times.
- **RSVP.** Authenticated members can toggle attendance for any event. RSVPs are tracked per user and visible on the member dashboard.

### 4.4 Safety Tips Library

A curated knowledge base of crime prevention advice organised by category.

| Category          | Coverage                                              |
| ----------------- | ----------------------------------------------------- |
| Burglary          | Home security, access control, deterrence             |
| Scams             | Fraud awareness, identity protection                  |
| Vehicle safety    | Car security, parking awareness                       |
| Anti-social behaviour | Neighbour disputes, noise, public order           |
| General           | CVIC vs SAPS reporting guidance, general awareness    |

Each tip has a dedicated detail page with structured markdown content, accessible via a unique URL slug.

### 4.5 Interactive Zone Map

An interactive map divides Plumstead into 7 patrol sections with real-time statistics.

- **Section selection.** Users can select any section on the map to view details.
- **Section statistics.** Each section displays the number of registered streets and approved member count.
- **Street listing.** All streets within a selected section are listed, drawn from the 230+ street database.
- **Registration pathway.** The zone map links into the registration flow, enabling residents to identify their section before signing up.

### 4.6 Document Library

A categorised, searchable repository of community documents available for download.

| Category                     | Content examples                                      |
| ---------------------------- | ----------------------------------------------------- |
| Forms                        | Membership forms, guest registration forms             |
| Policies                     | Operational policies and guidelines                   |
| Newsletter Archive           | Past community newsletters                             |
| Financials                   | Financial statements and reports                       |
| News                         | SAGA media releases, community updates                |
| Debit Order Instruction      | Debit order setup forms                                |
| Ooba Solar                   | Partner documentation                                  |
| Local Business Advertising   | Advertising information and rates                      |

### 4.7 Volunteer Management

A structured recruitment pipeline for four distinct volunteer roles.

| Role              | Description                                                  | Time commitment  |
| ----------------- | ------------------------------------------------------------ | ---------------- |
| Patroller         | Join the 80+ volunteer patrollers. Patrol assigned area, report incidents, support the community. | Flexible         |
| Block Captain     | Liaison for 10-15 houses. Coordinate with neighbours and relay updates. | 2-4 hours/month  |
| Coordinator       | Run a scheme or support multiple groups. Crime prevention, training, community resilience. | 4-8 hours/month  |
| Committee         | Chair, secretary, treasurer, or operations. Organisational leadership. | Variable         |

The volunteer interest form captures name, email, phone, preferred role, zone preference, availability, and a free-text message. All submissions are stored for committee review and follow-up.

### 4.8 Vacation Watch

Registered members who plan to be away from home can request enhanced surveillance of their property.

- **Eligibility.** Available to approved, active members.
- **Registration form.** Captures the member's name, address, contact phone, departure and return dates, emergency contact, and special instructions.
- **Date validation.** The system enforces that the return date falls after the departure date.

### 4.9 Start a Neighbourhood Scheme

A guided pathway for residents in adjacent areas who wish to establish their own neighbourhood watch, presented as a four-step process with an inquiry form.

The inquiry form collects name, email, phone, address, and a free-text message, creating a `SchemeInquiry` record for committee follow-up.

### 4.10 Contact and Emergency Directory

- **Committee directory.** Executive committee members displayed with role, name, phone (click-to-call), and email (click-to-email): Chairperson, Assistant Chairperson, Operations Manager, Secretary, and Treasurer.
- **Emergency contacts.** A comprehensive directory including CVIC (0860 002 669), SAPS Flying Squad (10111), Ambulance (10177), Fire (107), Metro Police Control Room (021 596 1999), Power Failure (086 012 5001), Water (086 010 3054), and Diep River SAPS (021 710 7306/7).
- **Contact form.** A public submission form (name, email, message) that creates a `ContactMessage` record for committee review via the admin console.

### 4.11 About and Organisational Transparency

- **Mission statement.** PNW exists to educate, empower, and activate residents so that Plumstead remains safer and stronger.
- **Operational facts.** Founded 2007, 80+ volunteer patrollers, primary control room CVIC, accredited by DOCS.
- **Partners.** CVIC (incident control coordination), SAPS Diep River (crime prevention and response), DOCS (accreditation and oversight).
- **Executive Committee.** Full committee listing sourced from the database with role, name, phone, and email.

### 4.12 Donations and Funding

- **Banking details.** FNB account details displayed with one-click copy for account number.
- **Funding allocation transparency.** Donations support patrol and response coordination, community surveillance coverage, incident communications and outreach materials, and volunteer training.
- **Sponsor partnerships.** Call to action linking businesses to the sponsorship programme.

### 4.13 Legal and Compliance Pages

Three dedicated legal pages ensure regulatory compliance and user trust:
- **Terms of Use** -- Platform usage terms and conditions
- **Privacy Policy** -- Data protection and privacy practices
- **Disclaimer** -- Legal liability limitations

### 4.14 Help Centre

A structured help system providing user guidance:
- **Member Registration Guide** -- Step-by-step registration walkthrough
- **Glossary** -- A-Z of neighbourhood watch terminology
- **Patrol Administration** -- Patrol zones, types, and operational resources

---

## 5. Membership and Identity

### 5.1 Member Registration

The member registration flow captures comprehensive resident information aligned with neighbourhood watch operational requirements.

**Registration data collected:**

| Field                   | Purpose                                                         |
| ----------------------- | --------------------------------------------------------------- |
| Zone                    | Assigns the member to one of 7 patrol sections                  |
| Street                  | Links the member to one of 230+ streets in the zone database    |
| House number            | Property-level identification within the street                 |
| Privacy toggle          | Controls whether the member is visible to neighbours            |
| Patrol opt-in           | Indicates willingness to participate in community patrols       |
| Secondary contact       | Name, phone, and email for an emergency contact person          |
| WhatsApp opt-in/phone   | Consent and number for WhatsApp communications                  |

After data capture, the flow redirects to Clerk for identity creation (email, password, optional MFA). A webhook synchronises the Clerk identity record with the platform's user database, ensuring a single source of truth.

### 5.2 Guest Registration

A simplified pathway for residents who want community awareness without full membership obligations. Guest registration captures WhatsApp opt-in and phone number, with Clerk handling identity creation.

### 5.3 Digital Membership Card

Approved members receive a digital membership card that can be downloaded for offline use. The card displays the member's name, member number (auto-incremented), zone, and membership status.

### 5.4 Member Dashboard

The authenticated member dashboard provides a personalised operational view:
- **Recent incidents** -- The 5 most recent incidents with type, location, and date
- **Upcoming events** -- The next 5 future events with title, location, and date
- **Your RSVPs** -- Events the member has confirmed attendance for
- **Quick links** -- Account, Settings, Documents, Contact
- **Admin access** -- Direct link to the admin console (visible only to users with the ADMIN role)

### 5.5 Account Management

A dedicated account area with four management sections:
- **Profile** -- Name, email, and avatar management (powered by Clerk)
- **Membership** -- Zone, street, emergency contacts, and digital membership card
- **Settings** -- Application preferences
- **Security** -- Password and authentication settings

---

## 6. Business Networking Hub

The Business Networking Hub connects local businesses with the Plumstead community through a self-service directory, in-app messaging, events, and referral system.

### 6.1 Business Directory

A searchable, filterable directory of approved local businesses.

**Filtering options:**
- **Category** -- Retail, Services, Food and Dining, Health, Other
- **Zone** -- Filter by geographic area within Plumstead
- **Search** -- Free-text search across business names and descriptions

The directory distinguishes between featured listings (curator-selected for hub prominence) and standard listings. All listings require administrative approval before they appear publicly.

### 6.2 Business Listing Submission

Any authenticated user can submit a business listing through a self-service form.

**Submission data:** Business name, description (minimum 20 characters), category, email, and optional fields for address, phone, website URL, and zone.

**Approval workflow:** Submissions enter the system with a `PENDING` status. Platform administrators review each submission and either approve or reject it. Only approved listings appear in the public directory.

### 6.3 Business Listing Detail

Each approved listing has a dedicated detail page displaying:
- Business name, category badge, and zone
- Full description
- Contact information (phone, email, website)
- **Message form** -- Authenticated users can send a direct message to the listing owner
- **Request introduction** -- Facilitated introduction request between the user and the business
- **Refer a friend** -- Share the listing with a contact by providing their name and email

### 6.4 Business Events

Businesses can host events linked to their listing. The business events system mirrors the community events system:
- Event listing with title, description, location, start/end times, and hosting business
- Event detail with RSVP capability for authenticated users
- Upcoming events surfaced on the Business Hub page

### 6.5 In-App Messaging

A dedicated messaging system enables direct communication between residents and businesses:
- Residents send messages from listing detail pages
- Listing owners access their inbox at `/business/messages` to view and manage received messages
- Messages are tracked with read status

### 6.6 Referral System

Authenticated users can refer friends and contacts to businesses:
- Referral form captures the referred person's name, email, and an optional message
- Referrals are attributed to the referring user and linked to the business listing

### 6.7 Introduction Requests

A managed introduction workflow connects residents with businesses:
- Authenticated users submit an introduction request with a message
- Requests follow a status workflow: `PENDING` -> `ACCEPTED` or `DECLINED`

### 6.8 Sponsorship and Advertising

**Sponsorship tiers:**

| Tier       | Placement                                                    |
| ---------- | ------------------------------------------------------------ |
| Premium    | Home page sponsor strip, Business Hub partners section, Sponsors page with logo and link |
| Partner    | Business Hub partners section, Sponsors page with logo and link |
| Supporter  | Sponsors page with name acknowledgement                       |

**Advertising.** Businesses can inquire about website advertising opportunities through a direct email link to the committee (info@plumsteadwatch.org.za).

---

## 7. Platform Administration

This section provides a comprehensive overview of the administrative capabilities available to authorised committee members and platform operators.

### 7.1 Admin Console Overview

The admin console is accessible at `/admin` and is protected by the `requireAdmin()` server-side guard. Only users with the `admin.access` permission or whose email appears in the bootstrap admin list can access the console.

The overview dashboard presents real-time aggregate statistics across all operational domains:

| Metric                | Data source                                  |
| --------------------- | -------------------------------------------- |
| Total users           | All registered users                         |
| Active users          | Users with `isActive = true`                 |
| Total roles           | Defined RBAC roles                           |
| Pending listings      | Business listings with `PENDING` status      |
| Total incidents       | All recorded incidents                       |
| Total events          | All community events                         |
| Total documents       | All uploaded documents                       |
| Contact messages      | All contact form submissions                 |
| Pending members       | Members with `isApproved = false`            |

Each metric card links to the corresponding management section for immediate drill-down.

### 7.2 Administrative Modules

The admin console provides 11 management modules accessible via a persistent sidebar navigation. Modules marked as **Live** are fully operational; modules marked as **Defined** are architecturally scaffolded with navigation, permissions, and data models in place, pending UI build-out.

| Module              | Status   | Permission required  |
| ------------------- | -------- | -------------------- |
| Overview dashboard  | Live     | admin.access         |
| Incidents           | Live     | incidents.manage     |
| Business approvals  | Live     | business.manage      |
| Member approvals    | Live     | members.approve      |
| Contact messages    | Live     | messages.view        |
| Users               | Defined  | users.view / users.manage |
| Roles               | Defined  | roles.manage         |
| Events              | Defined  | events.manage        |
| Documents           | Defined  | documents.manage     |
| Payments            | Defined  | (not yet gated)      |
| Broadcast           | Defined  | broadcast.send       |

#### Overview Dashboard (Live)

Real-time aggregate statistics across all operational domains with direct links to each management section. Displays counts for total users, active users, roles, pending business listings, incidents, events, documents, contact messages, and pending member approvals.

#### Incidents (Live)

View all reported incidents in a tabulated format. Create new incidents, edit existing records, and moderate community-submitted reports.

#### Business Approvals (Live)

Review business listing submissions. Approve or reject pending listings. Toggle the "featured" flag for prominent directory placement.

#### Member Approvals (Live)

Review new member registrations awaiting approval. Approve members to grant full platform access, activate their digital membership card, and include them in zone member counts.

#### Contact Messages (Live)

View and manage all submissions from the public contact form. Each message includes the sender's name, email, and message text.

#### Users (Defined)

View all registered users in the system. Manage individual user accounts including activation/deactivation, role assignment, and profile review. Navigation, permission model, and data layer are in place.

#### Roles (Defined)

Create, edit, and manage custom roles with granular permission assignment. The system ships with 5 pre-defined roles (see Permission Matrix below). Administrators with the `roles.manage` permission can create additional custom roles. Navigation, RBAC schema, and seed data are in place.

#### Events (Defined)

Create, edit, and manage community events including title, location, start/end times, and descriptive content. Navigation, permission model, and data layer are in place.

#### Documents (Defined)

Upload, categorise, and manage downloadable documents across 8 defined categories (Forms, Policies, Newsletter Archive, Financials, News, Debit Order Instruction, Ooba Solar, Local Business Advertising). Navigation, permission model, and data layer are in place.

#### Payments (Defined)

Administer membership payments and donations. The payment system supports two methods -- Paystack (online card payments) and EFT (manual bank transfers). Payment types include Membership, Donation, Event Fee, and Other. Each payment record tracks amount (ZAR), status (Pending, Paid, Failed), payment reference, and verification details. Navigation and data model are in place.

#### Broadcast (Defined)

Send community-wide communications to platform members. The broadcast system supports the `ADMIN_BROADCAST` conversation type, enabling targeted or general announcements. Navigation, conversation model, and permission are in place.

### 7.3 Role-Based Access Control (RBAC)

The platform implements a granular, database-driven RBAC system that separates authentication (who you are) from authorisation (what you can do).

#### Permission Inventory

| Permission Key     | Group            | Description                                          |
| ------------------ | ---------------- | ---------------------------------------------------- |
| admin.access       | Platform         | Access the admin console                             |
| users.view         | User Management  | View all user accounts                               |
| users.manage       | User Management  | Edit user accounts, assign roles                     |
| roles.manage       | Role Management  | Create, edit, and delete roles and permissions        |
| incidents.manage   | Operations       | Create, edit, and moderate incidents                 |
| events.manage      | Operations       | Create, edit, and manage events                      |
| documents.manage   | Content          | Upload, categorise, and manage documents             |
| business.manage    | Business         | Approve, reject, and manage business listings        |
| members.approve    | Membership       | Approve or reject member registrations               |
| messages.view      | Communications   | View contact form submissions                        |
| broadcast.send     | Communications   | Send platform-wide broadcast messages                |

#### Permission Matrix

| Role           | admin.access | users.view | users.manage | roles.manage | incidents.manage | events.manage | documents.manage | business.manage | members.approve | messages.view | broadcast.send |
| -------------- | :----------: | :--------: | :----------: | :----------: | :--------------: | :-----------: | :--------------: | :-------------: | :-------------: | :-----------: | :------------: |
| Member         |              |            |              |              |                  |               |                  |                 |                 |               |                |
| Moderator      | Yes          |            |              |              | Yes              |               |                  |                 |                 | Yes           |                |
| Zone Captain   | Yes          | Yes        |              |              | Yes              |               |                  |                 | Yes             |               |                |
| Admin          | Yes          | Yes        | Yes          |              | Yes              | Yes           | Yes              | Yes             | Yes             | Yes           | Yes            |
| Super Admin    | Yes          | Yes        | Yes          | Yes          | Yes              | Yes           | Yes              | Yes             | Yes             | Yes           | Yes            |

#### Role Descriptions

- **Member** -- Standard community member with no administrative access. Can report incidents, RSVP to events, manage their own account, and use the business directory.
- **Moderator** -- Trusted community volunteer who can access the admin console to manage incidents and view contact messages. Ideal for patrol coordinators who need to log and edit incident reports.
- **Zone Captain** -- Section leader responsible for a defined geographic area. Can approve new member registrations, manage incidents, and view user profiles within their scope. Supports decentralised membership management.
- **Admin** -- Full operational administrator with access to all platform management functions except role definition. Can manage users, events, documents, business listings, payments, messages, and broadcasts.
- **Super Admin** -- Unrestricted access to all platform functions including role and permission management. Reserved for the committee chairperson or designated platform owner.

#### Bootstrap Administration

Initial platform administrators are designated through the `ADMIN_EMAILS` environment variable. Email addresses listed in this variable are automatically assigned the Super Admin role when they authenticate via Clerk, ensuring that at least one administrator can always access the console without requiring database-level intervention.

### 7.4 Approval Workflows

The platform enforces approval gates at two critical points:

**Member approval.** New member registrations require committee review before the member gains full platform access. Pending members appear in the admin console's "Member approvals" section. Until approved, members cannot be counted in zone statistics or access member-only features.

**Business listing approval.** All business listing submissions enter with `PENDING` status. Administrators review each submission for quality and relevance before approving it for public display. Rejected listings can be communicated back to the submitter.

### 7.5 Administrative Data Model

The admin console operates on a comprehensive data model with 25+ interconnected entities:

| Domain               | Entities                                                            |
| -------------------- | ------------------------------------------------------------------- |
| Identity and access  | User, Role, Permission, RolePermission                              |
| Safety operations    | Incident, Zone, Street                                              |
| Community engagement | Event, EventRsvp, CommitteeMember, EmergencyContact                 |
| Content management   | Document, DocumentCategory, SafetyTip, Sponsor                      |
| Business networking  | BusinessListing, BusinessMessage, BusinessEvent, BusinessEventRsvp, BusinessReferral, BusinessIntroRequest |
| Communications       | ContactMessage, Conversation, ConversationParticipant, InboxMessage  |
| Financial            | MembershipPayment                                                   |
| Community programmes | VolunteerInterest, VacationWatch, SchemeInquiry                     |

---

## 8. Data Architecture and Security

### 8.1 Database Design

The platform uses Neon serverless PostgreSQL accessed through Prisma ORM with strict TypeScript type generation. The schema enforces referential integrity through foreign key relationships and composite unique constraints.

**Key design decisions:**
- Auto-incrementing member numbers for human-readable member identification
- Zone-street hierarchy with section assignment for geographic precision
- Composite unique constraints on RSVPs to prevent duplicate attendance records
- Separate business event system (BusinessEvent/BusinessEventRsvp) from community events (Event/EventRsvp) for independent lifecycle management
- Conversation model supporting four types (Direct, System, Business, Admin Broadcast) for flexible messaging

### 8.2 Authentication and Identity Sync

Authentication is managed by Clerk, a dedicated identity platform that provides:
- Email/password authentication
- Multi-factor authentication readiness
- OAuth/SSO integration capability
- Webhook-based sync to the platform database

**Webhook events processed:**
- `user.created` -- Creates a local User record, assigns default role, auto-promotes bootstrap admins
- `user.updated` -- Syncs email, name, and profile changes
- `user.deleted` -- Removes the local User record

### 8.3 Server-Side Security

- **Route protection.** Clerk middleware protects authenticated routes (`/dashboard`, `/admin`, `/api/private/*`).
- **Admin guard.** The `requireAdmin()` function enforces admin-level access by checking the user's permission set and bootstrap admin list. Unauthorised users are redirected.
- **Permission guard.** The `requirePermission()` function enforces granular permission checks on individual admin operations.
- **Input validation.** All form submissions and API inputs are validated against Zod schemas before processing, preventing malformed data from reaching the database.
- **Privacy controls.** Members control their visibility to neighbours through the `hideFromNeighbours` toggle.

### 8.4 Data Privacy and Compliance

- Email preferences are stored as structured JSON, enabling granular communication consent
- WhatsApp opt-in is explicit and separate from registration consent
- Secondary contact information is optional and stored only when provided
- Legal pages (Terms, Privacy, Disclaimer) are accessible from every page via the site footer

---

## 9. Integration and API Layer

### 9.1 REST API

The platform exposes a documented REST API for the business networking features, specified in OpenAPI 3.0 format.

**API endpoints:**

| Method | Endpoint                          | Auth     | Purpose                                    |
| ------ | --------------------------------- | -------- | ------------------------------------------ |
| GET    | /api/business/listings            | Public   | List approved listings with filters         |
| POST   | /api/business/listings            | Required | Submit a new listing                        |
| GET    | /api/business/listings/{id}       | Public   | Retrieve a single listing                   |
| GET    | /api/business/messages            | Required | Retrieve messages for the user's listings   |
| POST   | /api/business/messages            | Required | Send a message to a listing                 |
| GET    | /api/business/events              | Public   | List all business events                    |
| POST   | /api/business/events/{id}/rsvp    | Required | Toggle RSVP for a business event            |
| POST   | /api/business/referrals           | Required | Submit a business referral                  |

### 9.2 Webhook Integration

The Clerk webhook endpoint (`/api/webhooks/clerk`) processes identity lifecycle events to maintain synchronisation between the authentication provider and the platform database. The webhook secret is validated on every request to prevent unauthorised data modification.

### 9.3 Payment Gateway

The payment system is architected to support two processing methods:
- **Paystack** -- Online card payment processing with reference tracking and access code management
- **EFT** -- Manual bank transfer with verification workflow (verified by, verified at)

Payment records track type (Membership, Donation, Event Fee, Other), amount in ZAR, status lifecycle (Pending, Paid, Failed), and audit timestamps.

### 9.4 Future Integration Readiness

The platform schema includes fields for integrations that are ready for activation:
- **WhatsApp** -- User opt-in and phone number fields are captured during registration. Broadcast integration is architecturally supported through the Conversation model's `ADMIN_BROADCAST` type.
- **n8n workflow automation** -- Webhook triggers for events such as new listing submissions, referrals, and member registrations are architecturally supported.

---

## 10. Quality Assurance and Governance

### 10.1 Regression Testing

The platform maintains a formal regression manifest covering 11+ core user flows:

| Flow                     | Verification scope                                                    |
| ------------------------ | --------------------------------------------------------------------- |
| Member registration      | Zone/street selection, Clerk sign-up, user sync, dashboard redirect   |
| Guest registration       | Simplified flow, WhatsApp opt-in, user sync                          |
| Incident reporting       | Form validation, user attribution, incident creation                 |
| Event RSVP               | Toggle add/remove, duplicate prevention                               |
| Contact submission       | Form validation, record creation                                      |
| Volunteer interest       | Form validation, zone linkage, record creation                       |
| Vacation watch           | Date validation, record creation                                      |
| Scheme inquiry           | Form validation, record creation                                      |
| Safety tip browsing      | Category listing, slug-based detail rendering                        |
| Zone map routing         | Section selection, member counts, registration pathway               |
| Admin console            | Access guard, incident management, listing approval, message review   |

### 10.2 Evidence and Audit Trail

The platform maintains an evidence matrix that documents verification of each feature and flow, ensuring that all capabilities described in this document are validated against the running system.

### 10.3 Release Process

A documented release runbook governs deployments:

1. **Pre-release verification.** Lint checks, production builds (Bun and Node), and CI pipeline validation.
2. **Database synchronisation.** Schema generation, migration deployment, and optional reference data seeding.
3. **Staging validation.** Smoke testing across authentication, registration, incident reporting, RSVP, public routes, and all business features.
4. **Production deployment.** Executed during maintenance windows with Vercel deployment.
5. **Rollback procedure.** Documented rollback to the previous stable commit via Vercel, with auth and database connectivity verification.

### 10.4 Build Quality Gates

Every release must pass four automated gates before deployment:
- `bun run lint` -- Static code analysis
- `bun run build:bun` -- Production build via Bun runtime
- `bun run build:node` -- Production build via Node runtime
- `bun run ci:verify` -- Combined verification pipeline

### 10.5 Accessibility

The platform implements accessibility features aligned with WCAG principles:
- Skip-to-main-content link on every page
- Reduced motion support (respects `prefers-reduced-motion` system setting with shortened animations)
- Semantic HTML structure with ARIA labels on navigation regions
- High-contrast emergency alert strip for critical safety information
- Click-to-call links on all phone numbers for mobile accessibility

---

## 11. Community Value and Impact

### Alignment with ISO 37120/37122 Community Indicators

The platform's capabilities align with international standards for sustainable, smart, and resilient communities.

#### Safety and Security (ISO 37120: Safety)

| Capability                        | Community impact                                                                |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Incident reporting and feed       | Increases reported incidents, directly driving SAPS resource allocation          |
| CVIC/SAPS integration             | Provides immediate access to emergency response coordination                   |
| Safety tips library               | Reduces crime opportunity through resident education                           |
| Vacation watch programme          | Extends surveillance to properties of absent members                           |
| Zone map and patrol sections      | Enables geographic coordination of volunteer patrol coverage                   |

#### Community Engagement (ISO 37122: Smart City Indicators)

| Capability                        | Community impact                                                                |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Event management and RSVP         | Increases community participation and social cohesion                          |
| Volunteer recruitment pipeline    | Structures volunteer onboarding across four role types                         |
| Member dashboard                  | Provides personalised situational awareness to each resident                   |
| Digital membership card           | Creates tangible community identity and belonging                              |

#### Economic Development

| Capability                        | Community impact                                                                |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Business directory                | Increases local commerce visibility and resident spending within the community |
| Sponsorship tiers                 | Creates structured revenue channels for community safety operations            |
| Business events                   | Generates networking opportunities between businesses and residents            |
| Referral system                   | Facilitates word-of-mouth growth for local businesses                          |

#### Governance and Transparency

| Capability                        | Community impact                                                                |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Committee directory               | Makes leadership visible and contactable                                       |
| Document library                  | Ensures financial reports, policies, and newsletters are publicly accessible   |
| Role-based administration         | Distributes operational responsibility across trained committee members         |
| Donation transparency             | Banking details and funding allocation are publicly disclosed                  |

#### Resilience (ISO 37123: Resilient Cities)

| Capability                        | Community impact                                                                |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Emergency contact directory       | Centralises access to 8+ emergency and municipal service numbers               |
| Start-a-scheme programme          | Extends the neighbourhood watch model to adjacent communities                  |
| Zone-based coordination           | Enables localised response within broader community coordination               |
| WhatsApp integration readiness    | Prepares for communication via the most widely used messaging platform in SA   |

#### Digital Inclusion

| Capability                        | Community impact                                                                |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Guest registration                | Low-barrier entry point for residents not ready for full membership            |
| Mobile-responsive design          | Full functionality on smartphones, the primary internet device for many SA residents |
| Server-rendered pages             | Fast load times even on slow connections                                       |
| Print stylesheet                  | Documents and pages can be printed for offline distribution                    |

---

## 12. Roadmap and Future Capabilities

### Completed (P1 -- High Priority)

Legacy parity items that have been implemented in the current platform:

- Street selector with zone-street mapping (230+ streets across 7 sections)
- House number capture at registration
- Privacy toggle (hide from neighbours)
- Patrol opt-in during registration
- Secondary contact information capture
- WhatsApp opt-in and phone number fields
- Full business networking hub (directory, messaging, events, referrals)
- RBAC with 5 roles and 11 permissions

### In Progress (P2 -- Medium Priority)

- Interactive zone map with section statistics and street listings
- Help centre with member registration guide, glossary, and patrol administration
- Document category filtering

### Planned (P3 -- Lower Priority)

- Neighbour directory (with privacy controls)
- Community forum for resident discussion
- Community polling system
- Patrol booking and scheduling system

### Future Enhancements

- **WhatsApp broadcast integration** -- Activate broadcast messaging to opted-in members using the existing schema infrastructure
- **Payment processing activation** -- Enable Paystack online payments for membership fees and event registrations
- **Advanced analytics** -- Dashboard reporting on incident trends, membership growth, event participation, and business directory engagement
- **Push notifications** -- Real-time alerts for incident reports and event reminders
- **Multi-zone support** -- Extend the platform to serve additional neighbourhood watch organisations beyond Plumstead

---

## Appendix A: Platform Route Map

| Route                         | Access        | Purpose                                           |
| ----------------------------- | ------------- | ------------------------------------------------- |
| /                             | Public        | Home page with emergency contacts, feeds, sponsors |
| /about                        | Public        | Mission, partners, executive committee             |
| /contact                      | Public        | Contact form, committee directory, emergency contacts |
| /donate                       | Public        | Banking details and funding information            |
| /events                       | Public        | Community events listing                           |
| /events/[id]                  | Public        | Event detail with RSVP (auth required for RSVP)    |
| /incidents                    | Public        | Incident feed with filters                         |
| /incidents/[id]               | Public        | Incident detail                                    |
| /safety-tips                  | Public        | Safety tips by category                            |
| /safety-tips/[slug]           | Public        | Individual safety tip detail                       |
| /find                         | Public        | Interactive zone map                               |
| /documents                    | Public        | Document library with categories                   |
| /volunteer                    | Public        | Volunteer roles and interest form                  |
| /vacation-watch               | Public        | Vacation watch registration                        |
| /start-scheme                 | Public        | Start a neighbourhood scheme guide                 |
| /sponsors                     | Public        | Sponsor listing by tier                            |
| /business                     | Public        | Business networking hub                            |
| /business/[id]                | Public        | Business listing detail                            |
| /business/submit              | Authenticated | Submit a business listing                          |
| /business/events              | Public        | Business events listing                            |
| /business/events/[id]         | Public        | Business event detail with RSVP                    |
| /business/messages            | Authenticated | Listing owner message inbox                        |
| /business/[id]/request-intro  | Authenticated | Request introduction to a business                 |
| /business/referrals           | Authenticated | Business referral form                             |
| /register                     | Public        | Member registration                                |
| /register/guest               | Public        | Guest registration                                 |
| /sign-in                      | Public        | Clerk sign-in                                      |
| /sign-up                      | Public        | Clerk sign-up                                      |
| /dashboard                    | Authenticated | Member dashboard                                   |
| /account                      | Authenticated | Account management hub                             |
| /account/profile              | Authenticated | Profile management                                 |
| /account/membership           | Authenticated | Membership details and card                        |
| /account/settings             | Authenticated | Application settings                               |
| /account/security             | Authenticated | Security settings                                  |
| /help                         | Public        | Help centre index                                  |
| /help/member-registration     | Public        | Registration guide                                 |
| /help/glossary                | Public        | Terminology glossary                               |
| /help/patrol-administration   | Public        | Patrol administration guide                        |
| /terms                        | Public        | Terms of use                                       |
| /privacy                      | Public        | Privacy policy                                     |
| /disclaimer                   | Public        | Legal disclaimer                                   |
| /admin                        | Admin         | Admin console overview                             |
| /admin/incidents              | Admin         | Incident management                                |
| /admin/business               | Admin         | Business listing approvals                         |
| /admin/members                | Admin         | Member registration approvals                      |
| /admin/messages               | Admin         | Contact message management                         |
| /admin/users                  | Admin         | User management (defined, pending UI)              |
| /admin/roles                  | Admin         | Role and permission management (defined, pending UI) |
| /admin/events                 | Admin         | Event management (defined, pending UI)             |
| /admin/documents              | Admin         | Document management (defined, pending UI)          |
| /admin/payments               | Admin         | Payment administration (defined, pending UI)       |
| /admin/broadcast              | Admin         | Community broadcast (defined, pending UI)          |

---

## Appendix B: Seed Data Reference

### Executive Committee

| Role                    | Name                 | Contact                              |
| ----------------------- | -------------------- | ------------------------------------ |
| Chairperson             | Anthea Klugman       | 072 675 9777 / chairperson@mypnw.org.za |
| Assistant Chairperson   | Brenda Besterfield   | 084 589 1702 / assistantchairperson@mypnw.org.za |
| Operations Manager      | Jarryd Munro         | 078 457 2313 / ops.manager@mypnw.org.za |
| Secretary               | Sharon Botes         | 079 469 9885 / secretary@mypnw.org.za |
| Treasurer               | Glynnis Okkers       | 072 470 3136 / treasurer@mypnw.org.za |

### Emergency Contacts

| Service                     | Number           |
| --------------------------- | ---------------- |
| CVIC                        | 0860 002 669     |
| SAPS Flying Squad           | 10111            |
| Ambulance                   | 10177            |
| Fire                        | 107              |
| Metro Police Control Room   | 021 596 1999     |
| Power Failure               | 086 012 5001     |
| Water                       | 086 010 3054     |
| Diep River SAPS             | 021 710 7306/7   |

### Current Sponsors

| Name                    | Tier       | Link                          |
| ----------------------- | ---------- | ----------------------------- |
| ADT Security            | Premium    | https://www.adt.co.za         |
| Combat Force            | Premium    | https://combatforce.co.za     |
| Zone Security Services  | Partner    | --                            |
| Ooba Solar              | Partner    | https://www.ooba.co.za        |
| Tammy Frankland         | Supporter  | --                            |
| Lance Gordon            | Supporter  | --                            |

---

*This document was compiled in accordance with the UNDP/People Powered Digital Participation Platform Guide (2025) for structural governance, ISO 37120/37122/37123 community indicators for impact assessment, and SaaS proposal best practices for capability presentation. All feature descriptions have been verified against the running platform codebase as of March 2026.*
