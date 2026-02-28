import { z } from "zod";

const optionalText = z.string().trim().optional().nullable();

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});

export const incidentReportSchema = z.object({
  type: z.string().trim().min(2, "Type is required."),
  location: z.string().trim().min(2, "Location is required."),
  dateTime: z
    .string()
    .trim()
    .refine((val) => !Number.isNaN(new Date(val).getTime()), "Invalid date and time."),
});

export const adminIncidentSchema = incidentReportSchema.extend({
  zoneId: z.string().trim().optional().nullable(),
});
export type AdminIncidentInput = z.input<typeof adminIncidentSchema>;

export const adminDocumentCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
});
export type AdminDocumentCategoryInput = z.input<typeof adminDocumentCategorySchema>;

export const adminDocumentSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  categoryId: z.string().trim().min(1, "Category is required."),
  fileUrl: z.string().trim().min(1, "File URL or path is required."),
});
export type AdminDocumentInput = z.input<typeof adminDocumentSchema>;

export const adminEventSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    location: z.string().trim().min(1, "Location is required."),
    startAt: z.string().trim().refine((v) => !Number.isNaN(new Date(v).getTime()), "Invalid start date."),
    endAt: z.string().trim().optional().nullable().transform((v) => (v && v.length > 0 ? v : undefined)),
    content: z.string().trim().optional().nullable(),
  })
  .refine(
    (d) => !d.endAt || new Date(d.endAt).getTime() >= new Date(d.startAt).getTime(),
    { message: "End must be after start.", path: ["endAt"] }
  );
export type AdminEventInput = z.input<typeof adminEventSchema>;

export const volunteerInterestSchema = z.object({
  name: z.string().trim().min(1, "Name required"),
  email: z.string().trim().email("Valid email required"),
  phone: optionalText,
  roleInterest: z.string().trim().min(1, "Select a role"),
  zoneId: optionalText,
  availability: optionalText,
  message: optionalText,
});

export const vacationWatchSchema = z
  .object({
    name: z.string().trim().min(1, "Name required"),
    address: z.string().trim().min(1, "Address required"),
    contactPhone: z.string().trim().min(1, "Contact number required"),
    awayFrom: z.string().min(1, "Start date required"),
    awayUntil: z.string().min(1, "End date required"),
    emergencyContact: optionalText,
    specialInstructions: optionalText,
  })
  .refine((data) => !Number.isNaN(new Date(data.awayFrom).getTime()), {
    message: "Invalid start date",
    path: ["awayFrom"],
  })
  .refine((data) => !Number.isNaN(new Date(data.awayUntil).getTime()), {
    message: "Invalid end date",
    path: ["awayUntil"],
  })
  .refine((data) => data.awayUntil > data.awayFrom, {
    message: "End date must be after start date",
    path: ["awayUntil"],
  });

export const schemeInquirySchema = z.object({
  name: z.string().trim().min(1, "Name required"),
  email: z.string().trim().email("Valid email required"),
  phone: optionalText,
  address: optionalText,
  message: optionalText,
});

export const emailPrefsSchema = z.object({
  receiveEmail: z.boolean().optional(),
  newsItems: z.boolean().optional(),
  newsFreq: z.enum(["immediately", "weekly", "monthly"]).optional(),
  events: z.boolean().optional(),
  eventsFreq: z.enum(["immediately", "weekly", "monthly"]).optional(),
  incidentsInZone: z.boolean().optional(),
  incidentsZoneFreq: z.enum(["immediately", "weekly", "monthly"]).optional(),
  incidentsOtherZones: z.boolean().optional(),
  incidentsOtherFreq: z.enum(["immediately", "weekly", "monthly"]).optional(),
  affiliatedWatches: z.boolean().optional(),
  affiliatedFreq: z.enum(["immediately", "weekly", "monthly"]).optional(),
  adHoc: z.boolean().optional(),
  adHocFreq: z.enum(["immediately", "weekly", "monthly"]).optional(),
  frequency: z.enum(["immediately", "weekly", "monthly"]).optional(),
});

