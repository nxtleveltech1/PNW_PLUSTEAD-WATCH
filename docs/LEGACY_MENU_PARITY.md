# Legacy Menu Parity and Feature Review

**Document Version:** 1.1  
**Date:** 2026-02-28  
**Source:** https://plumsteadwatch.org.za/ (legacy), new Next.js platform  
**Purpose:** Single source-of-truth for legacy menu/navigation structure and feature parity against the new site. Build-specification level detail for implementation decisions.

**Implementation Status (2026-02-28):** Guest nav, Help (member-faq, troubleshooting, security), footer Octox link, and footer Membership column implemented. See [LEGACY_MENU_IMPLEMENTATION.md](LEGACY_MENU_IMPLEMENTATION.md).

---

## 1. Legacy Site Menu Inventory (Complete)

### 1.1 Quick Links Bar (top, every page)

| Label | URL / Type | New Site Equivalent |
|-------|-------------|---------------------|
| Register | register.aspx | /register (Join) |
| Forgot Password | Modal (no URL) | Clerk password reset |
| Login | Modal (no URL) | /sign-in |
| Help | help/index.html | /help |
| Select page | Dropdown (quick nav to any page) | **MISSING** — no global page jump |

### 1.2 Main Navigation

| Label | Legacy URL | New Site |
|-------|------------|----------|
| Home | default.aspx | / |
| Events | events.aspx | /events |
| Register as a member (you live in the area) | register.aspx | /register |
| Register as a guest (you do not live in the area) | guestregister.aspx | /register/guest (implemented) |
| Documents | documentlist.aspx | /documents |
| Contact Us | contact.aspx | /contact |

**Note:** Legacy has a "Membership" parent with two sub-items (member/guest). New site has flat nav with /register only.

### 1.3 Help Section Menu (help/index.html) — Full Hierarchy

**Level 1: Home**

| Item | Legacy URL | New Site |
|------|------------|----------|
| Home | pages/intro.html | /help (intro content) |

**Level 2: Member Help** (submenu)

| Item | Legacy URL | New Site |
|------|------------|----------|
| Member FAQ's | pages/faq.html | /help/member-faq (implemented) |
| Member registration | pages/mreg.html | /help/member-registration |
| Guest registration | pages/greg.html | /register/guest (implemented) |
| Security of Information | pages/security.html | /help/security (implemented) |
| Patrol Bookings | pages/addpatrol.html | **MISSING** (no patrol) |
| Adding an Incident | pages/incidents.html | /incidents (Report) |
| Incidents from Affiliated Organisations | pages/oaincidents.html | **MISSING** |
| Adding a Service Delivery Issue | pages/asd.html | **MISSING** |

**Level 2: Troubleshooting for Users** (submenu)

| Item | Legacy URL | New Site |
|------|------------|----------|
| Is my browser supported? | pages/browsercompatibility.html | /help/troubleshooting (implemented) |
| I'm unable to Login | pages/nologin.html | /help/troubleshooting (implemented) |
| Setting email and other preferences | pages/prefs.html | /account/settings + /help/troubleshooting |
| The website doesn't 'remember me' or I get logged off | pages/remember.html | /help/troubleshooting (implemented) |
| I have selected to patrol but cannot find out how to | pages/patrolissues.html | **MISSING** |
| No patrol zones defined | pages/patrolissues.html | **MISSING** |
| Patrol booking resource allocation | pages/patrolissues.html | **MISSING** |

**Level 2: Administration** (submenu — On Alert CMS–specific)

