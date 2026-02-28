"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { replyToConversation } from "@/lib/messaging";
import { replyMessageSchema, type ReplyMessageInput } from "@/lib/schemas";

export function ReplyForm({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const form = useForm<ReplyMessageInput>({
    resolver: zodResolver(replyMessageSchema),
    defaultValues: { conversationId, body: "" },
  });

  async function onSubmit(values: ReplyMessageInput) {
    const result = await replyToConversation(values.conversationId, values.body);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    form.reset({ conversationId, body: "" });
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-2 border-t bg-background pt-3"
      >
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem className="min-w-0 flex-1">
              <FormControl>
                <textarea
                  className="flex min-h-[44px] max-h-32 w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Type a reply..."
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="icon"
          className="h-[44px] w-[44px] shrink-0"
          disabled={form.formState.isSubmitting}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </Form>
  );
}
