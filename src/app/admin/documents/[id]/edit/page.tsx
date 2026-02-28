import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { AdminDocumentForm } from "../../document-form";

export default async function AdminEditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) notFound();

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
      <h2 className="font-display text-xl font-semibold">Edit document</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update document details.
      </p>
      <div className="mt-6 max-w-md">
        <AdminDocumentForm
          categories={categories}
          document={{
            id: document.id,
            name: document.name,
            categoryId: document.categoryId,
            fileUrl: document.fileUrl,
          }}
        />
      </div>
    </section>
  );
}
