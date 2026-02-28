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
import { createDocumentCategory, deleteDocumentCategory } from "./actions";
import { adminDocumentCategorySchema, type AdminDocumentCategoryInput } from "@/lib/schemas";

type CategoriesSectionProps = {
  categories: { id: string; name: string; _count: { docs: number } }[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const router = useRouter();
  const form = useForm<AdminDocumentCategoryInput>({
    resolver: zodResolver(adminDocumentCategorySchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: AdminDocumentCategoryInput) {
    const result = await createDocumentCategory(values);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Category added.");
    form.reset({ name: "" });
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteDocumentCategory(id);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Category deleted.");
    router.refresh();
  }

  return (
    <div>
      <h3 className="font-display text-lg font-semibold">Document categories</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Add or remove categories. Delete only when empty.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-wrap items-end gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="min-w-[200px]">
                <FormLabel>New category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Financials" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add</Button>
        </form>
      </Form>
      {categories.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
            >
              <span className="font-medium">{c.name}</span>
              <span className="text-muted-foreground">({c._count.docs} docs)</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-destructive hover:text-destructive"
                onClick={() => handleDelete(c.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
