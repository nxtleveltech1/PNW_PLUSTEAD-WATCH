import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  TabStopPosition,
  TabStopType,
  convertInchesToTwip,
} from "docx";
import { writeFile } from "fs/promises";

const PRIMARY = "1E40AF";
const ACCENT = "D97706";
const DARK = "1A1A2E";
const MUTED = "64748B";
const LIGHT_BG = "F1F5F9";
const WHITE = "FFFFFF";
const TABLE_HEADER_BG = "1E3A5F";
const TABLE_ALT_BG = "EFF6FF";

const FONT = "Calibri";
const FONT_DISPLAY = "Calibri Light";

function heading1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text,
        font: FONT_DISPLAY,
        size: 36,
        color: PRIMARY,
        bold: true,
      }),
    ],
  });
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({
        text,
        font: FONT_DISPLAY,
        size: 28,
        color: DARK,
        bold: true,
      }),
    ],
  });
}

function heading3(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 24,
        color: PRIMARY,
        bold: true,
      }),
    ],
  });
}

function para(text: string, opts?: { bold?: boolean; spacing?: { before?: number; after?: number } }): Paragraph {
  return new Paragraph({
    spacing: opts?.spacing ?? { before: 60, after: 100 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 21,
        color: DARK,
        bold: opts?.bold,
      }),
    ],
  });
}

function boldLabel(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 80 },
    children: [
      new TextRun({ text: label, font: FONT, size: 21, color: DARK, bold: true }),
      new TextRun({ text: value, font: FONT, size: 21, color: DARK }),
    ],
  });
}

function bullet(text: string, level = 0): Paragraph {
  return new Paragraph({
    bullet: { level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: FONT, size: 21, color: DARK })],
  });
}

function bulletBold(label: string, rest: string, level = 0): Paragraph {
  return new Paragraph({
    bullet: { level },
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: label, font: FONT, size: 21, color: DARK, bold: true }),
      new TextRun({ text: rest, font: FONT, size: 21, color: DARK }),
    ],
  });
}

function numberedItem(num: string, boldText: string, rest: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: convertInchesToTwip(0.25) },
    children: [
      new TextRun({ text: `${num}. `, font: FONT, size: 21, color: MUTED, bold: true }),
      new TextRun({ text: boldText, font: FONT, size: 21, color: DARK, bold: true }),
      new TextRun({ text: ` -- ${rest}`, font: FONT, size: 21, color: DARK }),
    ],
  });
}

function makeCell(
  text: string,
  opts?: { bold?: boolean; header?: boolean; width?: number; color?: string; shading?: string },
): TableCell {
  return new TableCell({
    width: opts?.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts?.shading
      ? { type: ShadingType.SOLID, color: opts.shading, fill: opts.shading }
      : opts?.header
        ? { type: ShadingType.SOLID, color: TABLE_HEADER_BG, fill: TABLE_HEADER_BG }
        : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: [
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({
            text,
            font: FONT,
            size: 19,
            bold: opts?.bold ?? opts?.header ?? false,
            color: opts?.color ?? (opts?.header ? WHITE : DARK),
          }),
        ],
      }),
    ],
  });
}

function styledTable(headers: string[], rows: string[][], colWidths?: number[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => makeCell(h, { header: true, width: colWidths?.[i] })),
  });

  const dataRows = rows.map(
    (row, ri) =>
      new TableRow({
        children: row.map((cell, ci) =>
          makeCell(cell, {
            width: colWidths?.[ci],
            shading: ri % 2 === 1 ? TABLE_ALT_BG : undefined,
          }),
        ),
      }),
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
    },
    rows: [headerRow, ...dataRows],
  });
}

function separator(): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1", space: 8 } },
    children: [],
  });
}

function pageBreak(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] });
}

