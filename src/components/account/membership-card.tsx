import Image from "next/image";
import { Shield } from "lucide-react";

type MembershipCardProps = {
  firstName: string | null;
  lastName: string | null;
  zone: { name: string } | null;
  street: { name: string } | null;
  houseNumber: string | null;
  memberNumber: number;
  memberSince: Date;
  profileImageUrl: string | null;
};

function formatMemberNumber(n: number): string {
  return `PNW-${String(n).padStart(5, "0")}`;
}

export function MembershipCard({
  firstName,
  lastName,
  zone,
  street,
  houseNumber,
  memberNumber,
  memberSince,
  profileImageUrl,
}: MembershipCardProps) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Member";
  const addressParts = [houseNumber, street?.name].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join(" ") : null;
  const zoneName = zone?.name ?? null;
  const currentYear = new Date().getFullYear();
  const sinceYear = new Date(memberSince).getFullYear();
  const initials = [firstName?.[0], lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div
      id="membership-card"
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[var(--shadow-elevation-3)]"
      style={{ aspectRatio: "85.6 / 53.98" }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      {/* Top accent stripe */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary to-accent" />

      <div className="absolute inset-0 flex flex-col p-4 pt-4 md:p-5 md:pt-5">
        {/* Header row: logo + org name */}
        <div className="flex items-center justify-between gap-2">
          <div className="relative h-8 w-20 shrink-0 md:h-10 md:w-24">
            <Image
              src="/images/full%20logo.jpg"
              alt="Plumstead Neighbourhood Watch"
              fill
              className="object-contain object-left"
              sizes="96px"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary md:text-[10px]">
              {currentYear} Member
            </span>
          </div>
        </div>

        {/* Member info row */}
        <div className="mt-auto flex items-end gap-3">
          {/* Profile photo */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-muted md:h-14 md:w-14">
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt={fullName}
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-bold text-primary">
                {initials || "?"}
              </div>
            )}
          </div>

          {/* Name + details */}
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="truncate font-display text-base font-bold leading-tight text-foreground md:text-lg">
              {fullName}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0 text-[10px] text-muted-foreground md:text-xs">
              {address && <span>{address}</span>}
              {zoneName && (
                <span className="font-medium text-primary">
                  {zoneName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer: member number + validity + hotline */}
        <div className="mt-2.5 flex items-center justify-between rounded-lg border border-border/40 bg-muted/50 px-3 py-1.5">
          <div className="space-y-px">
            <p className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground md:text-[9px]">
              Member No.
            </p>
            <p className="font-mono text-[11px] font-bold tracking-wide text-foreground md:text-xs">
              {formatMemberNumber(memberNumber)}
            </p>
          </div>
          <div className="space-y-px text-center">
            <p className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground md:text-[9px]">
              Since
            </p>
            <p className="font-mono text-[11px] font-bold text-foreground md:text-xs">
              {sinceYear}
            </p>
          </div>
          <div className="space-y-px text-right">
            <p className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground md:text-[9px]">
              Incidents
            </p>
            <p className="text-[10px] font-bold text-accent md:text-[11px]">
              0860 002 669
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
