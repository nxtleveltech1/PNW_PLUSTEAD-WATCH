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
import { createDocument, updateDocument } from "./actions";
import { adminDocumentSchema, type AdminDocumentInput } from "@/lib/schemas";

type AdminDocumentFormProps = {
  categories: { id: string; name: string }[];
  document?: {
    id: string;
    name: string;
    categoryId: string;
    fileUrl: string;
  };
};

export function AdminDocumentForm({ categories, document }: AdminDocumentFormProps) {
  const router = useRouter();
  const isEdit = !!document;

  const form = useForm<AdminDocumentInput>({
    resolver: zodResolver(adminDocumentSchema),
    defaultValues: document
      ? {
          name: document.name,
          categoryId: document.categoryId,
          fileUrl: document.fileUrl,
        }
      : {
          name: "",
          categoryId: categories[0]?.id ?? "",
          fileUrl: "",
        },
  });

  async function onSubmit(values: AdminDocumentInput) {
    const result = isEdit
      ? await updateDocument(document.id, values)
      : await createDocument(values);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(isEdit ? "Document updated." : "Document created.");
    router.push("/admin/documents");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. AGM Minutes 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File URL or path</FormLabel>
              <FormControl>
                <Input placeholder="https://... or /documents/file.pdf" {...field} />
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
