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
import { sendBusinessConversationMessage } from "@/lib/messaging";
import { businessMessageSchema, type BusinessMessageInput } from "@/lib/schemas";

type Schema = BusinessMessageInput;

export function MessageForm({
  listingId,
  listingName,
}: {
  listingId: string;
  listingName: string;
}) {
  const form = useForm<Schema>({
    resolver: zodResolver(businessMessageSchema),
    defaultValues: { listingId, body: "" },
  });

  async function onSubmit(values: Schema) {
    const result = await sendBusinessConversationMessage(values.listingId, values.body);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(`Message sent to ${listingName}. They'll see it in their inbox.`);
    form.reset({ listingId, body: "" });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem className="min-w-[240px]">
              <FormLabel>{`Message ${listingName}`}</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Your message..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send message"}
        </Button>
      </form>
    </Form>
  );
}