| Item | Legacy URL | New Site |
|------|------------|----------|
| FAQ's for administrators | pages/adminfaq.html | N/A |
| Known bugs | pages/knownbugs.html | N/A |
| System setup | pages/setup.html | N/A |
| Affiliated organisation management | pages/affiliates.html | N/A |
| Advertising setup | pages/Advertising.html | /admin/business (partial) |
| Causes administration | pages/Causes.html | N/A |
| Contact page administration | pages/Contactpage.html | N/A |
| Custom member fields | pages/cmf.html | N/A |
| Document administration | pages/docadmin.html | /admin/documents |
| Email setup | pages/emails.html | N/A |
| Email management | pages/emaila.html | N/A |
| Event management | pages/eventm.html | /admin/events |
| Incident administration | pages/incidentm.html | /admin/incidents |
| Incident administration - Affiliated Organisations | pages/incidentsoa.html | N/A |
| System Localisation | pages/localisation.html | N/A |
| Lost & Found administration | pages/lf.html | N/A |
| Map administration | pages/mapadmin.html | **MISSING** (no zone map) |
| Member administration | pages/memadmin.html | /admin/members |
| Member group administration | pages/memgroupadmin.html | N/A |
| News article management | pages/newsa.html | N/A |
| Notices administration | pages/noticesa.html | N/A |
| Page editor | pages/pagee.html | N/A |
| Patrol setup | pages/patrola.html | **MISSING** (no patrol) |
| Patrol bookings | pages/patrolb.html | **MISSING** |
| Sending email | pages/sendmail.html | N/A |
| Sending SMS | pages/sendsms.html | N/A |
| Service delivery administration | pages/sdadmin.html | N/A |
| Site functionality | pages/sitef.html | N/A |
| Site layout | pages/layout.html | N/A |
| Social networking links | pages/sociala.html | N/A |
| Street & zone setup | pages/szmanagement.html | **MISSING** |
| Suspicious person and vehicle setup | pages/spvsetup.html | N/A |
| Widget administration | pages/widget.html | **MISSING** |

### 1.4 Footer Links

| Label | Legacy | New Site |
|-------|--------|----------|
| Terms of Use | terms.aspx | /terms |
| Disclaimer | disclaimer.aspx | /disclaimer |
| Privacy Policy | privacy.aspx | /privacy |
| Development Copyright | octoxgroup.com | Footer link to octoxgroup.com (implemented) |
| Contact (Octox) | mailto:info@octoxgroup.com | Via Octox website |
| To advertise on this website | mailto:info@plumsteadwatch.org.za | Advertise link (footer + business) |

---

## 2. New Site Menu Inventory

### 2.1 Header (src/components/layout/header-content.tsx)

- Incidents, Events, Business, Admin (conditional), Account, Find Zone, Safety Tips, Volunteer, About, Contact, Help
- Report (CTA), Sign in, Guest, Join — or UserAvatarDropdown when signed in

### 2.2 User Avatar Dropdown (src/components/user/user-avatar-dropdown.tsx)

- Administration (conditional), Dashboard, Account, Settings, Sign out

### 2.3 Mobile Nav (src/components/layout/mobile-nav.tsx)

- Dashboard, Admin (conditional), Account, Incidents, Events, Business, Find Zone, Safety Tips, Volunteer, About, Documents, Donate, Contact
- Report incident, Sign in, Register guest, Join us

### 2.4 Footer (src/components/layout/footer.tsx)

- **Membership:** Register (member), Register (guest)
- **Operations:** Incidents, Events, Business, Find Zone, Volunteer, Safety Tips, Documents
- **Organisation:** About, Contact, Help, Donate, Sponsors, Advertise
- **Legal:** Terms, Privacy, Disclaimer
- **Bottom bar:** Development Copyright link (Octox)

### 2.5 Account Nav (src/components/account/account-nav.tsx)

- Profile, Membership, Settings, Security, Administration (conditional), Dashboard

### 2.6 Admin Nav (src/app/admin/layout.tsx)

- Overview, Incidents, Events, Documents, Business approvals, Member approvals, Contact messages

### 2.7 Help Page (src/app/help/page.tsx)

- 6 cards: Member registration, Member FAQ, Troubleshooting, Security of information, Patrol administration, Glossary

### 2.8 Business Hub (src/app/business/page.tsx)

- Directory, Events, Sponsors, List Business, Advertise

---

## 3. Side-by-Side Parity Table

