import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { AdminDocumentForm } from "../document-form";

export default async function AdminNewDocumentPage() {
  const categories = await prisma.documentCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/documents">&lt;- Back</Link>
        </Button>
      </div>
      <h2 className="font-display text-xl font-semibold">Add document</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a document with name, category, and file URL.
      </p>
      <div className="mt-6 max-w-md">
        <AdminDocumentForm categories={categories} />
      </div>
    </section>
  );
}
