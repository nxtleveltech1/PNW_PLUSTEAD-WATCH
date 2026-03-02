export function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? "space-y-12 md:space-y-24"}>{children}</div>
  );
}
