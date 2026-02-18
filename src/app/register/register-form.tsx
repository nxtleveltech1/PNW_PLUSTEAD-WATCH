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

const registerFormSchema = registrationPreparationSchema.pick({
  zoneId: true,
  whatsappOptIn: true,
  whatsappPhone: true,
});

type Schema = Omit<z.infer<typeof registerFormSchema>, "memberType">;

type Zone = { id: string; name: string };

export function RegisterForm({
  memberType,
  zones,
  defaultZoneId,
}: {
  memberType: MemberType;
  zones: Zone[];
  defaultZoneId?: string | null;
}) {
  const form = useForm<Schema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      zoneId: defaultZoneId ?? zones[0]?.id ?? null,
      whatsappOptIn: false,
      whatsappPhone: null,
    },
  });

  async function onSubmit(values: Schema) {
    await prepareRegistration({
      zoneId: memberType === "MEMBER" ? (values.zoneId ?? null) : null,
      memberType,
      whatsappOptIn: values.whatsappOptIn,
      whatsappPhone: values.whatsappOptIn && values.whatsappPhone ? values.whatsappPhone : null,
    });
  }

  const whatsappOptIn = form.watch("whatsappOptIn");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {memberType === "MEMBER" && zones.length > 0 && (
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
        <Button type="submit" className="w-full">
          Continue to sign up
        </Button>
      </form>
    </Form>
  );
}