| Legacy Item | Legacy URL | New Site | Status |
|-------------|------------|----------|--------|
| **Quick Links** | | | |
| Register | register.aspx | /register | Parity |
| Forgot Password | Modal | Clerk | Parity |
| Login | Modal | /sign-in | Parity |
| Help | help/index.html | /help | Parity |
| Select page | Dropdown | — | Gap |
| **Main Nav** | | | |
| Home | default.aspx | / | Parity |
| Events | events.aspx | /events | Parity |
| Register (member) | register.aspx | /register | Parity |
| Register (guest) | guestregister.aspx | /register/guest | Parity |
| Documents | documentlist.aspx | /documents | Parity |
| Contact Us | contact.aspx | /contact | Parity |
| **Help — Member** | | | |
| Member FAQ's | pages/faq.html | /help/member-faq | Parity |
| Member registration | pages/mreg.html | /help/member-registration | Parity |
| Guest registration | pages/greg.html | /register/guest | Parity |
| Security of Information | pages/security.html | /help/security | Parity |
| Patrol Bookings | pages/addpatrol.html | — | Deprecated |
| Adding an Incident | pages/incidents.html | /incidents | Parity |
| Affiliated incidents | pages/oaincidents.html | — | Deprecated |
| Service delivery | pages/asd.html | — | Deprecated |
| **Help — Troubleshooting** | | | |
| Browser supported | pages/browsercompatibility.html | /help/troubleshooting | Parity |
| Unable to Login | pages/nologin.html | /help/troubleshooting | Parity |
| Email/preferences | pages/prefs.html | /account/settings + /help/troubleshooting | Parity |
| Remember me | pages/remember.html | /help/troubleshooting | Parity |
| Patrol issues (3 items) | pages/patrolissues.html | — | Deprecated |
| **Footer** | | | |
| Terms | terms.aspx | /terms | Parity |
| Disclaimer | disclaimer.aspx | /disclaimer | Parity |
| Privacy | privacy.aspx | /privacy | Parity |
| Development Copyright | octoxgroup.com | Footer link | Parity |
| Advertise | mailto:... | Advertise link | Parity |

---

## 4. Gap List with Status

### 4.1 Implemented (2026-02-28)

| Gap | Status |
|-----|--------|
| Guest registration | Implemented — /register/guest in header, mobile nav, footer |
| Help: Member FAQ | Implemented — /help/member-faq |
| Help: Troubleshooting | Implemented — /help/troubleshooting |
| Security of Information | Implemented — /help/security |
| Development Copyright / Octox | Implemented — footer link to octoxgroup.com |

### 4.2 Deprecate (no action)

| Gap | Reason |
|-----|--------|
| Administration help submenu (25+ items) | On Alert CMS–specific; new platform uses different admin |
| Patrol-related help (4 items) | No patrol feature in new platform |
| Incidents from affiliated organisations | Feature not in scope |
| Service delivery issues | Feature not in scope |

### 4.3 Low priority / optional

| Gap | Recommendation |
|-----|----------------|
| Select page dropdown | Optional quick-nav (e.g. command palette Cmd+K); deferred |

### 4.4 N/A (platform difference)

| Gap | Notes |
|-----|-------|
| Map administration | Zone map not implemented |
| Street & zone setup | Different data model |
| Widget administration | No homepage widgets |

---

## 5. Parity Summary

| Category | Legacy Items | New Has | Gap Count |
|----------|--------------|---------|-----------|
| Quick Links | 5 | 4 | 1 (Select page — deferred) |
| Main Nav | 6 | 6 | 0 |
| Help (Member) | 8 | 4 | 2 deprecated |
| Help (Troubleshooting) | 7 | 4 | 3 deprecated |
| Help (Admin) | 31 | 0 | N/A — platform different |
| Footer | 6 | 6 | 0 |

### 5.1 New-Only Features (No Legacy Equivalent)

- Find Zone, Safety Tips, Volunteer, Donate, Sponsors, Business directory
- Vacation watch, Start scheme
- Dashboard, Account (Profile/Membership/Settings/Security)
- Admin: Business approvals, Member approvals, Contact messages

---

## 6. Recommended Next Steps

1. **Select page:** Optional; consider command palette (Cmd+K) if desired.
2. **Help content:** Refine FAQ, troubleshooting, and security content based on user feedback.

---

*Plan → Build → Verify → Document. Re-plan on drift.*
