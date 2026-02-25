"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { submitBusinessReferral } from "../actions";
import { businessReferralSchema, type BusinessReferralInput } from "@/lib/schemas";
import type { BusinessListing } from "@prisma/client";

type Schema = BusinessReferralInput;

export function ReferralForm({
  listings,
  preselectedListingId,
}: {
  listings: BusinessListing[];
  preselectedListingId: string | null;
}) {
  const form = useForm<Schema>({
    resolver: zodResolver(businessReferralSchema),
    defaultValues: {
      listingId: preselectedListingId ?? (listings[0]?.id ?? ""),
      referredName: "",
      referredEmail: "",
      message: "",
    },
  });

  async function onSubmit(values: Schema) {
    const result = await submitBusinessReferral({
      ...values,
      message: values.message ?? undefined,
    });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Referral submitted. Thank you!");
    form.reset({
      listingId: preselectedListingId ?? listings[0]?.id ?? "",
      referredName: "",
      referredEmail: "",
      message: "",
    });
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        No approved listings available for referrals yet.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="listingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business to refer</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {listings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
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
          name="referredName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Their name</FormLabel>
              <FormControl>
                <Input placeholder="Friend or family member's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referredEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Their email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="their@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (optional)</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Why you're referring them..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit referral"}
        </Button>
      </form>
    </Form>
  );
}
