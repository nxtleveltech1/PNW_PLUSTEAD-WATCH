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
import { submitVacationWatch } from "./actions";
import { vacationWatchSchema, type VacationWatchInput } from "@/lib/schemas";

type Schema = VacationWatchInput;

export function VacationWatchForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(vacationWatchSchema),
    defaultValues: {
      name: "",
      address: "",
      contactPhone: "",
      awayFrom: "",
      awayUntil: "",
      emergencyContact: "",
      specialInstructions: "",
    },
  });

  async function onSubmit(values: Schema) {
    const res = await submitVacationWatch(values);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Registered. Our team will be in touch.");
    form.reset({
      name: "",
      address: "",
      contactPhone: "",
      awayFrom: "",
      awayUntil: "",
      emergencyContact: "",
      specialInstructions: "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact number</FormLabel>
              <FormControl>
                <Input placeholder="082 123 4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="awayFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Away from</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="awayUntil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Away until</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency contact (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name and number"
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
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special instructions (optional)</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="e.g. Pets, keys, alarm code"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </Form>
  );
}
