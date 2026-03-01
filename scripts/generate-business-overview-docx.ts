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
  convertInchesToTwip,
} from "docx";
import { writeFile } from "fs/promises";

// ── Design tokens ──────────────────────────────────────────────────────
const PRIMARY = "1E40AF";
const ACCENT = "D97706";
const DARK = "1A1A2E";
const MUTED = "64748B";
const LIGHT_BG = "F1F5F9";
const WHITE = "FFFFFF";
const TBL_HEAD = "1E3A5F";
const TBL_ALT = "EFF6FF";
const GREEN = "16A34A";

const FONT = "Calibri";
const DISPLAY = "Calibri Light";

// ── Helpers ────────────────────────────────────────────────────────────

function h1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, font: DISPLAY, size: 36, color: PRIMARY, bold: true })],
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, font: DISPLAY, size: 28, color: DARK, bold: true })],
  });
}

function h3(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, font: FONT, size: 24, color: PRIMARY, bold: true })],
  });
}

function p(text: string, opts?: { bold?: boolean; italic?: boolean; center?: boolean; color?: string; size?: number }): Paragraph {
  return new Paragraph({
    alignment: opts?.center ? AlignmentType.CENTER : undefined,
    spacing: { before: 60, after: 100 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: opts?.size ?? 21,
        color: opts?.color ?? DARK,
        bold: opts?.bold,
        italics: opts?.italic,
      }),
    ],
  });
}

function labelValue(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 80 },
    children: [
      new TextRun({ text: label, font: FONT, size: 21, color: DARK, bold: true }),
      new TextRun({ text: value, font: FONT, size: 21, color: DARK }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: FONT, size: 21, color: DARK })],
  });
}

function bulletBold(label: string, rest: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: label, font: FONT, size: 21, color: DARK, bold: true }),
      new TextRun({ text: rest, font: FONT, size: 21, color: DARK }),
    ],
  });
}

function numberedLine(num: string, boldPart: string, rest: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: convertInchesToTwip(0.25) },
    children: [
      new TextRun({ text: `${num}. `, font: FONT, size: 21, color: MUTED, bold: true }),
      new TextRun({ text: boldPart, font: FONT, size: 21, color: DARK, bold: true }),
      new TextRun({ text: ` \u2013 ${rest}`, font: FONT, size: 21, color: DARK }),
    ],
  });
}

function cell(
  text: string,
  opts?: { bold?: boolean; header?: boolean; width?: number; shading?: string; color?: string },
): TableCell {
  return new TableCell({
    width: opts?.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts?.shading
      ? { type: ShadingType.SOLID, color: opts.shading, fill: opts.shading }
      : opts?.header
        ? { type: ShadingType.SOLID, color: TBL_HEAD, fill: TBL_HEAD }
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

function table(headers: string[], rows: string[][], widths?: number[]): Table {
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
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, { header: true, width: widths?.[i] })) }),
      ...rows.map((row, ri) =>
        new TableRow({
          children: row.map((c, ci) => cell(c, { width: widths?.[ci], shading: ri % 2 === 1 ? TBL_ALT : undefined })),
        }),
      ),
    ],
  });
}

function calloutBox(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 10 } },
    shading: { type: ShadingType.SOLID, color: "FEF3C7", fill: "FEF3C7" },
    children: [new TextRun({ text, font: FONT, size: 20, color: DARK, italics: true })],
  });
}

function divider(): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1", space: 8 } },
    children: [],
  });
}

function pb(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] });
}

// ── Document generation ────────────────────────────────────────────────

