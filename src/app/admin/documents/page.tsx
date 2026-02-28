import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { DocumentsTable } from "./documents-table";
import { CategoriesSection } from "./categories-section";

export default async function AdminDocumentsPage() {
  const [categories, documents] = await Promise.all([
    prisma.documentCategory.findMany({
      include: { _count: { select: { docs: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.document.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const rows = documents.map((d) => ({
    id: d.id,
    name: d.name,
    categoryName: d.category.name,
    fileUrl: d.fileUrl,
    createdAt: d.createdAt.toISOString(),
  }));

  return (
    <section className="space-y-12">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Documents</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage document categories and files.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/documents/new">Add document</Link>
          </Button>
        </div>
        <div className="mt-6">
          <DocumentsTable data={rows} />
        </div>
      </div>

      <CategoriesSection categories={categories} />
    </section>
  );
}
