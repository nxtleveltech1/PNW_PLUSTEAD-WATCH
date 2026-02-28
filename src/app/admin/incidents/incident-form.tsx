"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { createIncident, updateIncident } from "./actions";
import { adminIncidentSchema, type AdminIncidentInput } from "@/lib/schemas";

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

type AdminIncidentFormProps = {
  zones: { id: string; name: string }[];
  incident?: {
    id: string;
    type: string;
    location: string;
    dateTime: Date;
    zoneId: string | null;
  };
};

export function AdminIncidentForm({ zones, incident }: AdminIncidentFormProps) {
  const router = useRouter();
  const isEdit = !!incident;

  const form = useForm<AdminIncidentInput>({
    resolver: zodResolver(adminIncidentSchema),
    defaultValues: incident
      ? {
          type: incident.type,
          location: incident.location,
          dateTime: incident.dateTime.toISOString().slice(0, 16),
          zoneId: incident.zoneId ?? undefined,
        }
      : {
          type: "",
          location: "",
          dateTime: new Date().toISOString().slice(0, 16),
          zoneId: undefined,
        },
  });

  async function onSubmit(values: AdminIncidentInput) {
    const dateTime = new Date(values.dateTime).toISOString();
    const result = isEdit
      ? await updateIncident(incident.id, { ...values, dateTime })
      : await createIncident({ ...values, dateTime });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(isEdit ? "Incident updated." : "Incident created.");
    router.push("/admin/incidents");
    router.refresh();
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
        <FormField
          control={form.control}
          name="zoneId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zone (optional)</FormLabel>
              <FormControl>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                >
                  <option value="">—</option>
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
        <div className="flex gap-2">
          <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
