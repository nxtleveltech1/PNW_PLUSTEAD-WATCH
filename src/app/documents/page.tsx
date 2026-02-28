import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { prisma } from "@/lib/db";
import { FileText } from "lucide-react";
import { DocumentsFilter } from "./documents-filter";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryId } = await searchParams;
  const categories = await prisma.documentCategory.findMany({
    include: { docs: true },
    orderBy: { name: "asc" },
  });

  const filteredCategories = categoryId
    ? categories.filter((c) => c.id === categoryId)
    : categories;
  const defaultCategoryId = categories[0]?.id ?? null;

  return (
    <PageShell>
      <PageHero
        eyebrow="Documents"
        title="Operational Documents and Forms"
        description="Downloads arranged by category for members and residents."
      />

      {categories.length > 0 && (
        <div className="mt-block">
          <Suspense fallback={null}>
            <DocumentsFilter categories={categories} defaultCategoryId={defaultCategoryId} />
          </Suspense>
        </div>
      )}

      <AnimateSection className="mt-section">
        <div className="space-y-10">
          {filteredCategories.length === 0 ? (
            <AnimateItem>
              <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 py-20 text-center text-muted-foreground">
                {categoryId ? "No documents in this category." : "No documents yet."}
              </div>
            </AnimateItem>
          ) : (
            filteredCategories.map((cat) => (
              <AnimateItem key={cat.id}>
                <section>
                  <h2 className="block-title">{cat.name}</h2>
                  <div className="mt-4 space-y-3">
                    {cat.docs.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-elevated group flex items-center gap-4 rounded-2xl border-0 bg-card px-6 py-4"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </span>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {doc.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              </AnimateItem>
            ))
          )}
        </div>
      </AnimateSection>
    </PageShell>
  );
}