export const registrationPreparationSchema = z.object({
  zoneId: z.string().nullable(),
  memberType: z.enum(["MEMBER", "GUEST"]),
  streetId: z.string().nullable().optional(),
  houseNumber: z.string().trim().nullable().optional(),
  hideFromNeighbours: z.boolean().optional().default(false),
  patrolOptIn: z.boolean().optional().default(false),
  secondaryContactName: z.string().trim().nullable().optional(),
  secondaryContactPhone: z.string().trim().nullable().optional(),
  secondaryContactEmail: z.union([z.string().trim().email(), z.literal("")]).optional().nullable(),
  emailPrefs: emailPrefsSchema.optional(),
  whatsappOptIn: z.boolean(),
  whatsappPhone: z.string().trim().nullable(),
});

export const incidentsSearchParamsSchema = z.object({
  zone: z.string().trim().optional(),
  type: z.string().trim().optional(),
});

export const registerSearchParamsSchema = z.object({
  zone: z.string().trim().optional(),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().trim().optional().nullable(),
  lastName: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((v) => !v || v.length >= 2, "Last name must be at least 2 characters"),
});

export const membershipProfileSchema = z
  .object({
    zoneId: z.string().nullable(),
    section: z.string().nullable().optional(),
    streetId: z.string().nullable().optional(),
    houseNumber: z.string().trim().nullable().optional(),
    hideFromNeighbours: z.boolean(),
    patrolOptIn: z.boolean(),
    secondaryContactName: z.string().trim().nullable().optional(),
    secondaryContactPhone: z.string().trim().nullable().optional(),
    secondaryContactEmail: z.union([z.string().trim().email(), z.literal("")]).optional().nullable(),
    emailPrefs: emailPrefsSchema.optional(),
    whatsappOptIn: z.boolean(),
    whatsappPhone: z.string().trim().nullable(),
  })
  .refine((data) => !data.whatsappOptIn || (data.whatsappPhone && data.whatsappPhone.length > 0), {
    message: "WhatsApp number required when opting in",
    path: ["whatsappPhone"],
  });

export const businessCategoryEnum = z.enum(["RETAIL", "SERVICES", "FOOD", "HEALTH", "OTHER"]);

