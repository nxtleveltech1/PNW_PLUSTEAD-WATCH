"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { prepareRegistration } from "./actions";
import type { MemberType } from "@prisma/client";
import { registrationPreparationSchema } from "@/lib/schemas";

const memberFormSchema = z.object({
  zoneId: z.string().nullable(),
  streetId: z.string().nullable().optional(),
  houseNumber: z.string().trim().nullable().optional(),
  hideFromNeighbours: z.boolean(),
  patrolOptIn: z.boolean(),
  secondaryContactName: z.string().trim().nullable().optional(),
  secondaryContactPhone: z.string().trim().nullable().optional(),
  secondaryContactEmail: z.union([z.string().trim().email(), z.literal("")]).optional().nullable(),
  emailPrefs: registrationPreparationSchema.shape.emailPrefs,
  whatsappOptIn: z.boolean(),
  whatsappPhone: z.string().trim().nullable(),
});

const guestFormSchema = registrationPreparationSchema.pick({
  emailPrefs: true,
  whatsappOptIn: true,
  whatsappPhone: true,
});

type MemberSchema = z.infer<typeof memberFormSchema>;
type GuestSchema = z.infer<typeof guestFormSchema>;

type Zone = { id: string; name: string };
type Street = { id: string; name: string; zoneId: string };

export function RegisterForm({
  memberType,
  zones,
  streets = [],
  defaultZoneId,
}: {
  memberType: MemberType;
  zones: Zone[];
  streets?: Street[];
  defaultZoneId?: string | null;
}) {
  const isMember = memberType === "MEMBER";
  const zoneStreets = isMember && defaultZoneId ? streets.filter((s) => s.zoneId === defaultZoneId) : [];

  const memberForm = useForm<MemberSchema>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      zoneId: defaultZoneId ?? zones[0]?.id ?? null,
      streetId: null,
      houseNumber: null,
      hideFromNeighbours: false,
      patrolOptIn: false,
      secondaryContactName: null,
      secondaryContactPhone: null,
      secondaryContactEmail: null,
      emailPrefs: undefined,
      whatsappOptIn: false,
      whatsappPhone: null,
    },
  });

  const guestForm = useForm<GuestSchema>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      emailPrefs: undefined,
      whatsappOptIn: false,
      whatsappPhone: null,
    },
  });

  const form = isMember ? memberForm : guestForm;
  const whatsappOptIn = isMember ? memberForm.watch("whatsappOptIn") : guestForm.watch("whatsappOptIn");

  async function onSubmit(values: MemberSchema | GuestSchema) {
    await prepareRegistration({
      zoneId: isMember ? (values as MemberSchema).zoneId ?? null : null,
      memberType,
      streetId: isMember ? (values as MemberSchema).streetId ?? null : null,
      houseNumber: isMember ? (values as MemberSchema).houseNumber ?? null : null,
      hideFromNeighbours: isMember ? (values as MemberSchema).hideFromNeighbours ?? false : false,
      patrolOptIn: isMember ? (values as MemberSchema).patrolOptIn ?? false : false,
      secondaryContactName: isMember ? (values as MemberSchema).secondaryContactName ?? null : null,
      secondaryContactPhone: isMember ? (values as MemberSchema).secondaryContactPhone ?? null : null,
      secondaryContactEmail: isMember
        ? ((values as MemberSchema).secondaryContactEmail === "" ? null : (values as MemberSchema).secondaryContactEmail)
        : null,
      emailPrefs: "emailPrefs" in values ? values.emailPrefs : undefined,
      whatsappOptIn: values.whatsappOptIn,
      whatsappPhone: values.whatsappOptIn && values.whatsappPhone ? values.whatsappPhone : null,
    });
  }

  const selectedZoneId = isMember ? memberForm.watch("zoneId") : null;
  const streetsForZone = isMember && selectedZoneId ? streets.filter((s) => s.zoneId === selectedZoneId) : [];

  return isMember ? (
    <Form {...memberForm}>
      <form onSubmit={memberForm.handleSubmit(onSubmit)} className="space-y-6">
        {zones.length > 0 && (
          <>
            <FormField
              control={memberForm.control}
              name="zoneId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <FormControl>
                    <select
                      id="zoneId"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        field.onChange(e.target.value || null);
                        memberForm.setValue("streetId", null);
                      }}
                    >
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {streetsForZone.length > 0 && (
              <FormField
                control={memberForm.control}
                name="streetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <select
                        id="streetId"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      >
                        <option value="">Select your street</option>
                        {streetsForZone.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={memberForm.control}
              name="houseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House number or name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 42 or Rose Cottage"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={memberForm.control}
              name="hideFromNeighbours"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Hide my details from neighbours</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={memberForm.control}
              name="patrolOptIn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">I am prepared to patrol</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-medium">Emergency contact (optional)</p>
              <p className="text-xs text-muted-foreground">
                Someone we or a neighbour can contact if you cannot be reached at your premises.
              </p>
              <FormField
                control={memberForm.control}
                name="secondaryContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={memberForm.control}
                name="secondaryContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="082 123 4567"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={memberForm.control}
                name="secondaryContactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
        <FormField
          control={memberForm.control}
          name="whatsappOptIn"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="font-normal">Opt in to WhatsApp updates</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {whatsappOptIn && (
          <FormField
            control={memberForm.control}
            name="whatsappPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="082 123 4567"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full">
          Continue to sign up
        </Button>
      </form>
    </Form>
  ) : (
    <Form {...guestForm}>
      <form onSubmit={guestForm.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={guestForm.control}
          name="whatsappOptIn"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="font-normal">Opt in to WhatsApp updates</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {whatsappOptIn && (
          <FormField
            control={guestForm.control}
            name="whatsappPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="082 123 4567"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full">
          Continue to sign up
        </Button>
      </form>
    </Form>
  );
}
