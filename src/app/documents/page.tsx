import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { FileText } from "lucide-react";

export default async function DocumentsPage() {
  const categories = await prisma.documentCategory.findMany({
    include: { docs: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Documents</p>
          <h1 className="section-heading mt-2">Operational Documents and Forms</h1>
          <p className="section-subheading">Downloads arranged by category for members and residents.</p>
        </div>
        <div className="mt-12 space-y-10">
          {categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
              No documents yet.
            </div>
          ) : (
            categories.map((cat) => (
              <section key={cat.id}>
                <h2 className="font-display text-lg font-semibold text-foreground">{cat.name}</h2>
                <div className="mt-4 space-y-2">
                  {cat.docs.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border-0 bg-card px-5 py-3 shadow-elevation-1 transition-all hover:shadow-elevation-2"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </span>
                      <span className="font-medium text-foreground group-hover:text-primary">{doc.name}</span>
                    </a>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