async function generate() {
  const doc = new Document({
    creator: "PNW Platform",
    title: "PNW Digital Platform \u2013 Service Overview for Stakeholders",
    description: "Business-reader overview of the Plumstead Neighbourhood Watch digital platform",
    styles: {
      default: {
        document: { run: { font: FONT, size: 21, color: DARK } },
      },
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            { level: 0, format: NumberFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } } },
            { level: 1, format: NumberFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.25) } } } },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) } },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "PNW Digital Platform  |  ", font: FONT, size: 16, color: MUTED }),
                  new TextRun({ text: "Service Overview for Stakeholders", font: FONT, size: 16, color: MUTED, italics: true }),
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
                  new TextRun({ text: "Plumstead Neighbourhood Watch  |  Page ", font: FONT, size: 16, color: MUTED }),
                  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: MUTED }),
                  new TextRun({ text: " of ", font: FONT, size: 16, color: MUTED }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: MUTED }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ════════════════════════════════════════════════════════════════
          //  COVER PAGE
          // ════════════════════════════════════════════════════════════════
          new Paragraph({ spacing: { before: 2000 }, children: [] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [new TextRun({ text: "PLUMSTEAD NEIGHBOURHOOD WATCH", font: DISPLAY, size: 48, color: PRIMARY, bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: "Digital Community Safety Platform", font: DISPLAY, size: 32, color: DARK })],
          }),
          divider(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 60 },
            children: [new TextRun({ text: "Service & Value Overview", font: FONT, size: 30, color: ACCENT, bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: "For the Executive Committee, Community Stakeholders & Partners", font: FONT, size: 22, color: MUTED })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: "Version 1.0  |  March 2026", font: FONT, size: 21, color: MUTED })],
          }),
          new Paragraph({ spacing: { before: 500 }, children: [] }),
          table(
            ["Item", "Detail"],
            [
              ["Prepared for", "PNW Executive Committee, prospective partners, and community stakeholders"],
              ["Purpose", "Proposal-ready overview of the full platform service offering"],
              ["Classification", "Internal / Pre-proposal"],
              ["Best-practice alignment", "UNDP Digital Participation Guide (2025), ISO 37120/37122 Community Indicators"],
            ],
            [30, 70],
          ),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  TABLE OF CONTENTS
          // ════════════════════════════════════════════════════════════════
          h1("Table of Contents"),
          ...[
            "1.  Executive Summary",
            "2.  The Problem We Solve",
            "3.  How the Platform Works",
            "4.  What Residents Get",
            "5.  Membership & Registration",
            "6.  Business Networking & Sponsorship",
            "7.  Platform Administration & Committee Management",
            "8.  Data Protection & Privacy",
            "9.  Quality & Reliability",
            "10. Community Impact",
            "11. Roadmap & Future Growth",
            "",
            "Appendix A \u2013 Emergency Contacts & Committee Directory",
            "Appendix B \u2013 Current Sponsors",
          ].map((t) => p(t, { size: 21 })),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  1. EXECUTIVE SUMMARY
          // ════════════════════════════════════════════════════════════════
          h1("1. Executive Summary"),
          p("The Plumstead Neighbourhood Watch (PNW) digital platform is an all-in-one online system that connects residents, committee members, volunteers, and local businesses around a shared goal: making Plumstead safer and stronger."),
          p("It replaces outdated paper forms, scattered WhatsApp groups, and a legacy website with a single, modern platform that any resident can access from their phone, tablet, or computer \u2013 24 hours a day."),
          calloutBox("\u201CLess reported incidents = fewer resources.\u201D \u2013 Every incident reported through CVIC or SAPS directly influences police resource allocation for our area. This platform makes reporting easier and faster."),
          h2("At a Glance"),
          table(
            ["Dimension", "Detail"],
            [
              ["Coverage area", "Plumstead, Cape Town (postcode 7800)"],
              ["Patrol sections", "7 neighbourhood zones with street-level detail"],
              ["Streets mapped", "230+ streets across all 7 zones"],
              ["Volunteer base", "80+ active patrollers, with 4 volunteer role types"],
              ["Operating since", "2007 (community founded); 2025 (digital platform launched)"],
              ["Admin roles", "5 committee roles with tailored access levels"],
              ["Business directory", "5 categories (Retail, Services, Food & Dining, Health, Other)"],
              ["Sponsorship tiers", "3 levels: Premium, Partner, Supporter"],
              ["Key partners", "CVIC, SAPS Diep River, Department of Community Safety (DOCS)"],
            ],
            [30, 70],
          ),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  2. THE PROBLEM WE SOLVE
          // ════════════════════════════════════════════════════════════════
          h1("2. The Problem We Solve"),
          p("Neighbourhood watches across South Africa share a common set of operational challenges. These are not failures of commitment \u2013 they are structural limitations that technology can address."),

          h2("Communication is fragmented"),
          p("Safety updates, meeting notices, and incident reports travel through multiple WhatsApp groups, printed flyers, and word of mouth. Some residents receive the information; many do not. There is no single, reliable source of truth for the community."),

          h2("Administration is manual and time-consuming"),
          p("Registering new members, tracking volunteers, reconciling payments, and distributing documents all require committee time \u2013 time that could be directed toward actual safety operations. Forms are filled out on paper. Spreadsheets are maintained by individual committee members. Information is siloed."),

          h2("Incident reporting is under-utilised"),
          p("When crime or suspicious activity goes unreported to CVIC and SAPS, our area appears statistically safer than it is. This directly reduces the patrol resources allocated to Plumstead. The more incidents reported, the more resources the community receives."),

          h2("Businesses have no structured way to participate"),
          p("Local businesses benefit from a safe neighbourhood, but there has been no formal channel for them to connect with residents, sponsor operations, or participate in community events."),

          h2("The old website no longer meets community needs"),
          p("The legacy website was built on technology that is no longer maintained. It lacks mobile support, has limited self-service capability, and cannot scale to meet the growing needs of the community."),

          calloutBox("The PNW digital platform was built specifically to solve each of these problems \u2013 giving the committee better tools to manage operations and giving residents better access to safety information and community services."),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  3. HOW THE PLATFORM WORKS
          // ════════════════════════════════════════════════════════════════
          h1("3. How the Platform Works"),
          p("The platform is a modern website that works on any device \u2013 smartphone, tablet, or desktop computer. There is nothing to download or install. Residents simply visit the website to access all features."),

          h2("Four Levels of Access"),
          p("The platform is designed around four levels of user access, each unlocking additional capabilities:"),
          table(
            ["Access level", "Who", "What they can do"],
            [
              ["Public visitor", "Anyone who visits the website", "View safety information, incidents, events, safety tips, zone map, documents, business directory, emergency contacts"],
              ["Registered member", "Residents who complete the membership registration", "Everything above, plus: report incidents, RSVP to events, access the member dashboard, download a digital membership card, message businesses"],
              ["Registered guest", "Residents who want basic awareness only", "Simplified sign-up with WhatsApp opt-in; access to community content without full membership obligations"],
              ["Committee administrator", "Authorised committee members", "Full management console to administer users, incidents, events, documents, business listings, payments, and broadcasts"],
            ],
            [18, 25, 57],
          ),

          h2("Always Available"),
          p("The platform is hosted on a global network that ensures fast loading speeds for South African users. Pages load in under one second, even on slower mobile connections. The site is available 24 hours a day, 7 days a week, with built-in redundancy to prevent downtime."),

          h2("Secure by Design"),
          p("All user accounts are protected by industry-standard authentication with support for multi-factor authentication (e.g. a code sent to your phone in addition to your password). Committee members have additional security layers that restrict access to administrative functions based on their assigned role."),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  4. WHAT RESIDENTS GET
          // ════════════════════════════════════════════════════════════════
          h1("4. What Residents Get"),
          p("Every feature on the platform exists to serve a specific community need. This section walks through each capability from the resident\u2019s perspective."),

          h2("4.1 Emergency Access"),
          p("The moment a resident opens the platform, they see the two most important numbers in the community:"),
          bulletBold("CVIC \u2013 0860 002 669 ", "(24-hour crime reporting hotline)"),
          bulletBold("SAPS Flying Squad \u2013 10111 ", "(emergency police response)"),
          p("On a mobile phone, tapping either number initiates a call immediately. The platform also provides the full emergency directory including ambulance, fire, metro police, power failure, water, and the local Diep River SAPS station."),
          calloutBox("Every call to CVIC or SAPS is logged and contributes to the data that determines how many police resources are allocated to Plumstead. Reporting is not optional \u2013 it is the most impactful thing a resident can do."),

          h2("4.2 Incident Reporting & Awareness"),
          bulletBold("View incidents. ", "A live feed of all recorded incidents showing what happened, where, and when. Residents can filter by area or type of incident."),
          bulletBold("Report incidents. ", "Registered members can submit incident reports directly from their phone, specifying the type, location, and time. Each report is linked to the submitting user for follow-up."),
          bulletBold("Stay informed. ", "The 5 most recent incidents appear on the home page and on each member\u2019s personal dashboard."),

          h2("4.3 Community Events"),
          bulletBold("Browse events. ", "All community events \u2013 meetings, social gatherings, fundraisers \u2013 are listed with title, venue, date, and time."),
          bulletBold("RSVP. ", "Registered members can confirm their attendance with a single tap. RSVPs appear on the member\u2019s dashboard."),
          bulletBold("Never miss a date. ", "Up to 6 upcoming events are highlighted on the home page."),

          h2("4.4 Safety Tips"),
          p("A curated library of crime prevention advice, organised into five practical categories:"),
          table(
            ["Category", "What it covers"],
            [
              ["Home security", "Securing your property, access control, visible deterrents"],
              ["Scam prevention", "Fraud awareness, protecting personal information"],
              ["Vehicle safety", "Car security, parking awareness, hijacking prevention"],
              ["Anti-social behaviour", "Neighbour disputes, noise complaints, public order"],
              ["Reporting guidance", "When to call CVIC vs SAPS, what information to provide"],
            ],
            [30, 70],
          ),

          h2("4.5 Interactive Zone Map"),
          p("Plumstead is divided into 7 patrol sections. The interactive zone map lets residents:"),
          bullet("Select any section to see which streets it covers"),
          bullet("View the number of registered members in each section"),
          bullet("Identify their own section before registering as a member"),

          h2("4.6 Document Library"),
          p("The committee publishes documents for residents to download, organised into 8 categories: Forms, Policies, Newsletter Archive, Financials, News, Debit Order Instructions, Partner documentation, and Local Business Advertising."),

          h2("4.7 Volunteer Opportunities"),
          p("Residents who want to contribute can apply for one of four volunteer roles:"),
          table(
            ["Role", "What you do", "Time needed"],
            [
              ["Patroller", "Patrol your assigned area, report incidents, support the community", "Flexible"],
              ["Block Captain", "Act as liaison for 10\u201315 houses, coordinate with neighbours", "2\u20134 hours/month"],
              ["Coordinator", "Run a scheme or support multiple groups across sections", "4\u20138 hours/month"],
              ["Committee member", "Chair, secretary, treasurer, or operations leadership", "Variable"],
            ],
            [20, 55, 25],
          ),
          p("Interested residents complete a short form and are contacted by the committee."),

          h2("4.8 Vacation Watch"),
          p("Going away? Registered members can request enhanced surveillance of their property while they are absent. The form captures travel dates, emergency contact details, and any special instructions. The committee coordinates with patrol volunteers to provide additional attention to the property."),

          h2("4.9 Start Your Own Scheme"),
          p("Residents in areas adjacent to Plumstead can inquire about establishing their own neighbourhood watch. A guided four-step process explains what is involved, and an inquiry form connects interested parties with the PNW committee for guidance."),

          h2("4.10 Donations & Funding"),
          p("Residents can contribute financially to community safety. The platform displays full banking details (FNB account 631 463 987 05, branch 255355) with a one-tap copy feature. A clear breakdown shows where donations go:"),
          bullet("Patrol and response coordination"),
          bullet("Community surveillance and CCTV coverage"),
          bullet("Incident communications and outreach materials"),
          bullet("Volunteer training and operational support"),

          h2("4.11 Help Centre"),
          p("A dedicated help section provides:"),
          bullet("Step-by-step member registration guide"),
          bullet("Glossary of neighbourhood watch terms"),
          bullet("Patrol administration guidance"),

          h2("4.12 Legal & Compliance"),
          p("Terms of Use, Privacy Policy, and Disclaimer pages are accessible from every page, ensuring transparency and regulatory compliance."),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  5. MEMBERSHIP & REGISTRATION
          // ════════════════════════════════════════════════════════════════
          h1("5. Membership & Registration"),

          h2("Member Registration"),
          p("The registration process is designed to capture the information the committee needs to operate effectively, while remaining simple enough for any resident to complete in a few minutes."),
          table(
            ["Information collected", "Why we need it"],
            [
              ["Zone (patrol section)", "So we know which area you\u2019re in and can assign you to the right patrol section"],
              ["Street name", "Links you to one of 230+ mapped streets for precise geographic coordination"],
              ["House number", "Identifies your specific property within the street"],
              ["Privacy preference", "You choose whether to be visible to your neighbours on the platform"],
              ["Patrol opt-in", "Indicates your willingness to participate in community patrols"],
              ["Emergency contact", "A secondary person we can reach in an emergency (name, phone, email)"],
              ["WhatsApp preference", "Whether you\u2019d like to receive updates via WhatsApp and your number"],
            ],
            [30, 70],
          ),
          p("After completing the form, you create a secure account with your email and password. The committee reviews and approves your registration, and you receive full platform access."),

          h2("Guest Registration"),
          p("Residents who want basic community awareness without full membership can register as a guest. This is a simplified process that captures WhatsApp preferences only."),

          h2("Digital Membership Card"),
          p("Once approved, every member receives a digital membership card that can be downloaded to their phone. The card shows your name, unique member number, zone, and membership status \u2013 your proof of participation in community safety."),

          h2("Member Dashboard"),
          p("After signing in, every member sees a personalised dashboard showing:"),
          bullet("The 5 most recent incidents in the community"),
          bullet("The next 5 upcoming events"),
          bullet("Events you\u2019ve RSVP\u2019d to"),
          bullet("Quick links to your account, settings, and documents"),
          bullet("A link to the admin console (for committee members only)"),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  6. BUSINESS NETWORKING & SPONSORSHIP
          // ════════════════════════════════════════════════════════════════
          h1("6. Business Networking & Sponsorship"),
          p("The Business Networking Hub creates a structured connection between local businesses and the Plumstead community. It serves three purposes: helping residents discover local services, giving businesses visibility, and creating a revenue channel for community safety operations."),

          h2("6.1 Business Directory"),
          p("A searchable directory of approved local businesses. Residents can filter by:"),
          bullet("Category \u2013 Retail, Services, Food & Dining, Health, or Other"),
          bullet("Zone \u2013 Geographic area within Plumstead"),
          bullet("Search \u2013 Free-text search across business names and descriptions"),
          p("The committee can mark certain businesses as \u201Cfeatured\u201D for prominent placement at the top of the directory."),

          h2("6.2 How Businesses Get Listed"),
          p("Any registered user can submit a business listing through a simple online form. The process works as follows:"),
          numberedLine("1", "Submit", "The business owner fills in the listing form (business name, description, category, contact details)."),
          numberedLine("2", "Review", "The committee reviews the submission for quality and relevance."),
          numberedLine("3", "Approve or decline", "Approved listings appear in the public directory. Declined submissions are communicated back to the owner."),
          numberedLine("4", "Engage", "Once listed, residents can message the business, request introductions, and refer friends."),

          h2("6.3 Connecting Businesses with Residents"),
          p("The platform provides three structured ways for residents and businesses to interact:"),
          bulletBold("Direct messaging \u2013 ", "Residents can send a message to any listed business directly from the listing page. Business owners have a dedicated inbox to manage conversations."),
          bulletBold("Introduction requests \u2013 ", "Residents can request a facilitated introduction to a business. The business owner can accept or decline."),
          bulletBold("Referrals \u2013 ", "Residents can refer friends and family to a business by sharing the listing with a personal message."),

          h2("6.4 Business Events"),
          p("Businesses can host community events linked to their listing \u2013 product launches, workshops, open days. These appear in the business events calendar, and residents can RSVP directly."),

          h2("6.5 Sponsorship Programme"),
          p("Businesses that want deeper community involvement can become sponsors. Three tiers are available:"),
          table(
            ["Tier", "Visibility", "Ideal for"],
            [
              ["Premium", "Logo on the home page, featured in the Business Hub, dedicated listing on the Sponsors page", "Security firms, major local employers, financial institutions"],
              ["Partner", "Featured in the Business Hub and listed on the Sponsors page with logo", "Professional services, retail chains, community organisations"],
              ["Supporter", "Named on the Sponsors page", "Small businesses, individual contributors, project sponsors"],
            ],
            [15, 50, 35],
          ),
          calloutBox("Sponsorship revenue directly funds patrol coordination, CCTV operations, communication tools, and volunteer training. Sponsors gain trusted community visibility while supporting frontline safety operations."),

          h2("6.6 Advertising"),
          p("Businesses interested in website advertising opportunities can contact the committee directly at info@plumsteadwatch.org.za."),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  7. PLATFORM ADMINISTRATION & COMMITTEE MANAGEMENT
          // ════════════════════════════════════════════════════════════════
          h1("7. Platform Administration & Committee Management"),
          p("This is the most important section for the executive committee. It describes every tool available for managing the platform and its community.", { bold: true }),

          h2("7.1 The Admin Console"),
          p("The admin console is the central management hub for committee members. When an authorised committee member signs in, they see a dashboard showing key operational numbers at a glance:"),
          table(
            ["Dashboard metric", "What it tells you"],
            [
              ["Total users", "How many residents have registered on the platform"],
              ["Active users", "How many registered users are currently active"],
              ["Pending members", "How many new registrations are waiting for committee approval"],
              ["Pending business listings", "How many business submissions are waiting for review"],
              ["Total incidents", "How many incidents have been recorded"],
              ["Total events", "How many community events are in the system"],
              ["Total documents", "How many documents are available for download"],
              ["Contact messages", "How many messages have been submitted through the contact form"],
              ["Roles defined", "How many committee roles have been set up"],
            ],
            [30, 70],
          ),
          p("Each metric is a clickable card that takes the administrator directly to the relevant management area."),

          h2("7.2 What Administrators Can Do"),
          p("The admin console provides 11 management areas. Here is what each one does, written from the committee member\u2019s perspective:"),

          h3("Incident Management"),
          p("Status: Fully operational"),
          bullet("View all reported incidents in a sortable, filterable table"),
          bullet("Create new incident records (e.g. when reports come in via phone or WhatsApp)"),
          bullet("Edit existing incident details to correct or update information"),
          bullet("Moderate community-submitted reports for accuracy"),

          h3("Business Listing Approvals"),
          p("Status: Fully operational"),
          bullet("Review all pending business listing submissions"),
          bullet("Approve listings to make them visible in the public directory"),
          bullet("Reject listings that don\u2019t meet quality or relevance standards"),
          bullet("Mark select listings as \u201Cfeatured\u201D for prominent display"),

          h3("Member Approvals"),
          p("Status: Fully operational"),
          bullet("Review all new member registrations awaiting approval"),
          bullet("Approve members to grant them full platform access"),
          bullet("Approved members receive their digital membership card and are counted in zone statistics"),

          h3("Contact Messages"),
          p("Status: Fully operational"),
          bullet("View all messages submitted through the public contact form"),
          bullet("See sender name, email address, and full message text"),
          bullet("Use for follow-up by committee members"),

          h3("User Management"),
          p("Status: Architecture in place, management interface in development"),
          bullet("View all registered users and their details"),
          bullet("Activate or deactivate user accounts"),
          bullet("Assign roles to users (e.g. promote a member to Zone Captain)"),
          bullet("Review user profiles and membership information"),

          h3("Role & Permission Management"),
          p("Status: Architecture in place, management interface in development"),
          bullet("Create custom roles beyond the 5 standard ones"),
          bullet("Assign specific permissions to each role"),
          bullet("Tailor access levels to match committee structure changes"),

          h3("Event Management"),
          p("Status: Architecture in place, management interface in development"),
          bullet("Create new community events with title, venue, date/time, and description"),
          bullet("Edit or cancel existing events"),
          bullet("View RSVP counts for each event"),

          h3("Document Management"),
          p("Status: Architecture in place, management interface in development"),
          bullet("Upload documents for community download (forms, policies, newsletters, financials)"),
          bullet("Organise documents into 8 predefined categories"),
          bullet("Remove outdated documents"),

          h3("Payment Administration"),
          p("Status: Architecture in place, management interface in development"),
          bullet("Track membership payments and donations"),
          bullet("Support for online card payments and manual bank transfers (EFT)"),
          bullet("View payment status (pending, paid, failed) and amounts"),
          bullet("Verify and reconcile payments"),

          h3("Community Broadcast"),
          p("Status: Architecture in place, management interface in development"),
          bullet("Send announcements to all platform members"),
          bullet("Target specific groups or send community-wide messages"),
          bullet("Ideal for safety alerts, meeting reminders, and operational updates"),

          h2("7.3 Committee Roles & Access Levels"),
          p("Not every committee member needs access to everything. The platform provides five roles, each with a tailored set of permissions:"),
          table(
            ["Role", "Who it\u2019s for", "What they can access"],
            [
              ["Member", "All registered residents", "No administrative access. Standard community features only."],
              ["Moderator", "Trusted patrol coordinators", "Admin console access. Can manage incident reports and view contact messages."],
              ["Zone Captain", "Section leaders (one per zone)", "Admin console access. Can approve new member registrations, manage incidents, and view user profiles in their zone."],
              ["Admin", "Committee executives", "Full access to all management areas except role definition. Can manage users, events, documents, businesses, payments, messages, and broadcasts."],
              ["Super Admin", "Chairperson or platform owner", "Unrestricted access to everything, including the ability to create and modify roles and permissions."],
            ],
            [15, 25, 60],
          ),

          h2("7.4 The Permission Matrix"),
          p("The table below shows exactly which permissions each role has. This ensures that every committee member has the access they need \u2013 and nothing more."),
          table(
            ["Permission", "Member", "Moderator", "Zone Captain", "Admin", "Super Admin"],
            [
              ["Access admin console", "", "\u2713", "\u2713", "\u2713", "\u2713"],
              ["View user accounts", "", "", "\u2713", "\u2713", "\u2713"],
              ["Edit user accounts & assign roles", "", "", "", "\u2713", "\u2713"],
              ["Create & modify roles", "", "", "", "", "\u2713"],
              ["Manage incidents", "", "\u2713", "\u2713", "\u2713", "\u2713"],
              ["Manage events", "", "", "", "\u2713", "\u2713"],
              ["Manage documents", "", "", "", "\u2713", "\u2713"],
              ["Approve/reject business listings", "", "", "", "\u2713", "\u2713"],
              ["Approve new members", "", "", "\u2713", "\u2713", "\u2713"],
              ["View contact messages", "", "\u2713", "", "\u2713", "\u2713"],
              ["Send community broadcasts", "", "", "", "\u2713", "\u2713"],
            ],
            [35, 11, 13, 14, 13, 14],
          ),
          calloutBox("Zone Captains are a key innovation: they allow the committee to decentralise member approvals across all 7 sections, reducing the bottleneck on the executive committee while maintaining oversight."),

          h2("7.5 Approval Workflows"),
          p("The platform enforces quality control through two approval processes:"),

          h3("New Member Approvals"),
          numberedLine("1", "Resident registers", "Fills in the registration form with zone, street, contact details."),
          numberedLine("2", "Account created", "A secure login is established, but the member is marked as \u201Cpending\u201D."),
          numberedLine("3", "Committee reviews", "The registration appears in the admin console under \u201CMember approvals.\u201D"),
          numberedLine("4", "Approved or deferred", "Once approved, the member gains full access, their digital membership card, and they appear in zone statistics."),

          h3("Business Listing Approvals"),
          numberedLine("1", "Business submitted", "A registered user fills in the business listing form."),
          numberedLine("2", "Review queue", "The listing appears in the admin console under \u201CBusiness approvals\u201D with a \u201CPending\u201D status."),
          numberedLine("3", "Committee decides", "Approved listings go live in the public directory. Rejected listings are removed from the queue."),

          h2("7.6 Getting Started as an Administrator"),
          p("The very first administrator is set up automatically: the committee designates one or more email addresses as \u201Cbootstrap admins.\u201D When someone with that email address signs up, they are automatically granted full Super Admin access. From there, they can assign roles to other committee members through the admin console."),
          p("No technical knowledge is required. The admin console is a web-based interface with clear labels, clickable cards, and intuitive navigation."),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  8. DATA PROTECTION & PRIVACY
          // ════════════════════════════════════════════════════════════════
          h1("8. Data Protection & Privacy"),
          p("Resident trust is essential. The platform implements multiple layers of privacy protection:"),
          bulletBold("Visibility control. ", "Every member chooses whether they are visible to their neighbours on the platform. This is a personal setting that can be changed at any time."),
          bulletBold("Communication consent. ", "WhatsApp opt-in is separate from registration. Members explicitly choose whether to receive WhatsApp messages and provide their number only if they consent."),
          bulletBold("Email preferences. ", "Members can configure which types of email communication they receive."),
          bulletBold("Secondary contact is optional. ", "Emergency contact information is collected only when the member chooses to provide it."),
          bulletBold("Secure accounts. ", "All accounts are protected by industry-standard authentication with support for multi-factor authentication."),
          bulletBold("Input validation. ", "Every form on the platform checks submissions for completeness and correctness before saving, preventing incomplete or malformed data."),
          bulletBold("Legal transparency. ", "Terms of Use, Privacy Policy, and Disclaimer pages are accessible from every page via the site footer."),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  9. QUALITY & RELIABILITY
          // ════════════════════════════════════════════════════════════════
          h1("9. Quality & Reliability"),

          h2("Testing"),
          p("The platform is tested against 11 core user journeys before every release, covering: member registration, guest registration, incident reporting, event RSVP, contact submissions, volunteer interest, vacation watch, scheme inquiries, safety tip browsing, zone map interaction, and admin console operations."),

          h2("Release Process"),
          p("Every update to the platform follows a structured release process:"),
          numberedLine("1", "Automated checks", "Code quality and build verification run automatically."),
          numberedLine("2", "Staging review", "The update is deployed to a staging environment where the committee can preview changes before they go live."),
          numberedLine("3", "Production deployment", "Updates are deployed during designated maintenance windows."),
          numberedLine("4", "Rollback plan", "If any issue is discovered, the platform can be reverted to the previous stable version within minutes."),

          h2("Accessibility"),
          p("The platform is designed to be usable by everyone:"),
          bullet("Works on all modern smartphones, tablets, and desktop computers"),
          bullet("Fast loading even on slower mobile connections"),
          bullet("High-contrast emergency information for critical safety numbers"),
          bullet("Tap-to-call on all phone numbers for mobile users"),
          bullet("Respects device settings for reduced motion (animations)"),
          bullet("Printable pages for offline distribution"),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  10. COMMUNITY IMPACT
          // ════════════════════════════════════════════════════════════════
          h1("10. Community Impact"),
          p("The platform\u2019s value is measured against international community indicators (ISO 37120/37122/37123) used by cities worldwide to assess quality of life, smart city readiness, and community resilience."),

          h2("Safety & Security"),
          table(
            ["What the platform provides", "How it impacts the community"],
            [
              ["Live incident feed and reporting", "Increases reporting to CVIC and SAPS, directly driving police resource allocation for Plumstead"],
              ["Emergency contact directory", "Residents can call CVIC, SAPS, ambulance, fire, or metro police with a single tap"],
              ["Safety tips library", "Educates residents on crime prevention, reducing opportunities for criminal activity"],
              ["Vacation watch programme", "Properties of absent members receive additional patrol attention"],
              ["Zone map with 7 patrol sections", "Enables geographic coordination of volunteer patrol coverage"],
            ],
            [35, 65],
          ),

          h2("Community Engagement"),
          table(
            ["What the platform provides", "How it impacts the community"],
            [
              ["Event management with RSVP", "Increases participation in meetings, fundraisers, and social events"],
              ["Volunteer recruitment pipeline", "Structures onboarding for patrollers, block captains, coordinators, and committee members"],
              ["Personalised member dashboard", "Every resident sees the information most relevant to their safety"],
              ["Digital membership card", "Creates a tangible sense of community identity and belonging"],
            ],
            [35, 65],
          ),

          h2("Local Economic Development"),
          table(
            ["What the platform provides", "How it impacts the community"],
            [
              ["Business directory", "Increases visibility of local businesses and encourages community spending"],
              ["Sponsorship programme", "Creates structured revenue for community safety operations"],
              ["Business events", "Generates networking opportunities between businesses and residents"],
              ["Referral system", "Facilitates word-of-mouth growth for local businesses"],
            ],
            [35, 65],
          ),

          h2("Governance & Transparency"),
          table(
            ["What the platform provides", "How it impacts the community"],
            [
              ["Public committee directory", "Makes leadership visible and directly contactable"],
              ["Document library", "Financial reports, policies, and newsletters are publicly available"],
              ["Role-based administration", "Distributes responsibility across trained committee members"],
              ["Donation transparency", "Banking details and spending categories are publicly disclosed"],
            ],
            [35, 65],
          ),

          h2("Resilience & Inclusion"),
          table(
            ["What the platform provides", "How it impacts the community"],
            [
              ["Guest registration", "Low-barrier entry point for residents not ready for full membership"],
              ["Mobile-first design", "Full functionality on smartphones \u2013 the primary internet device for many South Africans"],
              ["Start-a-scheme programme", "Extends the neighbourhood watch model to adjacent communities"],
              ["WhatsApp readiness", "Infrastructure is in place to broadcast via SA\u2019s most-used messaging platform"],
            ],
            [35, 65],
          ),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  11. ROADMAP & FUTURE GROWTH
          // ════════════════════════════════════════════════════════════════
          h1("11. Roadmap & Future Growth"),

          h2("What Has Been Delivered"),
          bullet("Complete member and guest registration with zone/street mapping"),
          bullet("Incident reporting and awareness feed"),
          bullet("Community events with RSVP"),
          bullet("Safety tips library with 5 categories"),
          bullet("Interactive zone map with 7 sections and 230+ streets"),
          bullet("Document library with 8 categories"),
          bullet("Full business networking hub (directory, messaging, events, referrals, introductions)"),
          bullet("Sponsorship and advertising programme"),
          bullet("Committee administration console with role-based access"),
          bullet("Vacation watch and volunteer management"),
          bullet("Help centre, legal pages, and donation page"),

          h2("Coming Next"),
          bullet("Expanded admin interfaces for user management, event creation, document uploads, and payment tracking"),
          bullet("Document category filtering and search"),

          h2("Future Enhancements"),
          bulletBold("WhatsApp broadcasts \u2013 ", "Send safety alerts and updates directly to opted-in members via WhatsApp."),
          bulletBold("Online payments \u2013 ", "Pay membership fees and event registrations directly through the platform via card or mobile money."),
          bulletBold("Analytics dashboard \u2013 ", "Track incident trends, membership growth, event attendance, and business directory engagement over time."),
          bulletBold("Push notifications \u2013 ", "Real-time mobile alerts for new incidents and event reminders."),
          bulletBold("Neighbour directory \u2013 ", "Connect with verified neighbours in your section (with privacy controls)."),
          bulletBold("Community forum \u2013 ", "Discussion space for residents to share information and coordinate locally."),
          bulletBold("Patrol booking \u2013 ", "Schedule and manage patrol shifts through the platform."),
          bulletBold("Multi-area support \u2013 ", "Extend the platform to serve additional neighbourhood watch organisations beyond Plumstead."),
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  APPENDIX A
          // ════════════════════════════════════════════════════════════════
          h1("Appendix A \u2013 Emergency Contacts & Committee Directory"),

          h2("Executive Committee"),
          table(
            ["Role", "Name", "Phone", "Email"],
            [
              ["Chairperson", "Anthea Klugman", "072 675 9777", "chairperson@mypnw.org.za"],
              ["Assistant Chairperson", "Brenda Besterfield", "084 589 1702", "assistantchairperson@mypnw.org.za"],
              ["Operations Manager", "Jarryd Munro", "078 457 2313", "ops.manager@mypnw.org.za"],
              ["Secretary", "Sharon Botes", "079 469 9885", "secretary@mypnw.org.za"],
              ["Treasurer", "Glynnis Okkers", "072 470 3136", "treasurer@mypnw.org.za"],
            ],
            [22, 22, 20, 36],
          ),

          h2("Emergency Contacts"),
          table(
            ["Service", "Number"],
            [
              ["CVIC (24-hour crime reporting)", "0860 002 669"],
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
          pb(),

          // ════════════════════════════════════════════════════════════════
          //  APPENDIX B
          // ════════════════════════════════════════════════════════════════
          h1("Appendix B \u2013 Current Sponsors"),
          table(
            ["Sponsor", "Tier", "Website"],
            [
              ["ADT Security", "Premium", "www.adt.co.za"],
              ["Combat Force", "Premium", "combatforce.co.za"],
              ["Zone Security Services", "Partner", "\u2014"],
              ["Ooba Solar", "Partner", "www.ooba.co.za"],
              ["Tammy Frankland", "Supporter", "\u2014"],
              ["Lance Gordon", "Supporter", "\u2014"],
            ],
            [35, 20, 45],
          ),
          divider(),
          new Paragraph({
            spacing: { before: 200, after: 0 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "This document was prepared for the PNW Executive Committee in accordance with the UNDP/People Powered Digital Participation Platform Guide (2025) and ISO 37120/37122/37123 community impact indicators. All capabilities described have been verified against the live platform as of March 2026.",
                font: FONT,
                size: 17,
                color: MUTED,
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = "docs/PNW_Platform_Service_Overview.docx";
  await writeFile(outPath, buffer);
  console.log(`Generated: ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

generate().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
