"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIntroRequest } from "../../actions";
import { businessIntroRequestSchema, type BusinessIntroRequestInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

type Schema = BusinessIntroRequestInput;

export function IntroRequestForm({ listingId, listingName }: { listingId: string; listingName: string }) {
  const router = useRouter();

  const form = useForm<Schema>({
    resolver: zodResolver(businessIntroRequestSchema),
    defaultValues: {
      targetListingId: listingId,
      message: "",
    },
  });

  async function onSubmit(values: Schema) {
    const result = await createIntroRequest(values);
    if (result.ok) {
      toast.success("Intro request sent.");
      router.push(`/business/${listingId}`);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your message to {listingName}</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Describe your business, partnership interest, or how you'd like to connect..."
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send intro request"}
        </Button>
      </form>
    </Form>
  );
}