export const businessListingSchema = z.object({
  name: z.string().trim().min(2, "Business name required"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  category: businessCategoryEnum,
  address: optionalText,
  phone: optionalText,
  email: z.string().trim().email("Valid email required"),
  websiteUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((v) => !v || v === "" || /^https?:\/\//.test(v), "Enter a valid URL"),
  zoneId: z.string().trim().optional().nullable(),
});

export const businessMessageSchema = z.object({
  listingId: z.string().trim().min(1, "Listing required"),
  body: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export const businessEventSchema = z
  .object({
    title: z.string().trim().min(2, "Title required"),
    description: optionalText,
    location: z.string().trim().min(2, "Location required"),
    startAt: z.string().datetime({ message: "Invalid start date" }),
    endAt: z.string().datetime({ message: "Invalid end date" }).optional().nullable(),
    listingId: z.string().trim().optional().nullable(),
  })
  .refine(
    (data) =>
      !data.endAt ||
      !data.startAt ||
      new Date(data.endAt) > new Date(data.startAt),
    { message: "End must be after start", path: ["endAt"] }
  );

export const businessReferralSchema = z.object({
  listingId: z.string().trim().min(1, "Listing required"),
  referredName: z.string().trim().min(2, "Name required"),
  referredEmail: z.string().trim().email("Valid email required"),
  message: optionalText,
});

export const businessListingsSearchParamsSchema = z.object({
  category: businessCategoryEnum.optional(),
  zone: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export const businessIntroRequestSchema = z.object({
  targetListingId: z.string().trim().min(1, "Listing required"),
  message: z.string().trim().min(20, "Message must be at least 20 characters"),
});

export type ContactMessageInput = z.input<typeof contactMessageSchema>;
export type IncidentReportInput = z.input<typeof incidentReportSchema>;
export type VolunteerInterestInput = z.input<typeof volunteerInterestSchema>;
export type VacationWatchInput = z.input<typeof vacationWatchSchema>;
export type SchemeInquiryInput = z.input<typeof schemeInquirySchema>;
export type RegistrationPreparationInput = z.input<typeof registrationPreparationSchema>;
export type ProfileUpdateInput = z.input<typeof profileUpdateSchema>;
export type EmailPrefsInput = z.input<typeof emailPrefsSchema>;
export type MembershipProfileInput = z.input<typeof membershipProfileSchema>;
export type BusinessListingInput = z.input<typeof businessListingSchema>;
export type BusinessMessageInput = z.input<typeof businessMessageSchema>;
export type BusinessEventInput = z.input<typeof businessEventSchema>;
export type BusinessReferralInput = z.input<typeof businessReferralSchema>;
export type BusinessListingsSearchParamsInput = z.input<typeof businessListingsSearchParamsSchema>;
export type BusinessIntroRequestInput = z.input<typeof businessIntroRequestSchema>;

// ── Payments ────────────────────────────────────────────────────────────

export const paystackVerifySchema = z.object({
  reference: z.string().trim().min(1, "Payment reference required"),
});
export type PaystackVerifyInput = z.input<typeof paystackVerifySchema>;

// ── Inbox Messaging ──────────────────────────────────────────────────────

export const composeMessageSchema = z.object({
  recipientId: z.string().trim().min(1, "Recipient is required"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject too long"),
  body: z.string().trim().min(2, "Message must be at least 2 characters").max(5000, "Message too long"),
});
export type ComposeMessageInput = z.input<typeof composeMessageSchema>;

export const replyMessageSchema = z.object({
  conversationId: z.string().trim().min(1, "Conversation is required"),
  body: z.string().trim().min(2, "Message must be at least 2 characters").max(5000, "Message too long"),
});
export type ReplyMessageInput = z.input<typeof replyMessageSchema>;

// ── Admin User CRUD ─────────────────────────────────────────────────────

export const adminUserCreateSchema = z.object({
  email: z.string().trim().email("Valid email required"),
  firstName: z.string().trim().optional().nullable(),
  lastName: z.string().trim().optional().nullable(),
  memberType: z.enum(["MEMBER", "GUEST"]),
  customRoleId: z.string().min(1, "Role is required"),
  zoneId: z.string().trim().optional().nullable(),
  streetId: z.string().trim().optional().nullable(),
  houseNumber: z.string().trim().optional().nullable(),
  isApproved: z.boolean().default(false),
  isActive: z.boolean().default(true),
  patrolOptIn: z.boolean().default(false),
  hideFromNeighbours: z.boolean().default(false),
  secondaryContactName: z.string().trim().optional().nullable(),
  secondaryContactPhone: z.string().trim().optional().nullable(),
  secondaryContactEmail: z.union([z.string().trim().email(), z.literal("")]).optional().nullable(),
  whatsappOptIn: z.boolean().default(false),
  whatsappPhone: z.string().trim().optional().nullable(),
});
export type AdminUserCreateInput = z.input<typeof adminUserCreateSchema>;

export const adminUserUpdateSchema = adminUserCreateSchema.partial().extend({
  customRoleId: z.string().min(1, "Role is required"),
});
export type AdminUserUpdateInput = z.input<typeof adminUserUpdateSchema>;

// ── Admin Role CRUD ─────────────────────────────────────────────────────

export const adminRoleCreateSchema = z.object({
  name: z.string().trim().min(2, "Role name must be at least 2 characters"),
  description: z.string().trim().optional().nullable(),
  permissionKeys: z.array(z.string()).default([]),
});
export type AdminRoleCreateInput = z.input<typeof adminRoleCreateSchema>;

export const adminRoleUpdateSchema = adminRoleCreateSchema;
export type AdminRoleUpdateInput = z.input<typeof adminRoleUpdateSchema>;

// ── Admin Broadcast ─────────────────────────────────────────────────────

export const adminBroadcastSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject too long"),
  body: z.string().trim().min(2, "Message is required").max(10000, "Message too long"),
  targetType: z.enum(["all", "zone", "section"]),
  targetId: z.string().trim().optional(),
});
export type AdminBroadcastInput = z.input<typeof adminBroadcastSchema>;
