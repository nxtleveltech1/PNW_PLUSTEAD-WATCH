import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  heading,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, hsl(var(--primary) / 0.04), transparent 60%)",
        }}
      />
      <div className="relative">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
          {heading}
        </h3>
        {description && (
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {actionLabel && actionHref && (
          <Button asChild className="mt-5" size="sm">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
