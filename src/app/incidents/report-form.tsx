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
import { reportIncident } from "./actions";
import { incidentReportSchema, type IncidentReportInput } from "@/lib/schemas";

type Schema = IncidentReportInput;

const INCIDENT_TYPES = [
  "Theft",
  "Theft Cables",
  "Theft Common",
  "Theft out/from M/Vehicle",
  "Arrest",
  "Burglary",
  "Robbery",
  "Other",
];

export function ReportIncidentForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: {
      type: "",
      location: "",
      dateTime: new Date().toISOString().slice(0, 16),
    },
  });

  async function onSubmit(values: Schema) {
    const result = await reportIncident({
      ...values,
      dateTime: new Date(values.dateTime).toISOString(),
    });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Incident reported. Thank you.");
    form.reset({ type: "", location: "", dateTime: new Date().toISOString().slice(0, 16) });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="">Select type...</option>
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. MAIN RD 1-174" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Report incident</Button>
      </form>
    </Form>
  );
}
