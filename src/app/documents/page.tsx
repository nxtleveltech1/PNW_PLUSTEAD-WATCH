import { Suspense } from "react";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Documents</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Operational Documents and Forms</span>
            </h1>
            <p className="section-subheading">Downloads arranged by category for members and residents.</p>
          </div>
        </AnimateSection>
        {categories.length > 0 && (
          <Suspense fallback={null}>
            <div className="mt-8">
              <DocumentsFilter categories={categories} defaultCategoryId={defaultCategoryId} />
            </div>
          </Suspense>
        )}
        <AnimateSection className="mt-12">
          <div className="space-y-10">
          {filteredCategories.length === 0 ? (
            <AnimateItem>
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
              {categoryId ? "No documents in this category." : "No documents yet."}
            </div>
            </AnimateItem>
          ) : (
            filteredCategories.map((cat) => (
              <AnimateItem key={cat.id}>
              <section>
                <h2 className="font-display text-lg font-semibold text-foreground">{cat.name}</h2>
                <div className="mt-4 space-y-2">
                  {cat.docs.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-elevated group flex items-center gap-4 rounded-2xl border-0 bg-card px-5 py-3"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </span>
                      <span className="font-medium text-foreground group-hover:text-primary">{doc.name}</span>
                    </a>
                  ))}
                </div>
              </section>
              </AnimateItem>
            ))
          )}
          </div>
        </AnimateSection>
      </main>
      <Footer />
    </div>
  );
}
