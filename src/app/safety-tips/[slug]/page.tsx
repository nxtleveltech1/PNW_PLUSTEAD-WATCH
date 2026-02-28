import { notFound } from "next/navigation";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { PageShell } from "@/components/layout/page-shell";
import { prisma } from "@/lib/db";

export default async function SafetyTipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tip = await prisma.safetyTip.findUnique({ where: { slug } });
  if (!tip) notFound();

  const parts = tip.content.split(/\n## /);
  const intro =
    parts[0]?.trim() && !parts[0].trim().startsWith("##")
      ? parts[0].trim()
      : null;

  const sections = parts
    .filter((part, index) => index > 0 || part.trim().startsWith("##"))
    .map((part) => {
      const cleaned = part.replace(/^##\s*/, "");
      const [title, ...body] = cleaned.split("\n");
      return { title: title?.trim() ?? "", body: body.join("\n").trim() };
    });

  return (
    <PageShell>
      <BreadcrumbNav items={[{ label: "Safety Tips", href: "/safety-tips" }, { label: tip.title }]} />

      <article className="panel mt-5 max-w-4xl">
          <header className="panel-header">
            <h1 className="font-display text-3xl font-bold">{tip.title}</h1>
            {tip.summary && <p className="mt-2 max-w-3xl text-muted-foreground">{tip.summary}</p>}
          </header>
          <div className="space-y-6 px-6 py-6">
            {intro && <p className="text-muted-foreground">{intro}</p>}
            {sections.map((section) => (
              <section key={section.title} className="rounded-xl border border-border/70 bg-background/65 p-5">
                <h2 className="font-display text-xl font-semibold">{section.title}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </div>
        </article>
    </PageShell>
  );
}
