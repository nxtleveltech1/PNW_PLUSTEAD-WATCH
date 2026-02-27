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
import { Switch } from "@/components/ui/switch";
import { updateEmailPrefs } from "@/app/(auth)/account/actions";
import { emailPrefsSchema } from "@/lib/schemas";
import { toast } from "sonner";

type Schema = z.infer<typeof emailPrefsSchema>;

const prefLabels: Record<keyof Schema, string> = {
  newsItems: "News items",
  events: "Events",
  incidentsInZone: "Incidents in your zone",
  incidentsOtherZones: "Incidents from other zones",
  affiliatedWatches: "Incidents from affiliated watches",
  adHoc: "Ad-hoc emails",
  frequency: "Frequency",
};

type SettingsFormProps = {
  initialPrefs: Record<string, unknown>;
};

export function SettingsForm({ initialPrefs }: SettingsFormProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(emailPrefsSchema),
    defaultValues: {
      newsItems: Boolean(initialPrefs.newsItems),
      events: Boolean(initialPrefs.events),
      incidentsInZone: Boolean(initialPrefs.incidentsInZone),
      incidentsOtherZones: Boolean(initialPrefs.incidentsOtherZones),
      affiliatedWatches: Boolean(initialPrefs.affiliatedWatches),
      adHoc: Boolean(initialPrefs.adHoc),
      frequency: (initialPrefs.frequency as Schema["frequency"]) ?? "immediately",
    },
  });

  async function onSubmit(values: Schema) {
    const result = await updateEmailPrefs(values);
    if (result.ok) {
      toast.success("Settings updated");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold">Email notifications</h3>
          <p className="text-sm text-muted-foreground">
            Choose which types of emails you want to receive.
          </p>
          <div className="space-y-4">
            {(
              [
                "newsItems",
                "events",
                "incidentsInZone",
                "incidentsOtherZones",
                "affiliatedWatches",
                "adHoc",
              ] as const
            ).map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <FormLabel className="font-normal">
                      {prefLabels[name]}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery frequency</FormLabel>
              <FormControl>
                <select
                  className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  value={field.value ?? "immediately"}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value as "immediately" | "weekly" | "monthly"
                    )
                  }
                >
                  <option value="immediately">Immediately</option>
                  <option value="weekly">Weekly digest</option>
                  <option value="monthly">Monthly digest</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
