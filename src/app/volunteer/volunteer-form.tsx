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
import { submitVolunteerInterest } from "./actions";
import { volunteerInterestSchema, type VolunteerInterestInput } from "@/lib/schemas";

type Schema = VolunteerInterestInput;

type Zone = { id: string; name: string };

export function VolunteerForm({ zones }: { zones: Zone[] }) {
  const form = useForm<Schema>({
    resolver: zodResolver(volunteerInterestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roleInterest: "",
      zoneId: zones[0]?.id ?? "",
      availability: "",
      message: "",
    },
  });

  async function onSubmit(values: Schema) {
    const res = await submitVolunteerInterest(values);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Thank you! We'll be in touch.");
    form.reset({
      name: "",
      email: "",
      phone: "",
      roleInterest: "",
      zoneId: zones[0]?.id ?? "",
      availability: "",
      message: "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
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
                <Input type="email" placeholder="you@example.com" {...field} />
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
                <Input
                  placeholder="082 123 4567"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role interest</FormLabel>
              <FormControl>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="patroller">Patroller</option>
                  <option value="block-captain">Block captain</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="committee">Committee</option>
                </select>
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
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>{z.name}</option>
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
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Weekends, evenings"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Message (optional)</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Tell us more..."
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto sm:min-w-[200px]">
            Submit application
          </Button>
        </div>
      </form>
    </Form>
  );
}
