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
import { createEvent, updateEvent } from "./actions";
import { adminEventSchema, type AdminEventInput } from "@/lib/schemas";

type AdminEventFormProps = {
  event?: {
    id: string;
    title: string;
    location: string;
    startAt: Date;
    endAt: Date | null;
    content: string | null;
  };
};

export function AdminEventForm({ event }: AdminEventFormProps) {
  const router = useRouter();
  const isEdit = !!event;

  const toLocalDatetime = (d: Date) => d.toISOString().slice(0, 16);

  const form = useForm<AdminEventInput>({
    resolver: zodResolver(adminEventSchema),
    defaultValues: event
      ? {
          title: event.title,
          location: event.location,
          startAt: toLocalDatetime(event.startAt),
          endAt: event.endAt ? toLocalDatetime(event.endAt) : undefined,
          content: event.content ?? undefined,
        }
      : {
          title: "",
          location: "",
          startAt: new Date().toISOString().slice(0, 16),
          endAt: undefined,
          content: undefined,
        },
  });

  async function onSubmit(values: AdminEventInput) {
    const result = isEdit
      ? await updateEvent(event.id, values)
      : await createEvent(values);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(isEdit ? "Event updated." : "Event created.");
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. PNW AGM" {...field} />
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
                <Input placeholder="e.g. Plumstead Bowling Club" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date & time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date & time (optional)</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (optional)</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  {...field}
                  value={field.value ?? ""}
                />
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
