import Image from "next/image";

type MembershipCardProps = {
  firstName: string | null;
  lastName: string | null;
  zone: { name: string } | null;
  street: { name: string } | null;
  houseNumber: string | null;
};

export function MembershipCard({
  firstName,
  lastName,
  zone,
  street,
  houseNumber,
}: MembershipCardProps) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Member";
  const addressParts = [houseNumber, street?.name].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join(" ") : null;
  const zoneName = zone?.name ?? null;

  return (
    <div
      id="membership-card"
      className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-[var(--shadow-elevation-3)]"
      style={{ aspectRatio: "85.6 / 53.98" }}
    >
      <div className="absolute inset-0 flex flex-col p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative h-10 w-24 shrink-0 md:h-12 md:w-28">
            <Image
              src="/images/header%20logo.jpg"
              alt="PNW"
              fill
              className="object-contain object-left"
              sizes="112px"
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary md:text-xs">
              Plumstead
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary md:text-xs">
              Neighborhood Watch
            </p>
          </div>
        </div>

        {/* Member details */}
        <div className="mt-auto space-y-1">
          <p className="font-display text-lg font-bold text-foreground md:text-xl">
            {fullName}
          </p>
          {address && (
            <p className="text-sm text-muted-foreground">{address}</p>
          )}
          {zoneName && (
            <p className="text-xs text-muted-foreground">Zone: {zoneName}</p>
          )}
        </div>

        {/* Footer strip */}
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent/30 bg-alert-muted/80 px-3 py-2">
          <p className="text-[10px] font-semibold text-accent md:text-xs">
            Report incidents: CVIC 0860 002 669
          </p>
        </div>
      </div>
    </div>
  );
}
