"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
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
import { sendDirectMessage } from "@/lib/messaging";
import { composeMessageSchema, type ComposeMessageInput } from "@/lib/schemas";
import { RecipientSearch } from "./recipient-search";

export default function ComposePage() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState("");

  const form = useForm<ComposeMessageInput>({
    resolver: zodResolver(composeMessageSchema),
    defaultValues: { recipientId: "", subject: "", body: "" },
  });

  async function onSubmit(values: ComposeMessageInput) {
    const result = await sendDirectMessage(values.recipientId, values.subject, values.body);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Message sent.");
    router.push(`/account/inbox/${result.data?.conversationId}`);
  }

  return (
    <section>
      <div className="flex items-center gap-3 border-b pb-3">
        <Link
          href="/account/inbox"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to inbox</span>
        </Link>
        <h2 className="font-display text-lg font-semibold">New Message</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 max-w-2xl space-y-4">
          <FormField
            control={form.control}
            name="recipientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <RecipientSearch
                    value={field.value}
                    selectedName={recipientName}
                    onChange={(id, name) => {
                      field.onChange(id);
                      setRecipientName(name);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="What's this about?" {...field} />
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
                    className="flex min-h-[120px] w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Write your message..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
