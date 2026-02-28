"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendAdminBroadcast, getBroadcastRecipientCount } from "@/lib/messaging";
import { adminBroadcastSchema, type AdminBroadcastInput } from "@/lib/schemas";

type Props = {
  zones: { id: string; name: string }[];
  sections: string[];
};

export function BroadcastForm({ zones, sections }: Props) {
  const [recipientCount, setRecipientCount] = useState<number | null>(null);

  const form = useForm<AdminBroadcastInput>({
    resolver: zodResolver(adminBroadcastSchema),
    defaultValues: { subject: "", body: "", targetType: "all", targetId: "" },
  });

  const targetType = form.watch("targetType");
  const targetId = form.watch("targetId");

  useEffect(() => {
    let cancelled = false;
    getBroadcastRecipientCount(
      targetType as "all" | "zone" | "section",
      targetId || undefined
    ).then((count) => {
      if (!cancelled) setRecipientCount(count);
    });
    return () => {
      cancelled = true;
    };
  }, [targetType, targetId]);

  async function onSubmit(values: AdminBroadcastInput) {
    const result = await sendAdminBroadcast(
      values.subject,
      values.body,
      values.targetType as "all" | "zone" | "section",
      values.targetId || undefined
    );
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(`Broadcast sent to ${result.data?.recipientCount} members.`);
    form.reset({ subject: "", body: "", targetType: "all", targetId: "" });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="targetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send to</FormLabel>
              <Select
                onValueChange={(v) => {
                  field.onChange(v);
                  form.setValue("targetId", "");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All approved members</SelectItem>
                  <SelectItem value="zone">Members in a zone</SelectItem>
                  <SelectItem value="section">Members in a section</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {targetType === "zone" && (
          <FormField
            control={form.control}
            name="targetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zone</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {zones.map((z) => (
                      <SelectItem key={z.id} value={z.id}>
                        {z.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {targetType === "section" && (
          <FormField
            control={form.control}
            name="targetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {recipientCount !== null && (
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {recipientCount === 0
                ? "No recipients match"
                : `${recipientCount} member${recipientCount === 1 ? "" : "s"} will receive this`}
            </span>
          </div>
        )}

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Subject line" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[160px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Write your announcement..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || recipientCount === 0}
          >
            {form.formState.isSubmitting ? "Sending..." : "Send Broadcast"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
