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
  dateTime: z.string().datetime({ message: "Invalid date and time." }),
});

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

export const registrationPreparationSchema = z.object({
  zoneId: z.string().nullable(),
  memberType: z.enum(["MEMBER", "GUEST"]),
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

export type ContactMessageInput = z.input<typeof contactMessageSchema>;
export type IncidentReportInput = z.input<typeof incidentReportSchema>;
export type VolunteerInterestInput = z.input<typeof volunteerInterestSchema>;
export type VacationWatchInput = z.input<typeof vacationWatchSchema>;
export type SchemeInquiryInput = z.input<typeof schemeInquirySchema>;
export type RegistrationPreparationInput = z.input<typeof registrationPreparationSchema>;
