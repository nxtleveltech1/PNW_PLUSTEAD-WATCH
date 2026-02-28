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
import { updateMembershipProfile } from "@/app/(auth)/account/actions";
import { membershipProfileSchema } from "@/lib/schemas";
import type { MemberType } from "@prisma/client";
import { toast } from "sonner";
import {
  MembershipCardFront,
  MembershipCardBack,
  type EmergencyContactItem,
} from "@/components/account/membership-card";
import { MembershipCardDownload } from "@/components/account/membership-card-download";
import { ZONE_SECTIONS } from "@/data/zone-polygons";

type Schema = z.infer<typeof membershipProfileSchema>;

type Zone = { id: string; name: string };
type Street = { id: string; name: string; zoneId: string };

type UserWithZone = {
  id: string;
  memberNumber: number;
  firstName: string | null;
  lastName: string | null;
  memberType: MemberType;
  zoneId: string | null;
  zone: { id: string; name: string; postcodePrefix?: string | null } | null;
  streetId: string | null;
  street: { id: string; name: string } | null;
  houseNumber: string | null;
  section: string | null;
  hideFromNeighbours: boolean;
  patrolOptIn: boolean;
  secondaryContactName: string | null;
  secondaryContactPhone: string | null;
  secondaryContactEmail: string | null;
  whatsappOptIn: boolean;
  whatsappPhone: string | null;
  isApproved: boolean;
  createdAt: Date;
};

export function MembershipForm({
  user,
  zones,
  streets = [],
  profileImageUrl,
  emergencyContacts = [],
}: {
  user: UserWithZone | null;
  zones: Zone[];
  streets?: Street[];
  profileImageUrl?: string | null;
  emergencyContacts?: EmergencyContactItem[];
}) {
  const form = useForm<Schema>({
    resolver: zodResolver(membershipProfileSchema),
    defaultValues: {
      zoneId: user?.zoneId ?? zones[0]?.id ?? null,
      section: user?.section ?? null,
      streetId: user?.streetId ?? null,
      houseNumber: user?.houseNumber ?? null,
      hideFromNeighbours: user?.hideFromNeighbours ?? false,
      patrolOptIn: user?.patrolOptIn ?? false,
      secondaryContactName: user?.secondaryContactName ?? null,
      secondaryContactPhone: user?.secondaryContactPhone ?? null,
      secondaryContactEmail: user?.secondaryContactEmail ?? null,
      whatsappOptIn: user?.whatsappOptIn ?? false,
      whatsappPhone: user?.whatsappPhone ?? null,
    },
  });

  async function onSubmit(values: Schema) {
    const result = await updateMembershipProfile(values);
    if (result.ok) {
      toast.success("Membership updated");
    } else {
      toast.error(result.error);
    }
  }

  const whatsappOptIn = form.watch("whatsappOptIn");
  const canEditZone = user?.memberType === "MEMBER" && zones.length > 0;
  const selectedZoneId = form.watch("zoneId");
  const streetsForZone = selectedZoneId ? streets.filter((s) => s.zoneId === selectedZoneId) : [];

  if (!user) {
    return (
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          Your membership profile is being set up. Please refresh in a moment.
        </p>
      </div>
    );
  }

  const isEligibleForCard =
    user.memberType === "MEMBER" && user.isApproved;
  const downloadFileName = [
    "pnw-membership",
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-lg font-semibold">PNW Membership</h2>
        <p className="text-sm text-muted-foreground">
          Manage your zone, address, and notification preferences.
        </p>
      </div>

      {isEligibleForCard ? (
        <div className="space-y-4">
          <p className="text-sm font-medium">Your digital membership card</p>
          <MembershipCardDownload
            fileName={downloadFileName}
            front={
              <MembershipCardFront
                firstName={user.firstName}
                lastName={user.lastName}
                zone={user.zone}
                street={user.street}
                houseNumber={user.houseNumber}
                section={user.section}
                memberNumber={user.memberNumber}
                memberSince={user.createdAt}
                profileImageUrl={profileImageUrl ?? null}
                emergencyContacts={emergencyContacts}
              />
            }
            back={
              <MembershipCardBack
                firstName={user.firstName}
                lastName={user.lastName}
                zone={user.zone}
                street={user.street}
                houseNumber={user.houseNumber}
                section={user.section}
                memberNumber={user.memberNumber}
                memberSince={user.createdAt}
                profileImageUrl={profileImageUrl ?? null}
                emergencyContacts={emergencyContacts}
              />
            }
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {user.memberType === "GUEST"
            ? "Guest registration does not include a membership card."
            : "Your membership is pending approval. The digital card will appear once approved."}
        </p>
      )}

      <div className="rounded-lg border bg-muted/30 p-4 text-sm">
        <p className="font-medium">Member type</p>
        <p className="text-muted-foreground">{user.memberType}</p>
        {user.zone && (
          <>
            <p className="mt-2 font-medium">Zone</p>
            <p className="text-muted-foreground">{user.zone.name}</p>
          </>
        )}
        {user.section && (
          <>
            <p className="mt-2 font-medium">Section</p>
            <p className="text-muted-foreground">
              {ZONE_SECTIONS.find((s) => s.id === user.section)?.name ?? user.section}
            </p>
          </>
        )}
        {user.street && (
          <>
            <p className="mt-2 font-medium">Street</p>
            <p className="text-muted-foreground">{user.street.name}</p>
          </>
        )}
        {user.houseNumber && (
          <>
            <p className="mt-2 font-medium">House number</p>
            <p className="text-muted-foreground">{user.houseNumber}</p>
          </>
        )}
        <p className="mt-2 font-medium">Status</p>
        <p className="text-muted-foreground">
          {user.isApproved ? "Approved" : "Pending approval"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {canEditZone && (
            <>
              <FormField
                control={form.control}
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
                          form.setValue("streetId", null);
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
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <select
                        id="section"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      >
                        <option value="">Select your section</option>
                        {ZONE_SECTIONS.map((s) => (
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
              {streetsForZone.length > 0 && (
                <FormField
                  control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
            control={form.control}
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
              control={form.control}
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
