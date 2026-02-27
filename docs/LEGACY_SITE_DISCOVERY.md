# PNW Legacy Site Discovery and Design Overview

**Document Version:** 2.0  
**Date:** 2026-02-27  
**Source:** https://plumsteadwatch.org.za/  
**Purpose:** Single source-of-truth for legacy capabilities to ensure parity or explicit deprecation in the new Next.js platform. Build-specification level detail for implementation.

---

## 1. Legacy Platform Summary

| Attribute | Value |
|-----------|-------|
| **Platform** | On Alert (Octox Group) — ASP.NET WebForms CMS |
| **Base URL** | https://plumsteadwatch.org.za/ |
| **Auth** | Username/password with "Remember me" |
| **Captcha** | Required on login and registration |
| **Forgot Password** | Link in header |
| **Visit Counter** | "Number of visits since 20th July 2007" in footer |

---

## 2. Full Page Inventory

### 2.1 Public Pages (No Login Required)

| Old URL | Page | Content Summary |
|---------|------|-----------------|
| `default.aspx` | Home | Hero ("Be the eyes and ears of the area"), banking details (FNB 631 463 987 05, Code 255355), CVIC 0860002669, SAPS 10111, recent incidents teaser (5), events teaser (6), documents teaser, sponsors, advertising contact |
| `events.aspx` | Events | Calendar with "Go To" controls; past and forthcoming events; `?aid=` for event detail |
| `register.aspx` | Member Registration | Resident sign-up; see [Section 3.1](#31-member-registration-form-fields) |
| `guestregister.aspx` | Guest Registration | Non-resident sign-up; see [Section 3.2](#32-guest-registration-form-fields) |
| `documentlist.aspx` | Documents | Category dropdown; documents by category; "Display Items per Page" control |
| `contact.aspx` | Contact | Committee tables, emergency contacts, interactive zone map; see [Section 4](#4-contact-page-structure) |
| `terms.aspx` | Terms of Use | Legal terms and conditions |
| `disclaimer.aspx` | Disclaimer | Legal disclaimer (no warranties, liability limits) |
| `privacy.aspx` | Privacy Policy | Data collection, cookies, profile link, contact |
| `help/index.html` | Help | Menu; links to memreg, patrola, glossary |
| `help/pages/memreg.html` | Member Registration Help | Registration process, field descriptions |
| `help/pages/patrola.html` | Patrol Administration Help | Patrol zones, types, resources, roster emails |
| `help/pages/glossary.html` | Glossary | Terms A–Z; see [Section 5](#5-glossary-and-business-rules) |

### 2.2 Auth-Gated Pages (Login Required)

| Old URL | Page | Content Summary |
|---------|------|-----------------|
| `incidentlist.aspx` | Incidents | Full list; returns **403 Forbidden** when not logged in |
| `incidentlist.aspx?aid=X` | Incident Detail | Single incident |
| `profile.aspx` | My Profile | Account info, email preferences, privacy settings; linked from privacy policy |

### 2.3 Document Download Pattern

```
httphandlers/document.ashx?name=<filename>&catid=<id>
```

Example: `httphandlers/document.ashx?name=SAGA_Release_26_January_2026.pdf&catid=12`

---

## 3. Form Field Specifications

### 3.1 Member Registration Form Fields

| Field | Type | Required | Validation / Notes |
|-------|------|----------|-------------------|
| Username | Text | Yes | 6–20 chars, unique; not editable after creation |
| Password | Password | Yes | 6–20 chars |
| Confirm Password | Password | Yes | Must match Password |
| First Name(s) | Text | Yes | Min 1 char |
| Last Name | Text | Yes | Min 2 chars |
| Image | File | No | Optional |
| House Number or Name | Text | Yes | |
| Street | Select | Yes | Dropdown of 200+ streets; if street not listed, contact membership admin |
| Home Telephone | Text | No | |
| Cellphone | Text | No | Strongly advised for emergency contact |
| Email | Email | No | Strongly advised |
| Additional Contact Name | Text | No | Emergency contact; not used for org communications |
| Additional Contact Number | Text | No | |
| Additional Contact Email | Text | No | |
| Do you wish to hide your details from other members in your street? | Yes/No | No | Privacy toggle |
| Do you wish to patrol? | Yes/No | No | "Read first to enable selection below" |
| Do you wish to receive certain email from us? | Yes/No | No | If No, no email regardless of other options |
| Receive News Items? | Yes/No | No | |
| Receive Events? | Yes/No | No | |
| Receive Incidents in your zone? | Yes/No | No | |
| Receive Incidents from other zones? | Yes/No | No | Disabled if only one zone |
| Receive incident notifications from watches affiliated to PNW? | Yes/No | No | |
| Receive Ad-hoc Email? | Yes/No | No | |
| Frequency (per category) | Select | No | Immediately \| Weekly \| Monthly |
| Captcha | Image input | Yes | Enter number from image |

**Constitution:** By registering, user accepts Constitution and Code of Conduct. Contact membership administrator if no response within a week.

### 3.2 Guest Registration Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Username | Text | Yes | 6–20 chars |
| Password | Password | Yes | |
| Confirm Password | Password | Yes | |
| First Name(s) | Text | Yes | |
| Last Name | Text | Yes | |
| Telephone | Text | Yes | |
| Cellphone | Text | Yes | |
| Email | Email | Yes | |
| Do you wish to receive certain email from us? | Yes/No | No | |
| Receive News Items? | Yes/No | No | |
| Receive Events? | Yes/No | No | |
| Receive Incidents? | Yes/No | No | |
| Receive Incidents from other zones? | Yes/No | No | |
| Receive incident notifications from watches affiliated to PNW? | Yes/No | No | |
| Receive Ad-hoc Email? | Yes/No | No | |
| Frequency (per category) | Select | No | Immediately \| Weekly \| Monthly |
| Captcha | Image input | Yes | |

### 3.3 Street List (Member Registration)

Streets are selected from a dropdown. Partial list from discovery (200+ total):

ADELAIDE RD, ADELE STREET, AINSLIE RD, ALNWICK RD, ANNANDALE RD, ASHBURY RD, ATHERSTONE RD, ATHLONE RD, ATTLEE RD, AVONDALE TERRACE, AZALEA STR, BALMORAL RD, BARDIA RD, BARNETT RD, BASIL RD (17-100, 1-16), BIRKENHEAD RD, BIRMINGHAM RD, BLACKWOOD RD, BLENHEIM RD, BOUNDARY RD, BRAEFIELD RD, BRAMLEY RD, BRAMPTON RD, BRENDA RD, BRENT RD, BROXBURN RD, BUCKINGHAM RD, BURNHAM RD, CANNON RD, CARNARVON RD, CASSINO RD, CASTLE TOWN RD, CECIL RD, CHECKERS CENTRE and SERVICE RD, CHERBOURG AVE, CHUDLEIGH RD (1-49, 50-124, 125-160), CHURCHILL RD (1-39, 40-70, 89-200), CONSTANTIA CLOSE, CONSTANTIA RD, COOMBE RD, CORONATION AVE, COURT TOWN RD, CRANMERE RD, CULM RD, DALEGARTH RD, DALZIEL RD, DAN PIENAAR CIRCLE, DAWLISH RD, DE WAAL ROAD, DELANEY RD, DENBIGH RD, DENNISTON CL, DESSIE RD, DIANA RD, DICK BURTON RD, DOORDRIFT RD, DRAGOON RD, DU MIDI AVE, EDGEWARE CL, EDGEWORTH RD, EDGWARE CLOSE, EDGWARE ROAD, EL ALAMEIN CLOSE, ELVA RD, ENCHOR RD, EVREMONDE RD, EXETER RD, EXMOUTH RD, FAIRDALE RD, FAIRMEAD RD, FANSHAWE RD, FERGUSON STR, FIRFIELD RD, FIRTREE STREET, FRANCIS RD, FREDAS LANE, GABRIEL CLOSE, GABRIEL RD, GARDEN STR, GRAY RD, GREEN VALLEY CLOSE, GROSVENOR RD, HAMILTON RD, HANCOCK RD, HANLEY ST, HARRIES STR, HEMYOCK RD, HENSHAWE RD, HOLMDENE RD, HONITON RD, HOOLE CLOSE, HUMBERSTONE RD, IAN TAYLOR RD, IRMAS LANE, JAN SMUTS ST, JANNI RD, KENDAL RD, KENNETH RD, KESTEL RD, KIRKWOOD RD, KLAAPROOS RD, KNUTSFORD RD, LAWRENCE RD, LEDORE RD, LEONARD ST, LIBERTY ST, LIDFORD RD, LYMPLEIGH RD, MAIDSTONE RD, MAIN RD, MARKET RD, MASSINGER RD, MEADOW WAY, MEDWAY RD, MELVILLE RD, MENSEY RD, MEYER ST, MEYRICK AVE, MILE END RD, MILFORD RD, MIMOSA STR, MONTLEY RD, MORPETH RD, MORTON RD, MYBURGH RD, MYNDERD ST, NAPIER RD, NARUNA RD, NERANDA RD, NICE RD, NICHOLAS CL, NICHOLETTE STREET, NORMANDY AVE, NORMANDY CRESCENT, OLD KENDAL CLOSE, OLD KENDAL ROAD, OPHIR RD, ORLEANS AVE, PALATINE RD, PARK RD, PAUL KRUGER ST, PENHURST RD, PINEHILL AVE, PINELAW RD, PITT STR, PLUTO RD, PLYMPTON RD, PORTSWOOD RD, PRINCE AVE, PRINCE GEORGE DR, PRINCESSVLEI ROAD, RAMBLER ROAD, RIVERS END RD, RONELL CRESCENT, RONELL STR, RORKE RD, ROTHERFIELD RD, ROUEN AVE, RUCHILL RD, RULE STREET, SAWLE RD, SCHAAY RD, SEATON ST, SELBY RD, SESSEL RD, SEVENOAKS RD, SEVERN RD, SIDBURY RD, SILVERTON RD, SKEW ST, SMITH RD, SOUTH RD, SOUTHFIELD RD, SOVEREIGN RD, ST CATHERINES RD, ST CLAIR RD, ST JOSEPHS RD, ST MARYS RD, STAINES RD, STELLA RD, STIRLING RD, STUDENTS WAY, STUDLEY RD, SURING STR, SWAN CL, TALENT ST, THIRLMERE RD, THORNBURY RD, THORNWICK RD, THYME RD, TIMOUR HALL RD, TIVERTON RD, TOBRUK RD, TOPSHAM RD, TOTNES RD, TOULON AVE, TRAMORE RD, TRENT RD, TRENTHAM RD, TWINE RD, TYNEMOUTH RD, VAN VUUREN RD, VERNON RD, VICTORIA RD, VILLAGE GREEN CLOSE, VIOOLTJIE STREET, WALSALL RD, WATERBURY RD, WATERFORD CLOSE, WATERFORD RD, WELKOM RD, WEMBLEY AVE, WEPENER RD, WHITBY RD, WHITE STR, WICKLOW RD, WINDSOR RD, WOODGATE RD, WOODLEY RD, YELLOWWOOD CRESCENT, YUDELMANS LANE, YVONNE RD

---

## 4. Contact Page Structure

### 4.1 Committee Tables

**Executive Committee**

| Role | Name | Contact |
|------|------|---------|
| Chairperson | Anthea Klugman | 072 675 9777, chairperson@mypnw.org.za |
| Assistant Chairperson | Brenda Besterfield | 084 589 1702, assistantchairperson@mypnw.org.za |
| Operations Manager | Jarryd Munro | 078 457 2313, ops.manager@mypnw.org.za |
| Secretary | Sharon Botes | 079 469 9885, secretary@mypnw.org.za |
| Treasurer | Glynnis Okkers | 072 470 3136, treasurer@mypnw.org.za |
| Assistant Ops Manager | Clive Besterfield | 082 355 2953, getitdonecjb@gmail.com |
| Public Relations Officer | Catherine Harland | 082 323 4046, events.funding@mypnw.org.za |

**Management Committee**

| Role | Name | Contact |
|------|------|---------|
| Response Team | Justin De Vos | 0843063566, responseteam@mypnw.org.za |
| Social Media Manager | Maxine Leibowitz | 072 312 4479, socialmedia@mypnw.org.za |
| Community Liaison Officer | Peter Ruthenberg, Sabine Kerrison | 082 828 8884, 063 693 3671 |

**Camera Project**

| Role | Name | Contact |
|------|------|---------|
| Assistant Project Managers | Ian Ziller | 082 979 6520 |
| Assistant Project Manager | Shaun Johnson | 072 214 6715 |
| Project Manager | Craig Stolly | 082 5377 4616 |

**PNW Contact Details**

- CVIC: 0860 002 669
- Members Admin (WhatsApp ONLY): Karen Kent 079 932 6209

### 4.2 Emergency Contact Numbers

| Service | Number |
|---------|--------|
| SAPS Flying Squad | 10111 |
| Ambulance | 10177 |
| Fire | 107 |
| Metro Police Control Room | 021 596 1999 |
| Power Failure | 086 012 5001 |
| Water | 086 010 3054 |
| Diep River SAPS | 021 710 7306/7 |
| Constantiaberg Medi-Clinic | 021 799 2911 |
| Red Cross Childrens Hospital | 021 658 5111 |
| Poison Information Helpline | 0861 55 5777 |
| Wynberg Fire Station | 021 797 6108 |
| Plumstead Animal Hospital | 021 797 1998 |
| Plumstead Animal Hospital (After Hours) | 082 321 3135 |
| Kenilworth Veterinary Hospital | 021 671 5018 |
| S.P.C.A. Animal Centre | 021 700 4140 |
| SPCA Emergency After Hours | 083 326 1604 |

### 4.3 Zone Map

- Interactive map with zone selector dropdown
- Zones: SECTION 1 through SECTION 7
- Polygon boundary data (lat/lng coordinates) for each zone
- Map allows users to find their street and zone

---

## 5. Glossary and Business Rules

### 5.1 Glossary Terms (from help/pages/glossary.html)

| Term | Definition |
|------|------------|
| **Ad-hoc email** | Email sent by authorised person that is not incident, news item, or event |
| **Administrator** | Person with access to setup functionality |
| **Area Map** | Map on contacts page where user finds street and zone |
| **Author** | Person who may add and edit content; many types managing different content |
| **Documents** | Electronic files in document section |
| **Events** | Notices of happenings of interest in the area |
| **Forum** | Area where registered users add views and reply to posts |
| **Guest** | Non-resident who wishes to be kept informed; registered on website |
| **Home Page Widget** | Items beneath menu; present info from elsewhere; can be positioned or turned off |
| **Incident** | Criminal or committee-deemed undesirable act on person or property |
| **Incident Report** | Notice of incident on website |
| **Member** | Resident in area who has registered |
| **Neighbour(s)** | Persons in same street as defined by registration address |
| **News Items** | Information committee wishes to share |
| **Patrol** | Resident travelling area to identify and report suspicious activity |
| **Patroller** | Eyes and ears resource only |
| **Patrol Manager** | Manages patrollers in area on website |
| **Patrol Administrator** | Manages patrollers in any area |
| **Periodic Communication** | Weekly or monthly email based on profile settings |
| **Profile** | Determines interaction via roles and preferences |

| Term | Definition |
|------|------------|
| **Poll** | Question with possible answers; committee seeks opinion/vote |
| **Secondary Contact** | Person neighbours or org may contact in emergency if cannot reach you |
| **Street Coordinator** | Org representative in street; assists members; passes communications |
| **Zone** | Logical grouping of streets (~250–300 houses) for administration |
| **Zone Coordinator** | Org representative in zone; assists street coordinators; often committee |

### 5.2 Business Rules

- **Member:** Resident in area; registered on site
- **Guest:** Non-resident; receives updates
- **Zone:** Logical grouping of streets; ideally 250–300 houses
- **Neighbour:** Same street as defined by registration address
- **Patroller:** Eyes and ears only; travels area to report suspicious activity
- **Roles:** Administrator, Author, Coordinator — determine content and access
- **Incident:** Criminal or committee-deemed undesirable act
- **Email:** Periodic (weekly/monthly) or immediate based on profile

---

## 6. Document Categories and Download Behaviour

### 6.1 Categories (Old Site)

| Category | Purpose |
|----------|---------|
| Advice and Tips | Crime prevention, safety tips |
| Annual General Meeting | AGM documents |
| Application Forms | Membership, other forms |
| Camera Project | PNW camera project docs |
| Constitution & COC | Constitution and Code of Conduct |
| Debit Order Instruction | Payment instructions |
| Financials | Financial reports |
| General Documents | Miscellaneous |
| Local Business Advertising | Business advertising info |
| Ooba Solar | Partner content |
| PNW Maps | Zone maps |

### 6.2 Download Behaviour

- Documents served via `httphandlers/document.ashx?name=<filename>&catid=<id>`
- Category dropdown filters displayed documents
- "Display Items per Page" control (configurable pagination)

---

## 7. Patrol Administration (from help/pages/patrola.html)

**Note:** Patrol zone is separate from member zone. A patrol zone may comprise one or more member zones.

### 7.1 Patrol Zone Setup

- Add Patrol Zone button
- **Is Special:** Special zones for specific operations (e.g. SAPS traffic control); time-limited
- **Allow Bookings From Date:** When bookings can be made
- **Runs From Date / Runs To Date:** When zone is active

### 7.2 Patrol Types

- In Use: Whether type can be used when booking
- Designation: 1–3 letter abbreviation for roster
- Description, Name
- ID (read-only)

### 7.3 Patrol Resources

- In Use: Whether resource is available for booking
- Name, Description (e.g. "Radio for patrol zone 1")

### 7.4 Email & Documentation

- Patrol roster email preferences
- Documentation category IDs: Radio/call sign, Suspicious persons, Suspicious vehicles, General patrol
- Send email reminder 24hrs before patrol?
- Send booking info when booking added/removed?

---

## 8. Gap Analysis (Old vs New)

### 8.1 Registration

| Capability | Old | New | Gap |
|------------|-----|-----|-----|
| Street selector | 200+ streets | Zone only | Street-level detail missing |
| House number/name | Required | — | Not in schema |
| Privacy (hide from neighbours) | Yes/No | — | Not implemented |
| Patrolling opt-in | Yes/No | — | Not implemented |
| Email prefs (per-category + frequency) | Full | Basic JSON | Richer structure needed |
| Secondary contact | Name, phone, email | — | Not in schema |
| Captcha | Required | Clerk | Clerk handles |

### 8.2 Incidents

| Capability | Old | New | Gap |
|------------|-----|-----|-----|
| List/detail visibility | Auth-gated | Public | New is more open |
| Report incident | Members | Members | Parity |

### 8.3 Contact

| Capability | Old | New | Gap |
|------------|-----|-----|-----|
| Committee | 3 tables | CommitteeMember | Structure similar |
| Emergency | Full list | EmergencyContact | Parity |
| Zone map | Interactive, Sections 1–7 | — | Not present |

### 8.4 Features in Old Only

| Feature | Status in New |
|---------|---------------|
| Forum | Not implemented |
| Poll | Not implemented |
| Neighbour contact directory | Not implemented |
| Patrol administration | Not implemented |
| Interactive zone map | Not implemented |
| Help section | Not implemented |
| Visit counter | Not implemented |
| Forgot password | Clerk provides |

### 8.5 Features in New Only

| Feature |
|---------|
| Safety tips library |
| Volunteer recruitment |
| Vacation watch |
| Start scheme inquiry |
| Find zone (postcode) |
| Business directory |
| Admin console |
| Donate page |
| Sponsors page |
| About page |
| Clerk auth |

---

## 9. Parity Checklist with Priorities

### P1 — High Priority (Core Membership Parity)

| # | Capability | Effort | Action |
|---|------------|--------|--------|
| 1 | Street selector or zone-street mapping | Medium | Add Street model; link to Zone; use in registration |
| 2 | Richer email preferences | Low | Extend `emailPrefs` JSON: per-category + frequency (Immediately/Weekly/Monthly) |
| 3 | Privacy toggle (hide from neighbours) | Low | Add `hideFromNeighbours` to User |
| 4 | Patrolling opt-in | Low | Add `patrolOptIn` to User |
| 5 | House number/name | Low | Add `houseNumber` to User |
| 6 | Secondary contact | Low | Add `secondaryContactName`, `secondaryContactPhone`, `secondaryContactEmail` to User |

### P2 — Medium Priority (UX Parity)

| # | Capability | Effort | Action |
|---|------------|--------|--------|
| 7 | Interactive zone map on Contact | Medium | Add map to /contact; reuse polygon data from old site |
| 8 | Help section | Low | Add /help with memreg, glossary content (static or MD) |
| 9 | Document category filter | Low | Add dropdown filter to /documents |
| 10 | Forgot password | N/A | Clerk provides; ensure link visible |

### P3 — Lower Priority (Future)

| # | Capability | Effort | Action |
|---|------------|--------|--------|
| 11 | Neighbour directory | High | New page; same-street contacts; privacy-aware |
| 12 | Forum | High | New feature; new models |
| 13 | Poll | Medium | New feature; new models |
| 14 | Patrol booking/administration | High | Complex; consider external tool |
| 15 | Visit counter | Low | Optional |

---

## 10. URL Mapping (Old to New)

| Old URL | New Route |
|---------|-----------|
| default.aspx | / |
| events.aspx | /events |
| events.aspx?aid=X | /events/[id] |
| register.aspx | /register |
| guestregister.aspx | /register/guest |
| documentlist.aspx | /documents |
| contact.aspx | /contact |
| incidentlist.aspx | /incidents |
| incidentlist.aspx?aid=X | /incidents/[id] |
| profile.aspx | /user-profile |
| terms.aspx | /terms |
| disclaimer.aspx | /disclaimer |
| privacy.aspx | /privacy |
| help/ | (add /help) |

---

## 11. Data Model Additions (Summary)

To support legacy parity:

```prisma
// Optional additions to User
model User {
  // ... existing
  houseNumber     String?
  streetId        String?
  street          Street?    @relation(...)
  hideFromNeighbours Boolean @default(false)
  patrolOptIn     Boolean   @default(false)
  secondaryContactName  String?
  secondaryContactPhone String?
  secondaryContactEmail String?
  emailPrefs      Json?    // Richer: { news: { enabled, frequency }, events: {...}, ... }
}

model Street {
  id          String @id @default(cuid())
  name        String
  zoneId      String
  zone        Zone   @relation(...)
  members     User[]
}
```

---

## Appendix A: Quick Links and Navigation — Complete URL Map

### A.1 Quick Links Bar (top, every page)

| Label | URL | Type |
|-------|-----|------|
| Register | https://plumsteadwatch.org.za/register.aspx | Direct link |
| Forgot Password | (no direct URL — link in header; opens modal/dialog on current page) | Modal |
| Login | (no direct URL — modal/dialog; Username, Password, Remember me, Captcha) | Modal |
| Help | https://plumsteadwatch.org.za/help/index.html | Direct link |

### A.2 Main Navigation

| Label | Full URL |
|-------|----------|
| Home | https://plumsteadwatch.org.za/default.aspx |
| Events | https://plumsteadwatch.org.za/events.aspx |
| Register as a member (you live in the area) | https://plumsteadwatch.org.za/register.aspx |
| Register as a guest (you do not live in the area) | https://plumsteadwatch.org.za/guestregister.aspx |
| Documents | https://plumsteadwatch.org.za/documentlist.aspx |
| Contact Us | https://plumsteadwatch.org.za/contact.aspx |

### A.3 Footer Links

| Label | URL |
|-------|-----|
| Terms of Use | https://plumsteadwatch.org.za/terms.aspx |
| Disclaimer | https://plumsteadwatch.org.za/disclaimer.aspx |
| Privacy Policy | https://plumsteadwatch.org.za/privacy.aspx |
| Development Copyright | http://www.octoxgroup.com/ |
| Contact (Octox) | mailto:info@octoxgroup.com |
| To advertise on this website | mailto:info@plumsteadwatch.org.za?subject=Website%20advertising |

---

## Appendix B: Homepage Widget Links

### B.1 Recent Incidents (homepage teaser)

| Type | Location | aid | Full URL |
|------|----------|-----|----------|
| Theft out/from M/Vehicle | WICKLOW RD | 20175 | https://plumsteadwatch.org.za/incidentlist.aspx?aid=20175 |
| Theft out/from M/Vehicle | GABRIEL RD | 20176 | https://plumsteadwatch.org.za/incidentlist.aspx?aid=20176 |
| Burglary Business | BARDIA RD | 20177 | https://plumsteadwatch.org.za/incidentlist.aspx?aid=20177 |
| Theft Cables | SOUTHFIELD RD 16-160 (ODD) | 20173 | https://plumsteadwatch.org.za/incidentlist.aspx?aid=20173 |
| Theft Common | MAIN RD 1-174 | 20174 | https://plumsteadwatch.org.za/incidentlist.aspx?aid=20174 |

**URL pattern:** `incidentlist.aspx?aid={incidentId}` — auth required (403 if not logged in).

### B.2 Events (homepage teaser)

| Title | Location | aid | Full URL |
|-------|----------|-----|----------|
| Bingo | Second Plumstead Sea Scout Group Melville Road | 4368 | https://plumsteadwatch.org.za/events.aspx?aid=4368 |
| Raffle on line | Other - See content | 4369 | https://plumsteadwatch.org.za/events.aspx?aid=4369 |
| Quiz Night | South Peninsula High School | 4370 | https://plumsteadwatch.org.za/events.aspx?aid=4370 |
| PNW ANNUAL GENERAL MEETING | Plumstead Bowling Club | 4374 | https://plumsteadwatch.org.za/events.aspx?aid=4374 |
| Bingo Night | South Peninsula High School | 4371 | https://plumsteadwatch.org.za/events.aspx?aid=4371 |
| Jamboree | Cape Town Cricket Club | 4372 | https://plumsteadwatch.org.za/events.aspx?aid=4372 |

**URL pattern:** `events.aspx?aid={eventId}`

### B.3 Documents (homepage teaser)

| Document Name | name param | catid | Full URL |
|---------------|------------|-------|----------|
| SAGA Media Release Jan 2026 | SAGA_Release_26_January_2026.pdf | 12 | https://plumsteadwatch.org.za/httphandlers/document.ashx?name=SAGA_Release_26_January_2026.pdf&catid=12 |
| Financials Year End March 2025 | March_2025.pdf | 7 | https://plumsteadwatch.org.za/httphandlers/document.ashx?name=March_2025.pdf&catid=7 |
| Ooba Solar how to save 25% on your Electricity | Ooba_flyer_with_QR_link_Copy.pdf | 1036 | https://plumsteadwatch.org.za/httphandlers/document.ashx?name=Ooba_flyer_with_QR_link_Copy.pdf&catid=1036 |
| Debit Order Form | Netcash_EFT_Mandate___Plumstead_Neighbourhood_Watch.pdf | 1035 | https://plumsteadwatch.org.za/httphandlers/document.ashx?name=Netcash_EFT_Mandate___Plumstead_Neighbourhood_Watch.pdf&catid=1035 |

---

## Appendix C: Document Download API

### C.1 Endpoint

```
GET https://plumsteadwatch.org.za/httphandlers/document.ashx
```

### C.2 Query Parameters

| Param | Required | Description |
|-------|----------|-------------|
| name | Yes | Filename (e.g. SAGA_Release_26_January_2026.pdf) |
| catid | Yes | Document category ID (integer) |

### C.3 Known Category IDs (from homepage/docs)

| catid | Category |
|-------|----------|
| 7 | Financials |
| 12 | (SAGA / News — TBD exact category name) |
| 1035 | Debit Order Instruction |
| 1036 | Ooba Solar |

### C.4 Document Categories (documentlist.aspx dropdown order)

1. Advice and Tips
2. Annual General Meeting
3. Application Forms
4. Camera Project
5. Constitution & COC
6. Debit Order Instruction (catid 1035)
7. Financials (catid 7)
8. General Documents
9. Local Business Advertising
10. Ooba Solar (catid 1036)
11. PNW Maps

---

## Appendix D: Street List — Canonical

Complete list of streets from member registration dropdown (exact display strings). Total: 200+ entries.

```
ADELAIDE RD
ADELE STREET
AINSLIE RD
ALNWICK RD
ANNANDALE RD
ASHBURY RD
ATHERSTONE RD
ATHLONE RD
ATTLEE RD
AVONDALE TERRACE
AZALEA STR
BALMORAL RD
BARDIA RD
BARNETT RD
BASIL RD - 17-100
BASIL RD 1-16
BIRKENHEAD RD
BIRMINGHAM RD
BLACKWOOD RD
BLENHEIM RD
BOUNDARY RD
BRAEFIELD RD
BRAMLEY RD
BRAMPTON RD
BRENDA RD
BRENT RD
BROXBURN RD
BUCKINGHAM RD
BURNHAM RD
CANNON RD
CARNARVON RD
CASSINO RD
CASTLE TOWN RD
CECIL RD
CHECKERS CENTRE and SERVICE RD
CHERBOURG AVE
CHUDLEIGH RD 1-49
CHUDLEIGH RD 50-124
CHUDLEIGH RD 125-160
CHURCHILL RD 1-39
CHURCHILL RD 40-70
CHURCHILL RD 89-200
CONSTANTIA CLOSE
CONSTANTIA RD
COOMBE RD
CORONATION AVE
COURT TOWN RD
CRANMERE RD
CULM RD
DALEGARTH RD
DALZIEL RD
DAN PIENAAR CIRCLE
DAWLISH RD
DE WAAL ROAD - Main Rd to Cape Flats Line
DELANEY RD
DENBIGH RD
DENNISTON CL
DESSIE RD
DIANA RD
DICK BURTON 15 - 100 (EVEN)
DICK BURTON RD 1-14
DICK BURTON RD 15-100 (ODD)
DOORDRIFT RD
DRAGOON RD 1-4
DRAGOON RD 5-60
DU MIDI AVE
EDGEWARE CL
EDGEWARE CLOSE
EDGWARE ROAD
EDGEWORTH RD
EL ALAMEIN CLOSE
ELVA RD
ENCHOR RD
EVREMONDE RD 1-40
EVREMONDE RD 41-90
EVREMONDE RD 91-180
EXETER RD
EXMOUTH RD
FAIRDALE RD
FAIRMEAD RD
FANSHAWE RD
FERGUSON STR
FIRFIELD RD
FIRTREE STREET
FRANCIS RD
FREDAS LANE
GABRIEL CLOSE
GABRIEL RD
GARDEN STR
GRAY RD
GREEN VALLEY CLOSE
GROSVENOR RD
HAMILTON RD
HANCOCK RD
HANLEY ST
HARRIES STR
HEMYOCK RD
HENSHAWE RD
HOLMDENE RD
HONITON RD
HOOLE CLOSE
HUMBERSTONE RD
IAN TAYLOR RD
IRMAS LANE
JAN SMUTS ST
JANNI RD
KENDAL RD
KENNETH RD
KESTEL RD
KESTEL ST
KIRKWOOD RD
KLAAPROOS RD
KNUTSFORD RD
LAWRENCE RD
LEDORE RD
LEONARD ST
LIBERTY ST
LIDFORD RD
LYMPLEIGH RD 1-48
LYMPLEIGH RD 49-109
LYMPLEIGH RD 110-170
MAIDSTONE RD
MAIN RD
MAIN RD 1-174
MARKET RD
MASSINGER RD
MEADOW WAY
MEDWAY RD 1-20
MEDWAY RD 21+
MELVILLE RD
MENSEY RD
MEYER ST
MEYRICK AVE
MILE END RD
MILFORD RD 1-41
MILFORD RD 42-108
MILFORD RD 109-200
MIMOSA STR
MONTLEY RD
MORPETH RD
MORTON RD
MYBURGH RD
MYNDERD ST
NAPIER RD
NARUNA RD
NERANDA RD
NICE RD
NICHOLAS CL
NICHOLETTE STREET
NORMANDY AVE
NORMANDY CRESCENT
OLD KENDAL CLOSE
OLD KENDAL ROAD
OPHIR RD
ORLEANS AVE
PALATINE RD
PARK RD
PAUL KRUGER ST
PENHURST RD
PINEHILL AVE
PINELAW RD
PITT STR
PLUTO RD 1-37
PLUTO RD 39-97
PLUTO RD 99-160
PLYMPTON RD
PORTSWOOD RD
PRINCE AVE
PRINCE GEORGE DR 1-109
PRINCE GEORGE DR 110-189
PRINCESSVLEI ROAD
RAMBLER ROAD
RIVERS END RD
RONELL CRESCENT
RONELL STR
RORKE RD
ROTHERFIELD RD 1-40
ROTHERFIELD RD 41-89
ROTHERFIELD RD 90-160
ROUEN AVE
RUCHILL RD
RULE STREET
SAWLE RD
SCHAAY RD
SEATON ST
SELBY RD
SESSEL RD
SEVENOAKS RD
SEVERN RD 1-34
SEVERN RD 35-100
SIDBURY RD
SILVERTON RD
SKEW ST
SMITH RD
SOUTH RD
SOUTHFIELD RD 1-15
SOUTHFIELD RD 16 - 48 (EVEN)
SOUTHFIELD RD 16-160 (ODD)
SOUTHFIELD RD 50 -160 (EVEN)
SOVEREIGN RD
ST CATHERINES RD
ST CLAIR RD
ST JOANS RD
ST JOSEPHS RD
ST MARYS RD
STAINES RD
STELLA RD - 1-48
STELLA RD 49-115
STELLA RD 116-170
STIRLING RD
STUDENTS WAY
STUDLEY RD
SURING STR
SWAN CL
TALENT ST
THIRLMERE RD
THORNBURY RD
THORNWICK RD
THYME RD
TIMOUR HALL RD
TIVERTON RD
TIVERTON RD - UPPER
TOBRUK RD
TOPSHAM RD
TOTNES RD 1-19
TOTNES RD 20-61
TOTNES RD 62-115
TOULON AVE
TRAMORE RD
TRAMORE RD - east
TRAMORE ROAD 1 to 84
TRAMORE ROAD 85 upwards
TRENT RD
TRENTHAM RD
TWINE RD
TYNEMOUTH RD 1-26
TYNEMOUTH RD 27-58
TYNEMOUTH RD 59-115
VAN VUUREN RD
VERNON RD
VICTORIA RD 1-20
VICTORIA RD 20-160
VICTORIA RD 161-170
VILLAGE GREEN CLOSE
VIOOLTJIE STREET
WALSALL RD
WATERBURY RD
WATERFORD CLOSE
WATERFORD RD
WELKOM RD
WEMBLEY AVE
WEPENER RD
WEPENER ST
WHITBY RD
WHITE STR
WICKLOW RD
WINDSOR RD - Diep River
WINDSOR RD - Plumstead
WOODGATE RD 1-50
WOODGATE RD 51-160
WOODLEY RD 1-39
WOODLEY RD 40-103
WOODLEY RD 104-170
YELLOWWOOD CRESCENT
YUDELMANS LANE
YVONNE RD
```

---

## Appendix E: Zone Map Polygon Data

### E.1 Zone Dropdown Order

SECTION 2, SECTION 3, SECTION 4, SECTION 5, SECTION 6, SECTION 7, SECTION 1

### E.2 Polygon Format

Each zone is an array of `[lat, lng]` coordinate pairs. Coordinates are in WGS84.

### E.3 Section 1 (4 points)

```
[[-34.01699244792909, 18.48473310470581], [-34.02275480521573, 18.487093448638916], [-34.025077422345056, 18.47851037979126], [-34.01935079307847, 18.47623586654663]]
```

### E.4 Section 2 (12 points)

```
[[-34.02648145460159, 18.47902536392212], [-34.02740620033612, 18.47846746444702], [-34.02861546801401, 18.479197025299072], [-34.02954019049257, 18.479669094085693], [-34.030820558825546, 18.480913639068603], [-34.03156743143053, 18.481900691986084], [-34.032172037771545, 18.483316898345947], [-34.031460735746634, 18.484947681427002], [-34.030571599829535, 18.486106395721435], [-34.027584034898965, 18.487823009490967], [-34.02598351041663, 18.48846673965454], [-34.02281793977143, 18.487093448638916], [-34.02516278515807, 18.47851037979126]]
```

### E.5 Section 3 (37 points)

```
[[-34.02389478034832, 18.469412326812744], [-34.02560204740989, 18.46928358078003], [-34.02713144498673, 18.469111919403076], [-34.02866081499962, 18.46898317337036], [-34.02958553698397, 18.468854427337646], [-34.03033242046041, 18.468811511993408], [-34.03122155888397, 18.468639850616455], [-34.03225294778206, 18.468167781829834], [-34.03335545308402, 18.46778154373169], [-34.03421966507341, 18.46748113632202], [-34.0353683776341, 18.467094898223877], [-34.03622190003363, 18.466837406158447], [-34.0370042880224, 18.466622829437256], [-34.03782223138586, 18.466322422027588], [-34.03856904235116, 18.466322422027588], [-34.03936207683894, 18.46627950668335], [-34.04053561267023, 18.466365337371826], [-34.03886420824754, 18.467223644256592], [-34.03829521199323, 18.46803903579712], [-34.037797337139665, 18.469111919403076], [-34.037512835911286, 18.47022771835327], [-34.03705051938, 18.471343517303467], [-34.036552637220694, 18.47254514694214], [-34.03584137192392, 18.474390506744384], [-34.03491671812236, 18.476579189300537], [-34.03411119440948, 18.478338718414306], [-34.0335777306433, 18.479926586151123], [-34.03300869892866, 18.481299877166748], [-34.03229740391822, 18.48301649093628], [-34.031763928746884, 18.4820294380188], [-34.030945926969196, 18.480956554412842], [-34.02998743235164, 18.47996950149536], [-34.02892044960592, 18.479154109954834], [-34.02781788667328, 18.47851037979126], [-34.02714211521409, 18.477566242218017], [-34.02614623167564, 18.476192951202392], [-34.02582612377049, 18.475463390350342], [-34.025648285523665, 18.474605083465576], [-34.02522147221074, 18.473145961761474], [-34.02486579281018, 18.472115993499756], [-34.02436783914503, 18.470871448516845]]
```

### E.6 Section 4 (12 points)

```
[[-34.02089453101527, 18.47027063369751], [-34.02375784186914, 18.46951961517334], [-34.02413131007628, 18.470635414123535], [-34.024718185366986, 18.4720516204834], [-34.02514500121113, 18.473360538482666], [-34.02544732780196, 18.474562168121338], [-34.025642950316225, 18.475592136383056], [-34.025945275133104, 18.47625732421875], [-34.02682556773072, 18.477362394332885], [-34.02735907395168, 18.478413820266723], [-34.02659438065999, 18.478928804397583], [-34.01933941063519, 18.476150035858154]]
```

### E.7 Section 5 (17 points)

```
[[-34.03477801967123, 18.467137813568115], [-34.03463576384176, 18.465120792388916], [-34.03442238005728, 18.46254587173462], [-34.03417343163035, 18.460700511932373], [-34.02748711489134, 18.459885120391845], [-34.02421489553853, 18.463103771209717], [-34.022829499817135, 18.464348316192627], [-34.02083761983558, 18.466107845306396], [-34.02169128840887, 18.46726655960083], [-34.02092120908439, 18.469841480255127], [-34.021917153937615, 18.469583988189697], [-34.02341104930505, 18.46928358078003], [-34.02550957219223, 18.469197750091552], [-34.02741491433606, 18.468940258026123], [-34.029548904273376, 18.468811511993408], [-34.031327188224225, 18.46851110458374], [-34.03271422383247, 18.467910289764404]]
```

### E.8 Section 6 (29 points)

```
[[-34.013319630302526, 18.470356464385986], [-34.01392436665002, 18.470828533172607], [-34.014778104748665, 18.47100019454956], [-34.015525118542406, 18.471171855926513], [-34.01616541084824, 18.471128940582275], [-34.016770126925, 18.470957279205322], [-34.017268125165536, 18.470828533172607], [-34.01933122961073, 18.47027063369751], [-34.02082517049297, 18.469970226287842], [-34.02150099225399, 18.46730947494507], [-34.020754031047204, 18.466150760650634], [-34.02416865718651, 18.46301794052124], [-34.02324387617209, 18.461687564849853], [-34.02260363725905, 18.46074342727661], [-34.021394283912635, 18.459970951080322], [-34.02018491333457, 18.45928430557251], [-34.01908223690732, 18.458383083343506], [-34.01744598097201, 18.45756769180298], [-34.01584526529898, 18.456709384918213], [-34.01524054263414, 18.4560227394104], [-34.013853221420945, 18.457138538360595], [-34.01388879404294, 18.458983898162842], [-34.013959939242206, 18.460829257965088], [-34.01413780197954, 18.462717533111572], [-34.01442238158424, 18.464949131011963], [-34.01470696023502, 18.466923236846924], [-34.01431566434426, 18.46872568130493], [-34.01363978537601, 18.4690260887146]]
```

### E.9 Section 7 (7 points)

```
[[-34.01559448359905, 18.471386432647705], [-34.01438503038909, 18.481085300445556], [-34.01388701523579, 18.480613231658935], [-34.01335342432976, 18.48421812057495], [-34.01577234291198, 18.484647274017334], [-34.01694620503179, 18.484690189361572], [-34.02075225238391, 18.47022771835327]]
```

### E.10 Map Styling

Per-zone fill/stroke params (order: Section 1–7): `#00b050`, `#4f81bd`, `#974806`, `#ffff00`, `#5f497a`, `#f79646`, `#ff0000`.

---

## Appendix F: Form Field Specification (Member Registration)

Build-spec table for implementation.

| Field | Type | Required | Min | Max | Validation | Options | Notes |
|-------|------|----------|-----|-----|------------|---------|-------|
| username | text | Yes | 6 | 20 | Unique; not editable after creation | — | Availability check as user types past 6 chars |
| password | password | Yes | 6 | 20 | — | — | |
| confirmPassword | password | Yes | 6 | 20 | Must match password | — | |
| firstName | text | Yes | 1 | — | — | — | |
| lastName | text | Yes | 2 | — | — | — | |
| image | file | No | — | — | — | — | Optional |
| houseNumber | text | Yes | — | — | — | — | House number or name |
| street | select | Yes | — | — | Must be from list | [Appendix D] | If street not listed, contact membership admin |
| homeTelephone | text | No | — | — | — | — | |
| cellphone | text | No | — | — | — | — | Strongly advised |
| email | email | No | — | — | — | — | Strongly advised |
| additionalContactName | text | No | — | — | — | — | Emergency contact; no org communications |
| additionalContactNumber | text | No | — | — | — | — | |
| additionalContactEmail | text | No | — | — | — | — | |
| hideFromNeighbours | radio | No | — | — | — | Yes, No | Default: No |
| patrolOptIn | radio | No | — | — | — | Yes, No | "Read first to enable selection below" |
| receiveEmail | radio | No | — | — | — | Yes, No | If No, no email regardless of other options |
| receiveNews | radio | No | — | — | — | Yes, No | |
| receiveNewsFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveEvents | radio | No | — | — | — | Yes, No | |
| receiveEventsFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveIncidentsZone | radio | No | — | — | — | Yes, No | Incidents in your zone |
| receiveIncidentsZoneFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveIncidentsOther | radio | No | — | — | — | Yes, No | Disabled if only one zone |
| receiveIncidentsOtherFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveAffiliated | radio | No | — | — | — | Yes, No | Watches affiliated to PNW |
| receiveAffiliatedFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveAdhoc | radio | No | — | — | — | Yes, No | |
| captcha | text | Yes | — | — | Must match image | — | Enter number from CAPTCHA image |

**Submit:** Finish Registration button. Success: on-screen notification + email confirmation (if email provided).

---

## Appendix G: Form Field Specification (Guest Registration)

| Field | Type | Required | Min | Max | Validation | Options | Notes |
|-------|------|----------|-----|-----|------------|---------|-------|
| username | text | Yes | 6 | 20 | — | — | |
| password | password | Yes | 6 | 20 | — | — | |
| confirmPassword | password | Yes | 6 | 20 | Must match password | — | |
| firstName | text | Yes | — | — | — | — | |
| lastName | text | Yes | — | — | — | — | |
| telephone | text | Yes | — | — | — | — | |
| cellphone | text | Yes | — | — | — | — | |
| email | email | Yes | — | — | — | — | |
| receiveEmail | radio | No | — | — | — | Yes, No | If No, no email |
| receiveNews | radio | No | — | — | — | Yes, No | |
| receiveNewsFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveEvents | radio | No | — | — | — | Yes, No | |
| receiveEventsFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveIncidents | radio | No | — | — | — | Yes, No | |
| receiveIncidentsFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveIncidentsOther | radio | No | — | — | — | Yes, No | |
| receiveIncidentsOtherFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveAffiliated | radio | No | — | — | — | Yes, No | |
| receiveAffiliatedFreq | select | No | — | — | — | Immediately, Weekly, monthly | |
| receiveAdhoc | radio | No | — | — | — | Yes, No | |
| captcha | text | Yes | — | — | Must match image | — | |

---

## Appendix H: Login / Forgot Password Flow

### H.1 Login Modal

**Location:** Header (top right); "Login" link opens modal on current page.

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Username or email address | text | Yes | Single field accepts either |
| Password | password | Yes | |
| Remember me next time? | checkbox | No | |
| Captcha image | image | — | Served from jpegImage.aspx |
| Captcha input | text | Yes | "Please enter the number you see in the image above" |

### H.2 Forgot Password

**Location:** "Forgot Password" link in Quick Links bar (top right).

**Flow (from help/memreg.html):** Click Forgot Password on default.aspx → follow instructions in email sent.

**Note:** No direct URL; link opens modal or navigates to password recovery flow. Clerk provides equivalent in new platform.

---

## Appendix I: Help Section Link Map

| Page | URL | Links Out |
|------|-----|-----------|
| Help index | https://plumsteadwatch.org.za/help/index.html | Menu (links to memreg, patrola, glossary) |
| Member Registration | https://plumsteadwatch.org.za/help/pages/memreg.html | register.aspx, default.aspx, glossary.html |
| Patrol Administration | https://plumsteadwatch.org.za/help/pages/patrola.html | glossary.html |
| Glossary | https://plumsteadwatch.org.za/help/pages/glossary.html | A–Z anchor links (Back to Top) |

### I.1 Help Cross-References

- memreg.html → register.aspx (new registration)
- memreg.html → default.aspx (forgot password flow)
- memreg.html → glossary.html
- patrola.html → glossary.html
- glossary.html → octoxgroup.com, info@octoxgroup.com

---

## Appendix J: Committee and Emergency Seed Data

### J.1 Executive Committee (for CommitteeMember seed)

| order | role | name | phone | email |
|-------|------|------|-------|-------|
| 1 | Chairperson | Anthea Klugman | 072 675 9777 | chairperson@mypnw.org.za |
| 2 | Assistant Chairperson | Brenda Besterfield | 084 589 1702 | assistantchairperson@mypnw.org.za |
| 3 | Operations Manager | Jarryd Munro | 078 457 2313 | ops.manager@mypnw.org.za |
| 4 | Secretary | Sharon Botes | 079 469 9885 | secretary@mypnw.org.za |
| 5 | Treasurer | Glynnis Okkers | 072 470 3136 | treasurer@mypnw.org.za |
| 6 | Assistant Ops Manager | Clive Besterfield | 082 355 2953 | getitdonecjb@gmail.com |
| 7 | Public Relations Officer | Catherine Harland | 082 323 4046 | events.funding@mypnw.org.za |

### J.2 Management Committee

| order | role | name | phone | email |
|-------|------|------|-------|-------|
| 8 | Response Team | Justin De Vos | 0843063566 | responseteam@mypnw.org.za |
| 9 | Social Media Manager | Maxine Leibowitz | 072 312 4479 | socialmedia@mypnw.org.za |
| 10 | Community Liaison Officer | Peter Ruthenberg, Sabine Kerrison | 082 828 8884, 063 693 3671 | — |

### J.3 Camera Project

| order | role | name | phone | email |
|-------|------|------|-------|-------|
| 11 | Assistant Project Managers | Ian Ziller | 082 979 6520 | — |
| 12 | Assistant Project Manager | Shaun Johnson | 072 214 6715 | — |
| 13 | Project Manager | Craig Stolly | 082 5377 4616 | — |

### J.4 Emergency Contacts (for EmergencyContact seed)

| order | service | number |
|-------|---------|--------|
| 1 | SAPS Flying Squad | 10111 |
| 2 | Ambulance | 10177 |
| 3 | Fire | 107 |
| 4 | Metro Police Control Room | 021 596 1999 |
| 5 | Power Failure | 086 012 5001 |
| 6 | Water | 086 010 3054 |
| 7 | Diep River SAPS | 021 710 7306/7 |
| 8 | Constantiaberg Medi-Clinic | 021 799 2911 |
| 9 | Red Cross Childrens Hospital | 021 658 5111 |
| 10 | Poison Information Helpline | 0861 55 5777 |
| 11 | Wynberg Fire Station | 021 797 6108 |
| 12 | Plumstead Animal Hospital | 021 797 1998 |
| 13 | Plumstead Animal Hospital (After Hours) | 082 321 3135 |
| 14 | Kenilworth Veterinary Hospital | 021 671 5018 |
| 15 | S.P.C.A. Animal Centre | 021 700 4140 |
| 16 | SPCA Emergency After Hours | 083 326 1604 |

---

*Plan follows: Plan → Build → Verify → Document. Re-plan on drift.*