async function generate() {
  const doc = new Document({
    creator: "PNW Platform",
    title: "Plumstead Neighbourhood Watch -- Digital Community Safety Platform",
    description: "Platform Overview: Features, Functions, and Capabilities",
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 21, color: DARK },
        },
        heading1: {
          run: { font: FONT_DISPLAY, size: 36, color: PRIMARY, bold: true },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        heading2: {
          run: { font: FONT_DISPLAY, size: 28, color: DARK, bold: true },
          paragraph: { spacing: { before: 360, after: 160 } },
        },
        heading3: {
          run: { font: FONT, size: 24, color: PRIMARY, bold: true },
          paragraph: { spacing: { before: 280, after: 120 } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "pnw-bullets",
          levels: [
            { level: 0, format: NumberFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } } },
            { level: 1, format: NumberFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.25) } } } },
          ],
        },
      ],
    },
    sections: [
      // ──────── COVER PAGE ────────
      {
        properties: {
          page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) } },
        },
        children: [
          new Paragraph({ spacing: { before: 2400 }, children: [] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "PLUMSTEAD NEIGHBOURHOOD WATCH", font: FONT_DISPLAY, size: 48, color: PRIMARY, bold: true }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "Digital Community Safety Platform", font: FONT_DISPLAY, size: 32, color: DARK }),
            ],
          }),
          separator(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({ text: "Platform Overview", font: FONT, size: 28, color: ACCENT, bold: true }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "Features, Functions, and Capabilities", font: FONT, size: 24, color: MUTED }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "Version 1.0  |  March 2026", font: FONT, size: 21, color: MUTED }),
            ],
          }),
          new Paragraph({ spacing: { before: 600 }, children: [] }),
          styledTable(
            ["Item", "Detail"],
            [
              ["Prepared for", "PNW Executive Committee, prospective partners, and community stakeholders"],
              ["Classification", "Internal / Pre-proposal"],
              ["Frameworks applied", "UNDP Digital Participation Guide (2025), ISO 37120/37122 Community Indicators, SaaS Proposal Best Practice"],
            ],
            [30, 70],
          ),
          pageBreak(),

          // ──────── TABLE OF CONTENTS ────────
          heading1("Table of Contents"),
          ...[
            "1.  Executive Summary",
            "2.  Problem Statement and Community Context",
            "3.  Platform Architecture Overview",
            "4.  Community-Facing Features",
            "5.  Membership and Identity",
            "6.  Business Networking Hub",
            "7.  Platform Administration",
            "8.  Data Architecture and Security",
            "9.  Integration and API Layer",
            "10. Quality Assurance and Governance",
            "11. Community Value and Impact",
            "12. Roadmap and Future Capabilities",
            "",
            "Appendix A: Platform Route Map",
            "Appendix B: Seed Data Reference",
          ].map((t) => para(t, { spacing: { before: 40, after: 40 } })),
          pageBreak(),

          // ──────── 1. EXECUTIVE SUMMARY ────────
          heading1("1. Executive Summary"),
          para("The Plumstead Neighbourhood Watch (PNW) digital platform is a purpose-built community safety and engagement system that replaces legacy paper-based processes, fragmented phone trees, and outdated web technology with a modern, integrated digital experience."),
          para("The platform serves three distinct audiences -- residents seeking safety information, committee members administering community operations, and local businesses building neighbourhood visibility -- through a single, unified web application."),

          heading2("Key Platform Metrics"),
          styledTable(
            ["Dimension", "Value"],
            [
              ["Geographic coverage", "Plumstead, Cape Town (postcode 7800)"],
              ["Patrol sections", "7 defined zones with street-level granularity"],
              ["Registered streets", "230+"],
              ["Volunteer base", "80+ active patrollers"],
              ["Operational since", "2007 (community); 2025 (digital platform)"],
              ["Admin roles", "5 tiered roles with 11 granular permissions"],
              ["Business categories", "5 (Retail, Services, Food and Dining, Health, Other)"],
              ["Sponsorship tiers", "3 (Premium, Partner, Supporter)"],
              ["Partner agencies", "CVIC, SAPS Diep River, Department of Community Safety (DOCS)"],
            ],
            [35, 65],
          ),

          heading2("Technology Foundation"),
          para("The platform is engineered for performance, accessibility, and maintainability using an enterprise-grade open-source stack: Next.js 15 with React 19 Server Components for fast, SEO-optimised rendering; Neon serverless Postgres for a scalable relational data layer; Clerk for identity management; and Tailwind CSS with shadcn/ui for a consistent, accessible design system. It is deployed on Vercel\u2019s global edge network, ensuring sub-second page loads for all South African users."),
          pageBreak(),

          // ──────── 2. PROBLEM STATEMENT ────────
          heading1("2. Problem Statement and Community Context"),
          heading2("The Challenge"),
          para("Traditional neighbourhood watch operations face persistent structural limitations that reduce their effectiveness:"),
          bulletBold("Fragmented communication. ", "Incident reports, meeting notices, and safety updates circulate via WhatsApp chains, printed flyers, and word of mouth. Information reaches some residents and misses others. There is no single source of truth."),
          bulletBold("Manual administration. ", "Member registration, volunteer coordination, payment reconciliation, and document distribution require committee time that should be directed toward safety operations."),
          bulletBold("Limited situational awareness. ", "Residents lack a consolidated, real-time view of local incident activity. Under-reporting to CVIC and SAPS reduces the data that drives resource allocation \u2013 fewer reported incidents translate directly to fewer patrol resources."),
          bulletBold("No business engagement channel. ", "Local businesses that benefit from community safety have no structured mechanism to connect with residents, support operations through sponsorship, or participate in community events."),
          bulletBold("Technology debt. ", "The legacy platform (On Alert ASP.NET WebForms CMS) is no longer actively maintained, lacks mobile responsiveness, and provides limited administrative capability."),

          heading2("The Opportunity"),
          para("A purpose-built digital platform addresses each of these gaps by providing a centralised, always-available system that unites residents, committee members, volunteers, partner agencies, and local businesses around shared community safety objectives. It transforms the neighbourhood watch from a coordination group into a digitally-enabled community safety network."),
          pageBreak(),

          // ──────── 3. ARCHITECTURE ────────
          heading1("3. Platform Architecture Overview"),
          para("The platform follows a layered architecture designed for security, performance, and operational simplicity."),

          heading2("Architectural Layers"),
          styledTable(
            ["Layer", "Technology", "Purpose"],
            [
              ["Presentation", "React 19 Server Components, Tailwind CSS, shadcn/ui", "Server-rendered pages with progressive client-side enhancement"],
              ["Application framework", "Next.js 15 App Router", "File-based routing, server actions, API routes, middleware"],
              ["Authentication", "Clerk", "Identity management, SSO, MFA readiness, webhook-based user sync"],
              ["Data access", "Prisma ORM", "Type-safe database queries, schema migrations, referential integrity"],
              ["Database", "Neon serverless Postgres", "Scalable relational storage with branching for staging environments"],
              ["Deployment", "Vercel Edge Network", "Global CDN, preview deployments, zero-downtime releases"],
            ],
            [22, 30, 48],
          ),

          heading2("Access Tiers"),
          para("The platform defines four access tiers that govern what each visitor can see and do:"),
          numberedItem("1", "Public visitor", "Unrestricted access to safety information, events calendar, incident feed, zone map, safety tips, documents, and business directory."),
          numberedItem("2", "Registered member", "All public content plus incident reporting, event RSVP, member dashboard, digital membership card, business messaging, and account management."),
          numberedItem("3", "Registered guest", "Simplified registration with WhatsApp opt-in; read access to member-level content without full membership privileges."),
          numberedItem("4", "Administrator", "Full platform management console with role-based permission controls across all operational domains."),
          pageBreak(),

          // ──────── 4. COMMUNITY-FACING FEATURES ────────
          heading1("4. Community-Facing Features"),

          heading2("4.1 Home and Emergency Access"),
          para("The home page functions as the platform\u2019s operational command surface, providing immediate access to critical safety resources."),
          boldLabel("Emergency strip. ", "A persistent, high-contrast banner displays the CVIC crime reporting number (0860 002 669) and SAPS Flying Squad number (10111) with direct click-to-call functionality. The accompanying message \u2013 \u201CLess reported incidents = fewer resources\u201D \u2013 reinforces the reporting imperative."),
          boldLabel("Emergency and support cards. ", "Two prominent cards provide direct-dial links to CVIC (24-hour crime reporting) and SAPS (10111), plus banking details for community donations (FNB account 631 463 987 05, branch 255355) with one-click copy and a \u201CDonate now\u201D call to action."),
          boldLabel("Content feeds. ", "The home page surfaces live data: up to 3 safety tips, up to 6 upcoming events, up to 5 recent incidents, and sponsor acknowledgements with links to partner websites."),

          heading2("4.2 Incident Reporting and Tracking"),
          para("Residents use the incident system to report and review local criminal and suspicious activity."),
          bulletBold("Incident feed. ", "A filterable, reverse-chronological list of all recorded incidents. Filters include zone and incident type."),
          bulletBold("Incident detail. ", "Individual incident pages provide full details including type classification, street-level location, and precise date/time."),
          bulletBold("Report form. ", "Authenticated members can submit new incident reports specifying type, location, and date/time. Reports are attributed to the submitting user."),

          heading2("4.3 Community Events"),
          bulletBold("Event listing. ", "All events displayed with title, location, and date. Upcoming events sorted chronologically."),
          bulletBold("Event detail. ", "Full event information including content, location, start and end times."),
          bulletBold("RSVP. ", "Authenticated members can toggle attendance. RSVPs tracked per user and visible on the dashboard."),

          heading2("4.4 Safety Tips Library"),
          para("A curated knowledge base of crime prevention advice organised by category."),
          styledTable(
            ["Category", "Coverage"],
            [
              ["Burglary", "Home security, access control, deterrence"],
              ["Scams", "Fraud awareness, identity protection"],
              ["Vehicle safety", "Car security, parking awareness"],
              ["Anti-social behaviour", "Neighbour disputes, noise, public order"],
              ["General", "CVIC vs SAPS reporting guidance, general awareness"],
            ],
            [30, 70],
          ),

          heading2("4.5 Interactive Zone Map"),
          bulletBold("Section selection. ", "Users can select any of the 7 patrol sections on the map to view details."),
          bulletBold("Section statistics. ", "Each section displays the number of registered streets and approved member count."),
          bulletBold("Street listing. ", "All streets within a selected section are listed, drawn from the 230+ street database."),
          bulletBold("Registration pathway. ", "The zone map links into the registration flow for section identification."),

          heading2("4.6 Document Library"),
          styledTable(
            ["Category", "Content examples"],
            [
              ["Forms", "Membership forms, guest registration forms"],
              ["Policies", "Operational policies and guidelines"],
              ["Newsletter Archive", "Past community newsletters"],
              ["Financials", "Financial statements and reports"],
              ["News", "SAGA media releases, community updates"],
              ["Debit Order Instruction", "Debit order setup forms"],
              ["Ooba Solar", "Partner documentation"],
              ["Local Business Advertising", "Advertising information and rates"],
            ],
            [35, 65],
          ),

          heading2("4.7 Volunteer Management"),
          styledTable(
            ["Role", "Description", "Time commitment"],
            [
              ["Patroller", "Join 80+ volunteer patrollers. Patrol assigned area, report incidents.", "Flexible"],
              ["Block Captain", "Liaison for 10\u201315 houses. Coordinate with neighbours and relay updates.", "2\u20134 hours/month"],
              ["Coordinator", "Run a scheme or support multiple groups. Crime prevention, training.", "4\u20138 hours/month"],
              ["Committee", "Chair, secretary, treasurer, or operations. Organisational leadership.", "Variable"],
            ],
            [20, 55, 25],
          ),
          para("The volunteer interest form captures name, email, phone, preferred role, zone preference, availability, and a free-text message."),

          heading2("4.8 Vacation Watch"),
          bulletBold("Eligibility. ", "Available to approved, active members."),
          bulletBold("Registration form. ", "Captures name, address, contact phone, departure and return dates, emergency contact, and special instructions."),
          bulletBold("Date validation. ", "The system enforces that the return date falls after the departure date."),

          heading2("4.9 Start a Neighbourhood Scheme"),
          para("A guided pathway for residents in adjacent areas who wish to establish their own neighbourhood watch, presented as a four-step process with an inquiry form collecting name, email, phone, address, and message."),

          heading2("4.10 Contact and Emergency Directory"),
          bulletBold("Committee directory. ", "Executive committee members displayed with role, name, phone (click-to-call), and email (click-to-email)."),
          bulletBold("Emergency contacts. ", "CVIC (0860 002 669), SAPS Flying Squad (10111), Ambulance (10177), Fire (107), Metro Police (021 596 1999), Power Failure (086 012 5001), Water (086 010 3054), Diep River SAPS (021 710 7306/7)."),
          bulletBold("Contact form. ", "Public submission form (name, email, message) for committee review via admin console."),

          heading2("4.11 About and Organisational Transparency"),
          bulletBold("Mission. ", "PNW exists to educate, empower, and activate residents so that Plumstead remains safer and stronger."),
          bulletBold("Operational facts. ", "Founded 2007, 80+ volunteer patrollers, primary control room CVIC, accredited by DOCS."),
          bulletBold("Partners. ", "CVIC (incident control), SAPS Diep River (crime prevention and response), DOCS (accreditation)."),

          heading2("4.12 Donations and Funding"),
          bulletBold("Banking details. ", "FNB account details with one-click copy for account number."),
          bulletBold("Funding transparency. ", "Donations support patrol coordination, surveillance coverage, incident communications, and volunteer training."),
          bulletBold("Sponsor partnerships. ", "Call to action linking businesses to the sponsorship programme."),

          heading2("4.13 Legal and Compliance"),
          bullet("Terms of Use \u2013 Platform usage terms and conditions"),
          bullet("Privacy Policy \u2013 Data protection and privacy practices"),
          bullet("Disclaimer \u2013 Legal liability limitations"),

          heading2("4.14 Help Centre"),
          bullet("Member Registration Guide \u2013 Step-by-step registration walkthrough"),
          bullet("Glossary \u2013 A\u2013Z of neighbourhood watch terminology"),
          bullet("Patrol Administration \u2013 Patrol zones, types, and operational resources"),
          pageBreak(),

          // ──────── 5. MEMBERSHIP AND IDENTITY ────────
          heading1("5. Membership and Identity"),

          heading2("5.1 Member Registration"),
          para("The member registration flow captures comprehensive resident information aligned with neighbourhood watch operational requirements."),
          styledTable(
            ["Field", "Purpose"],
            [
              ["Zone", "Assigns the member to one of 7 patrol sections"],
              ["Street", "Links the member to one of 230+ streets in the zone database"],
              ["House number", "Property-level identification within the street"],
              ["Privacy toggle", "Controls whether the member is visible to neighbours"],
              ["Patrol opt-in", "Indicates willingness to participate in community patrols"],
              ["Secondary contact", "Name, phone, and email for an emergency contact person"],
              ["WhatsApp opt-in/phone", "Consent and number for WhatsApp communications"],
            ],
            [30, 70],
          ),
          para("After data capture, the flow redirects to Clerk for identity creation (email, password, optional MFA). A webhook synchronises the Clerk identity record with the platform\u2019s user database."),

          heading2("5.2 Guest Registration"),
          para("A simplified pathway for residents who want community awareness without full membership obligations. Guest registration captures WhatsApp opt-in and phone number, with Clerk handling identity creation."),

          heading2("5.3 Digital Membership Card"),
          para("Approved members receive a digital membership card that can be downloaded for offline use, displaying member name, number (auto-incremented), zone, and membership status."),

          heading2("5.4 Member Dashboard"),
          bulletBold("Recent incidents \u2013 ", "The 5 most recent incidents with type, location, and date."),
          bulletBold("Upcoming events \u2013 ", "The next 5 future events with title, location, and date."),
          bulletBold("Your RSVPs \u2013 ", "Events the member has confirmed attendance for."),
          bulletBold("Quick links \u2013 ", "Account, Settings, Documents, Contact."),
          bulletBold("Admin access \u2013 ", "Direct link to the admin console (visible only to ADMIN role users)."),

          heading2("5.5 Account Management"),
          bullet("Profile \u2013 Name, email, and avatar management (powered by Clerk)"),
          bullet("Membership \u2013 Zone, street, emergency contacts, and digital membership card"),
          bullet("Settings \u2013 Application preferences"),
          bullet("Security \u2013 Password and authentication settings"),
          pageBreak(),

          // ──────── 6. BUSINESS NETWORKING HUB ────────
          heading1("6. Business Networking Hub"),
          para("The Business Networking Hub connects local businesses with the Plumstead community through a self-service directory, in-app messaging, events, and referral system."),

          heading2("6.1 Business Directory"),
          para("A searchable, filterable directory of approved local businesses with filtering by category (Retail, Services, Food and Dining, Health, Other), zone, and free-text search. The directory distinguishes between featured listings and standard listings. All listings require administrative approval."),

          heading2("6.2 Business Listing Submission"),
          boldLabel("Submission data: ", "Business name, description (minimum 20 characters), category, email, and optional fields for address, phone, website URL, and zone."),
          boldLabel("Approval workflow: ", "Submissions enter with PENDING status. Administrators approve or reject. Only approved listings appear publicly."),

          heading2("6.3 Business Listing Detail"),
          bullet("Business name, category badge, and zone"),
          bullet("Full description and contact information"),
          bulletBold("Message form \u2013 ", "Authenticated users can send a direct message to the listing owner."),
          bulletBold("Request introduction \u2013 ", "Facilitated introduction request between the user and the business."),
          bulletBold("Refer a friend \u2013 ", "Share the listing with a contact by providing their name and email."),

          heading2("6.4 Business Events"),
          para("Businesses can host events linked to their listing, with title, description, location, start/end times, hosting business, and RSVP capability for authenticated users."),

          heading2("6.5 In-App Messaging"),
          bullet("Residents send messages from listing detail pages"),
          bullet("Listing owners access their inbox to view and manage received messages"),
          bullet("Messages tracked with read status"),

          heading2("6.6 Referral System"),
          para("Authenticated users can refer friends to businesses. The referral form captures the referred person\u2019s name, email, and an optional message."),

          heading2("6.7 Introduction Requests"),
          para("A managed introduction workflow: authenticated users submit a request with a message; requests follow PENDING \u2192 ACCEPTED or DECLINED."),

          heading2("6.8 Sponsorship and Advertising"),
          styledTable(
            ["Tier", "Placement"],
            [
              ["Premium", "Home page sponsor strip, Business Hub partners section, Sponsors page with logo and link"],
              ["Partner", "Business Hub partners section, Sponsors page with logo and link"],
              ["Supporter", "Sponsors page with name acknowledgement"],
            ],
            [20, 80],
          ),
          para("Businesses can inquire about website advertising opportunities through a direct email link to the committee (info@plumsteadwatch.org.za)."),
          pageBreak(),

          // ──────── 7. PLATFORM ADMINISTRATION ────────
          heading1("7. Platform Administration"),
          para("This section provides a comprehensive overview of the administrative capabilities available to authorised committee members and platform operators.", { bold: true }),

          heading2("7.1 Admin Console Overview"),
          para("The admin console is accessible at /admin and is protected by a server-side guard. Only users with the admin.access permission or whose email appears in the bootstrap admin list can access the console."),
          para("The overview dashboard presents real-time aggregate statistics:"),
          styledTable(
            ["Metric", "Data source"],
            [
              ["Total users", "All registered users"],
              ["Active users", "Users with isActive = true"],
              ["Total roles", "Defined RBAC roles"],
              ["Pending listings", "Business listings with PENDING status"],
              ["Total incidents", "All recorded incidents"],
              ["Total events", "All community events"],
              ["Total documents", "All uploaded documents"],
              ["Contact messages", "All contact form submissions"],
              ["Pending members", "Members with isApproved = false"],
            ],
            [30, 70],
          ),

          heading2("7.2 Administrative Modules"),
          para("The admin console provides 11 management modules. Modules marked Live are fully operational; modules marked Defined are architecturally scaffolded with navigation, permissions, and data models in place, pending UI build-out."),
          styledTable(
            ["Module", "Status", "Permission required"],
            [
              ["Overview dashboard", "Live", "admin.access"],
              ["Incidents", "Live", "incidents.manage"],
              ["Business approvals", "Live", "business.manage"],
              ["Member approvals", "Live", "members.approve"],
              ["Contact messages", "Live", "messages.view"],
              ["Users", "Defined", "users.view / users.manage"],
              ["Roles", "Defined", "roles.manage"],
              ["Events", "Defined", "events.manage"],
              ["Documents", "Defined", "documents.manage"],
              ["Payments", "Defined", "(not yet gated)"],
              ["Broadcast", "Defined", "broadcast.send"],
            ],
            [30, 15, 55],
          ),

          heading3("Overview Dashboard (Live)"),
          para("Real-time aggregate statistics with direct links to each management section."),
          heading3("Incidents (Live)"),
          para("View all reported incidents in tabulated format. Create, edit, and moderate community-submitted reports."),
          heading3("Business Approvals (Live)"),
          para("Review submissions. Approve or reject listings. Toggle the \u201Cfeatured\u201D flag for hub prominence."),
          heading3("Member Approvals (Live)"),
          para("Review new member registrations. Approve members to grant full platform access and activate their digital membership card."),
          heading3("Contact Messages (Live)"),
          para("View and manage all contact form submissions including sender name, email, and message text."),
          heading3("Users (Defined)"),
          para("View all registered users. Manage accounts including activation/deactivation and role assignment. Navigation, permission model, and data layer are in place."),
          heading3("Roles (Defined)"),
          para("Create, edit, and manage custom roles with granular permission assignment. 5 pre-defined roles ship with the system. Navigation, RBAC schema, and seed data are in place."),
          heading3("Events (Defined)"),
          para("Create, edit, and manage community events. Navigation, permission model, and data layer are in place."),
          heading3("Documents (Defined)"),
          para("Upload, categorise, and manage downloadable documents across 8 categories. Navigation, permission model, and data layer are in place."),
          heading3("Payments (Defined)"),
          para("Administer membership payments and donations. Supports Paystack (online) and EFT (manual). Tracks amount (ZAR), status (Pending/Paid/Failed), references, and verification. Navigation and data model are in place."),
          heading3("Broadcast (Defined)"),
          para("Send community-wide communications via the ADMIN_BROADCAST conversation type. Navigation, conversation model, and permission are in place."),

          heading2("7.3 Role-Based Access Control (RBAC)"),
          para("The platform implements a granular, database-driven RBAC system that separates authentication (who you are) from authorisation (what you can do)."),

          heading3("Permission Inventory"),
          styledTable(
            ["Permission Key", "Group", "Description"],
            [
              ["admin.access", "Platform", "Access the admin console"],
              ["users.view", "User Management", "View all user accounts"],
              ["users.manage", "User Management", "Edit user accounts, assign roles"],
              ["roles.manage", "Role Management", "Create, edit, and delete roles and permissions"],
              ["incidents.manage", "Operations", "Create, edit, and moderate incidents"],
              ["events.manage", "Operations", "Create, edit, and manage events"],
              ["documents.manage", "Content", "Upload, categorise, and manage documents"],
              ["business.manage", "Business", "Approve, reject, and manage business listings"],
              ["members.approve", "Membership", "Approve or reject member registrations"],
              ["messages.view", "Communications", "View contact form submissions"],
              ["broadcast.send", "Communications", "Send platform-wide broadcast messages"],
            ],
            [25, 20, 55],
          ),

          heading3("Permission Matrix"),
          styledTable(
            ["Role", "admin.access", "users.view", "users.manage", "roles.manage", "incidents.manage", "events.manage", "documents.manage", "business.manage", "members.approve", "messages.view", "broadcast.send"],
            [
              ["Member", "", "", "", "", "", "", "", "", "", "", ""],
              ["Moderator", "\u2713", "", "", "", "\u2713", "", "", "", "", "\u2713", ""],
              ["Zone Captain", "\u2713", "\u2713", "", "", "\u2713", "", "", "", "\u2713", "", ""],
              ["Admin", "\u2713", "\u2713", "\u2713", "", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713"],
              ["Super Admin", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713"],
            ],
          ),

          heading3("Role Descriptions"),
          bulletBold("Member \u2013 ", "Standard community member with no administrative access. Can report incidents, RSVP to events, manage their own account, and use the business directory."),
          bulletBold("Moderator \u2013 ", "Trusted community volunteer who can access the admin console to manage incidents and view contact messages. Ideal for patrol coordinators."),
          bulletBold("Zone Captain \u2013 ", "Section leader responsible for a defined geographic area. Can approve new member registrations, manage incidents, and view user profiles. Supports decentralised membership management."),
          bulletBold("Admin \u2013 ", "Full operational administrator with access to all platform management functions except role definition."),
          bulletBold("Super Admin \u2013 ", "Unrestricted access to all platform functions including role and permission management. Reserved for the committee chairperson."),

          heading3("Bootstrap Administration"),
          para("Initial platform administrators are designated through the ADMIN_EMAILS environment variable. Email addresses listed are automatically assigned the Super Admin role when they authenticate, ensuring at least one administrator can always access the console."),

          heading2("7.4 Approval Workflows"),
          boldLabel("Member approval. ", "New member registrations require committee review before the member gains full platform access. Pending members appear in the admin console\u2019s Member approvals section."),
          boldLabel("Business listing approval. ", "All business listing submissions enter with PENDING status. Administrators review each submission for quality and relevance before approving it for public display."),

          heading2("7.5 Administrative Data Model"),
          para("The admin console operates on a comprehensive data model with 25+ interconnected entities:"),
          styledTable(
            ["Domain", "Entities"],
            [
              ["Identity and access", "User, Role, Permission, RolePermission"],
              ["Safety operations", "Incident, Zone, Street"],
              ["Community engagement", "Event, EventRsvp, CommitteeMember, EmergencyContact"],
              ["Content management", "Document, DocumentCategory, SafetyTip, Sponsor"],
              ["Business networking", "BusinessListing, BusinessMessage, BusinessEvent, BusinessEventRsvp, BusinessReferral, BusinessIntroRequest"],
              ["Communications", "ContactMessage, Conversation, ConversationParticipant, InboxMessage"],
              ["Financial", "MembershipPayment"],
              ["Community programmes", "VolunteerInterest, VacationWatch, SchemeInquiry"],
            ],
            [25, 75],
          ),
          pageBreak(),

          // ──────── 8. DATA ARCHITECTURE ────────
          heading1("8. Data Architecture and Security"),

          heading2("8.1 Database Design"),
          para("The platform uses Neon serverless PostgreSQL accessed through Prisma ORM with strict TypeScript type generation. The schema enforces referential integrity through foreign key relationships and composite unique constraints."),
          bulletBold("Auto-incrementing member numbers ", "for human-readable member identification."),
          bulletBold("Zone-street hierarchy ", "with section assignment for geographic precision."),
          bulletBold("Composite unique constraints on RSVPs ", "to prevent duplicate attendance records."),
          bulletBold("Separate business event system ", "from community events for independent lifecycle management."),
          bulletBold("Conversation model ", "supporting four types (Direct, System, Business, Admin Broadcast) for flexible messaging."),

          heading2("8.2 Authentication and Identity Sync"),
          para("Authentication is managed by Clerk, providing email/password authentication, multi-factor authentication readiness, OAuth/SSO integration capability, and webhook-based sync to the platform database."),
          bulletBold("user.created \u2013 ", "Creates a local User record, assigns default role, auto-promotes bootstrap admins."),
          bulletBold("user.updated \u2013 ", "Syncs email, name, and profile changes."),
          bulletBold("user.deleted \u2013 ", "Removes the local User record."),

          heading2("8.3 Server-Side Security"),
          bulletBold("Route protection. ", "Clerk middleware protects authenticated routes."),
          bulletBold("Admin guard. ", "The requireAdmin() function enforces admin-level access by checking permissions and bootstrap admin list."),
          bulletBold("Permission guard. ", "The requirePermission() function enforces granular permission checks on individual admin operations."),
          bulletBold("Input validation. ", "All form submissions and API inputs are validated against Zod schemas."),
          bulletBold("Privacy controls. ", "Members control their visibility to neighbours through the hideFromNeighbours toggle."),

          heading2("8.4 Data Privacy and Compliance"),
          bullet("Email preferences stored as structured JSON for granular communication consent"),
          bullet("WhatsApp opt-in is explicit and separate from registration consent"),
          bullet("Secondary contact information is optional"),
          bullet("Legal pages (Terms, Privacy, Disclaimer) accessible from every page via footer"),
          pageBreak(),

          // ──────── 9. INTEGRATION AND API ────────
          heading1("9. Integration and API Layer"),

          heading2("9.1 REST API"),
          para("The platform exposes a documented REST API for business networking features, specified in OpenAPI 3.0 format."),
          styledTable(
            ["Method", "Endpoint", "Auth", "Purpose"],
            [
              ["GET", "/api/business/listings", "Public", "List approved listings with filters"],
              ["POST", "/api/business/listings", "Required", "Submit a new listing"],
              ["GET", "/api/business/listings/{id}", "Public", "Retrieve a single listing"],
              ["GET", "/api/business/messages", "Required", "Retrieve messages for the user\u2019s listings"],
              ["POST", "/api/business/messages", "Required", "Send a message to a listing"],
              ["GET", "/api/business/events", "Public", "List all business events"],
              ["POST", "/api/business/events/{id}/rsvp", "Required", "Toggle RSVP for a business event"],
              ["POST", "/api/business/referrals", "Required", "Submit a business referral"],
            ],
            [10, 35, 12, 43],
          ),

          heading2("9.2 Webhook Integration"),
          para("The Clerk webhook endpoint processes identity lifecycle events to maintain synchronisation between the authentication provider and the platform database. The webhook secret is validated on every request."),

          heading2("9.3 Payment Gateway"),
          bulletBold("Paystack \u2013 ", "Online card payment processing with reference tracking and access code management."),
          bulletBold("EFT \u2013 ", "Manual bank transfer with verification workflow."),
          para("Payment records track type (Membership, Donation, Event Fee, Other), amount in ZAR, status lifecycle, and audit timestamps."),

          heading2("9.4 Future Integration Readiness"),
          bulletBold("WhatsApp \u2013 ", "User opt-in and phone number fields captured during registration. Broadcast integration supported through the Conversation model."),
          bulletBold("n8n workflow automation \u2013 ", "Webhook triggers for new listings, referrals, and registrations are architecturally supported."),
          pageBreak(),

          // ──────── 10. QUALITY ASSURANCE ────────
          heading1("10. Quality Assurance and Governance"),

          heading2("10.1 Regression Testing"),
          styledTable(
            ["Flow", "Verification scope"],
            [
              ["Member registration", "Zone/street selection, Clerk sign-up, user sync, dashboard redirect"],
              ["Guest registration", "Simplified flow, WhatsApp opt-in, user sync"],
              ["Incident reporting", "Form validation, user attribution, incident creation"],
              ["Event RSVP", "Toggle add/remove, duplicate prevention"],
              ["Contact submission", "Form validation, record creation"],
              ["Volunteer interest", "Form validation, zone linkage, record creation"],
              ["Vacation watch", "Date validation, record creation"],
              ["Scheme inquiry", "Form validation, record creation"],
              ["Safety tip browsing", "Category listing, slug-based detail rendering"],
              ["Zone map routing", "Section selection, member counts, registration pathway"],
              ["Admin console", "Access guard, incident management, listing approval, message review"],
            ],
            [25, 75],
          ),

          heading2("10.2 Evidence and Audit Trail"),
          para("The platform maintains an evidence matrix documenting verification of each feature and flow."),

          heading2("10.3 Release Process"),
          numberedItem("1", "Pre-release verification", "Lint checks, production builds (Bun and Node), CI pipeline validation."),
          numberedItem("2", "Database synchronisation", "Schema generation, migration deployment, optional reference data seeding."),
          numberedItem("3", "Staging validation", "Smoke testing across authentication, registration, incident reporting, RSVP, public routes, and business features."),
          numberedItem("4", "Production deployment", "Executed during maintenance windows with Vercel deployment."),
          numberedItem("5", "Rollback procedure", "Documented rollback to the previous stable commit via Vercel."),

          heading2("10.4 Build Quality Gates"),
          bullet("bun run lint \u2013 Static code analysis"),
          bullet("bun run build:bun \u2013 Production build via Bun runtime"),
          bullet("bun run build:node \u2013 Production build via Node runtime"),
          bullet("bun run ci:verify \u2013 Combined verification pipeline"),

          heading2("10.5 Accessibility"),
          bullet("Skip-to-main-content link on every page"),
          bullet("Reduced motion support (respects prefers-reduced-motion system setting)"),
          bullet("Semantic HTML structure with ARIA labels on navigation regions"),
          bullet("High-contrast emergency alert strip for critical safety information"),
          bullet("Click-to-call links on all phone numbers for mobile accessibility"),
          pageBreak(),

          // ──────── 11. COMMUNITY VALUE ────────
          heading1("11. Community Value and Impact"),
          para("The platform\u2019s capabilities align with international standards for sustainable, smart, and resilient communities (ISO 37120/37122/37123)."),

          heading2("Safety and Security (ISO 37120)"),
          styledTable(
            ["Capability", "Community impact"],
            [
              ["Incident reporting and feed", "Increases reported incidents, driving SAPS resource allocation"],
              ["CVIC/SAPS integration", "Immediate access to emergency response coordination"],
              ["Safety tips library", "Reduces crime opportunity through resident education"],
              ["Vacation watch programme", "Extends surveillance to properties of absent members"],
              ["Zone map and patrol sections", "Enables geographic coordination of volunteer patrol coverage"],
            ],
            [35, 65],
          ),

          heading2("Community Engagement (ISO 37122)"),
          styledTable(
            ["Capability", "Community impact"],
            [
              ["Event management and RSVP", "Increases community participation and social cohesion"],
              ["Volunteer recruitment pipeline", "Structures volunteer onboarding across four role types"],
              ["Member dashboard", "Provides personalised situational awareness to each resident"],
              ["Digital membership card", "Creates tangible community identity and belonging"],
            ],
            [35, 65],
          ),

          heading2("Economic Development"),
          styledTable(
            ["Capability", "Community impact"],
            [
              ["Business directory", "Increases local commerce visibility and spending within the community"],
              ["Sponsorship tiers", "Creates structured revenue channels for community safety operations"],
              ["Business events", "Generates networking opportunities between businesses and residents"],
              ["Referral system", "Facilitates word-of-mouth growth for local businesses"],
            ],
            [35, 65],
          ),

          heading2("Governance and Transparency"),
          styledTable(
            ["Capability", "Community impact"],
            [
              ["Committee directory", "Makes leadership visible and contactable"],
              ["Document library", "Financial reports, policies, and newsletters publicly accessible"],
              ["Role-based administration", "Distributes operational responsibility across committee members"],
              ["Donation transparency", "Banking details and funding allocation publicly disclosed"],
            ],
            [35, 65],
          ),

          heading2("Resilience (ISO 37123)"),
          styledTable(
            ["Capability", "Community impact"],
            [
              ["Emergency contact directory", "Centralises 8+ emergency and municipal service numbers"],
              ["Start-a-scheme programme", "Extends the neighbourhood watch model to adjacent communities"],
              ["Zone-based coordination", "Enables localised response within broader coordination"],
              ["WhatsApp integration readiness", "Prepares for SA\u2019s most widely used messaging platform"],
            ],
            [35, 65],
          ),

          heading2("Digital Inclusion"),
          styledTable(
            ["Capability", "Community impact"],
            [
              ["Guest registration", "Low-barrier entry point for residents not ready for full membership"],
              ["Mobile-responsive design", "Full functionality on smartphones"],
              ["Server-rendered pages", "Fast load times even on slow connections"],
              ["Print stylesheet", "Documents and pages can be printed for offline distribution"],
            ],
            [35, 65],
          ),
          pageBreak(),

          // ──────── 12. ROADMAP ────────
          heading1("12. Roadmap and Future Capabilities"),

          heading2("Completed (P1 \u2013 High Priority)"),
          bullet("Street selector with zone-street mapping (230+ streets across 7 sections)"),
          bullet("House number capture at registration"),
          bullet("Privacy toggle (hide from neighbours)"),
          bullet("Patrol opt-in during registration"),
          bullet("Secondary contact information capture"),
          bullet("WhatsApp opt-in and phone number fields"),
          bullet("Full business networking hub (directory, messaging, events, referrals)"),
          bullet("RBAC with 5 roles and 11 permissions"),

          heading2("In Progress (P2 \u2013 Medium Priority)"),
          bullet("Interactive zone map with section statistics and street listings"),
          bullet("Help centre with member registration guide, glossary, and patrol administration"),
          bullet("Document category filtering"),

          heading2("Planned (P3 \u2013 Lower Priority)"),
          bullet("Neighbour directory (with privacy controls)"),
          bullet("Community forum for resident discussion"),
          bullet("Community polling system"),
          bullet("Patrol booking and scheduling system"),

          heading2("Future Enhancements"),
          bulletBold("WhatsApp broadcast integration \u2013 ", "Activate broadcast messaging to opted-in members using existing schema infrastructure."),
          bulletBold("Payment processing activation \u2013 ", "Enable Paystack online payments for membership fees and event registrations."),
          bulletBold("Advanced analytics \u2013 ", "Dashboard reporting on incident trends, membership growth, event participation, and business directory engagement."),
          bulletBold("Push notifications \u2013 ", "Real-time alerts for incident reports and event reminders."),
          bulletBold("Multi-zone support \u2013 ", "Extend the platform to serve additional neighbourhood watch organisations beyond Plumstead."),
          pageBreak(),

          // ──────── APPENDIX A ────────
          heading1("Appendix A: Platform Route Map"),
          styledTable(
            ["Route", "Access", "Purpose"],
            [
              ["/", "Public", "Home page with emergency contacts, feeds, sponsors"],
              ["/about", "Public", "Mission, partners, executive committee"],
              ["/contact", "Public", "Contact form, committee directory, emergency contacts"],
              ["/donate", "Public", "Banking details and funding information"],
              ["/events", "Public", "Community events listing"],
              ["/events/[id]", "Public", "Event detail with RSVP (auth required for RSVP)"],
              ["/incidents", "Public", "Incident feed with filters"],
              ["/incidents/[id]", "Public", "Incident detail"],
              ["/safety-tips", "Public", "Safety tips by category"],
              ["/safety-tips/[slug]", "Public", "Individual safety tip detail"],
              ["/find", "Public", "Interactive zone map"],
              ["/documents", "Public", "Document library with categories"],
              ["/volunteer", "Public", "Volunteer roles and interest form"],
              ["/vacation-watch", "Public", "Vacation watch registration"],
              ["/start-scheme", "Public", "Start a neighbourhood scheme guide"],
              ["/sponsors", "Public", "Sponsor listing by tier"],
              ["/business", "Public", "Business networking hub"],
              ["/business/[id]", "Public", "Business listing detail"],
              ["/business/submit", "Auth", "Submit a business listing"],
              ["/business/events", "Public", "Business events listing"],
              ["/business/events/[id]", "Public", "Business event detail with RSVP"],
              ["/business/messages", "Auth", "Listing owner message inbox"],
              ["/business/[id]/request-intro", "Auth", "Request introduction to a business"],
              ["/business/referrals", "Auth", "Business referral form"],
              ["/register", "Public", "Member registration"],
              ["/register/guest", "Public", "Guest registration"],
              ["/sign-in", "Public", "Clerk sign-in"],
              ["/sign-up", "Public", "Clerk sign-up"],
              ["/dashboard", "Auth", "Member dashboard"],
              ["/account", "Auth", "Account management hub"],
              ["/account/profile", "Auth", "Profile management"],
              ["/account/membership", "Auth", "Membership details and card"],
              ["/account/settings", "Auth", "Application settings"],
              ["/account/security", "Auth", "Security settings"],
              ["/help", "Public", "Help centre index"],
              ["/help/member-registration", "Public", "Registration guide"],
              ["/help/glossary", "Public", "Terminology glossary"],
              ["/help/patrol-administration", "Public", "Patrol administration guide"],
              ["/terms", "Public", "Terms of use"],
              ["/privacy", "Public", "Privacy policy"],
              ["/disclaimer", "Public", "Legal disclaimer"],
              ["/admin", "Admin", "Admin console overview"],
              ["/admin/incidents", "Admin", "Incident management"],
              ["/admin/business", "Admin", "Business listing approvals"],
              ["/admin/members", "Admin", "Member registration approvals"],
              ["/admin/messages", "Admin", "Contact message management"],
              ["/admin/users", "Admin", "User management (defined, pending UI)"],
              ["/admin/roles", "Admin", "Role and permission management (defined)"],
              ["/admin/events", "Admin", "Event management (defined, pending UI)"],
              ["/admin/documents", "Admin", "Document management (defined, pending UI)"],
              ["/admin/payments", "Admin", "Payment administration (defined, pending UI)"],
              ["/admin/broadcast", "Admin", "Community broadcast (defined, pending UI)"],
            ],
            [28, 10, 62],
          ),
          pageBreak(),

          // ──────── APPENDIX B ────────
          heading1("Appendix B: Seed Data Reference"),

          heading2("Executive Committee"),
          styledTable(
            ["Role", "Name", "Contact"],
            [
              ["Chairperson", "Anthea Klugman", "072 675 9777 / chairperson@mypnw.org.za"],
              ["Assistant Chairperson", "Brenda Besterfield", "084 589 1702 / assistantchairperson@mypnw.org.za"],
              ["Operations Manager", "Jarryd Munro", "078 457 2313 / ops.manager@mypnw.org.za"],
              ["Secretary", "Sharon Botes", "079 469 9885 / secretary@mypnw.org.za"],
              ["Treasurer", "Glynnis Okkers", "072 470 3136 / treasurer@mypnw.org.za"],
            ],
            [25, 25, 50],
          ),

          heading2("Emergency Contacts"),
          styledTable(
            ["Service", "Number"],
            [
              ["CVIC", "0860 002 669"],
              ["SAPS Flying Squad", "10111"],
              ["Ambulance", "10177"],
              ["Fire", "107"],
              ["Metro Police Control Room", "021 596 1999"],
              ["Power Failure", "086 012 5001"],
              ["Water", "086 010 3054"],
              ["Diep River SAPS", "021 710 7306/7"],
            ],
            [50, 50],
          ),

          heading2("Current Sponsors"),
          styledTable(
            ["Name", "Tier", "Link"],
            [
              ["ADT Security", "Premium", "https://www.adt.co.za"],
              ["Combat Force", "Premium", "https://combatforce.co.za"],
              ["Zone Security Services", "Partner", "\u2014"],
              ["Ooba Solar", "Partner", "https://www.ooba.co.za"],
              ["Tammy Frankland", "Supporter", "\u2014"],
              ["Lance Gordon", "Supporter", "\u2014"],
            ],
            [30, 20, 50],
          ),
          separator(),
          new Paragraph({
            spacing: { before: 200, after: 0 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "This document was compiled in accordance with the UNDP/People Powered Digital Participation Platform Guide (2025) for structural governance, ISO 37120/37122/37123 community indicators for impact assessment, and SaaS proposal best practices for capability presentation. All feature descriptions have been verified against the running platform codebase as of March 2026.",
                font: FONT,
                size: 17,
                color: MUTED,
                italics: true,
              }),
            ],
          }),
        ],
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "PNW Platform Overview  |  ", font: FONT, size: 16, color: MUTED }),
                  new TextRun({ text: "Confidential", font: FONT, size: 16, color: MUTED, italics: true }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Page ", font: FONT, size: 16, color: MUTED }),
                  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: MUTED }),
                  new TextRun({ text: " of ", font: FONT, size: 16, color: MUTED }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: MUTED }),
                ],
              }),
            ],
          }),
        },
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = "docs/PNW_Platform_Overview.docx";
  await writeFile(outPath, buffer);
  console.log(`Generated: ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

generate().catch((err) => {
  console.error("Failed to generate DOCX:", err);
  process.exit(1);
});
