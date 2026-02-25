"use client";

import { useRouter } from "next/navigation";
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
import { submitBusinessListing } from "../actions";
import { businessListingSchema, type BusinessListingInput } from "@/lib/schemas";
import type { Zone } from "@prisma/client";

type Schema = BusinessListingInput;

const CATEGORIES = [
  { value: "RETAIL", label: "Retail" },
  { value: "SERVICES", label: "Services" },
  { value: "FOOD", label: "Food & Dining" },
  { value: "HEALTH", label: "Health" },
  { value: "OTHER", label: "Other" },
];

export function BusinessListingForm({ zones }: { zones: Zone[] }) {
  const router = useRouter();
  const form = useForm<Schema>({
    resolver: zodResolver(businessListingSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "OTHER",
      address: "",
      phone: "",
      email: "",
      websiteUrl: "",
      zoneId: null,
    },
  });

  async function onSubmit(values: Schema) {
    const result = await submitBusinessListing({
      ...values,
      websiteUrl: values.websiteUrl && values.websiteUrl !== "" ? values.websiteUrl : null,
      zoneId: values.zoneId ?? null,
    });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Listing submitted. It will be reviewed before appearing in the directory.");
    router.push("/business");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business name</FormLabel>
              <FormControl>
                <Input placeholder="Your business name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Describe your business and what you offer..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input placeholder="+27 ..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Street address" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (optional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {zones.length > 0 && (
          <FormField
            control={form.control}
            name="zoneId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zone (optional)</FormLabel>
                <FormControl>
                  <select
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select zone</option>
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit listing"}
        </Button>
      </form>
    </Form>
  );
}
