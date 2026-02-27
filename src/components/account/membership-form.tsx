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

type Schema = z.infer<typeof membershipProfileSchema>;

type Zone = { id: string; name: string };

type UserWithZone = {
  id: string;
  memberType: MemberType;
  zoneId: string | null;
  zone: { id: string; name: string } | null;
  whatsappOptIn: boolean;
  whatsappPhone: string | null;
  isApproved: boolean;
};

export function MembershipForm({
  user,
  zones,
}: {
  user: UserWithZone | null;
  zones: Zone[];
}) {
  const form = useForm<Schema>({
    resolver: zodResolver(membershipProfileSchema),
    defaultValues: {
      zoneId: user?.zoneId ?? zones[0]?.id ?? null,
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

  if (!user) {
    return (
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          Your membership profile is being set up. Please refresh in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-lg font-semibold">PNW Membership</h2>
        <p className="text-sm text-muted-foreground">
          Manage your zone, member type, and notification preferences.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 text-sm">
        <p className="font-medium">Member type</p>
        <p className="text-muted-foreground">{user.memberType}</p>
        {user.zone && (
          <>
            <p className="mt-2 font-medium">Zone</p>
            <p className="text-muted-foreground">{user.zone.name}</p>
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
                      onChange={(e) => field.onChange(e.target.value || null)}
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
                <FormLabel className="font-normal">
                  Opt in to WhatsApp updates
                </FormLabel>
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
