export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

  // Normalize escaped newlines stored as literal \n strings
  const content = tip.content.replace(/\\n/g, "\n");

  return (
    <PageShell>
      <BreadcrumbNav
        items={[{ label: "Safety Tips", href: "/safety-tips" }, { label: tip.title }]}
      />

      <article className="panel mt-5 max-w-4xl">
        <header className="panel-header">
          <h1 className="font-display text-3xl font-bold">{tip.title}</h1>
          {tip.summary && (
            <p className="mt-2 max-w-3xl text-muted-foreground">{tip.summary}</p>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none px-6 py-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-muted-foreground [&_ul]:text-sm [&_ul]:text-muted-foreground [&_li]:leading-7 [&_strong]:text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </PageShell>
  );
}
