"use client";

import Image from "next/image";
import Barcode from "react-barcode";
import { Shield, Globe, Mail } from "lucide-react";

export type EmergencyContactItem = {
  service: string;
  number: string;
};

type SharedCardProps = {
  firstName: string | null;
  lastName: string | null;
  zone: { name: string } | null;
  street: { name: string } | null;
  houseNumber: string | null;
  memberNumber: number;
  memberSince: Date;
  profileImageUrl: string | null;
  emergencyContacts: EmergencyContactItem[];
};

function formatMemberNumber(n: number): string {
  return `PNW-${String(n).padStart(5, "0")}`;
}

const CARD_STYLE = {
  aspectRatio: "85.6 / 53.98",
} as const;

/* ------------------------------------------------------------------ */
/*  FRONT                                                              */
/* ------------------------------------------------------------------ */

export function MembershipCardFront({
  firstName,
  lastName,
  zone,
  street,
  houseNumber,
  memberNumber,
  memberSince,
  profileImageUrl,
}: SharedCardProps) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Member";
  const addressLine = [houseNumber, street?.name].filter(Boolean).join(" ");
  const zoneName = zone?.name ?? null;
  const currentYear = new Date().getFullYear();
  const sinceYear = new Date(memberSince).getFullYear();
  const initials = [firstName?.[0], lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();
  const memberNum = formatMemberNumber(memberNumber);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[var(--shadow-elevation-3)]"
      style={CARD_STYLE}
    >
      {/* Subtle diagonal pattern */}
      <div className="absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>

      {/* Top accent stripe */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary/90 to-accent" />

      <div className="absolute inset-0 flex flex-col px-5 pb-3.5 pt-4 md:px-6 md:pb-4 md:pt-5">
        {/* Row 1: Logo + year badge */}
        <div className="flex items-start justify-between">
          <div className="relative h-10 w-28 shrink-0 md:h-12 md:w-32">
            <Image
              src="/images/full%20logo.jpg"
              alt="Plumstead Neighbourhood Watch"
              fill
              className="object-contain object-left"
              sizes="128px"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary md:text-[11px]">
              {currentYear} Member
            </span>
          </div>
        </div>

        {/* Row 2: Profile photo + member details */}
        <div className="mt-auto flex items-end gap-4">
          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 border-primary/20 bg-muted shadow-sm md:h-20 md:w-20">
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt={fullName}
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-bold text-primary md:text-xl">
                {initials || "?"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate font-display text-lg font-bold leading-tight text-foreground md:text-xl">
              {fullName}
            </p>
            {addressLine && (
              <p className="truncate text-[11px] leading-tight text-muted-foreground md:text-xs">
                {addressLine}
                {zoneName ? `, ${zoneName}` : ""}
              </p>
            )}
            {!addressLine && zoneName && (
              <p className="text-[11px] text-muted-foreground md:text-xs">
                {zoneName}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Footer stats bar */}
        <div className="mt-2.5 grid grid-cols-3 items-center rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5">
          <div>
            <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:text-[8px]">
              Member No.
            </p>
            <p className="font-mono text-[11px] font-bold leading-tight tracking-wide text-foreground md:text-xs">
              {memberNum}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:text-[8px]">
              Since
            </p>
            <p className="font-mono text-[11px] font-bold leading-tight text-foreground md:text-xs">
              {sinceYear}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:text-[8px]">
              Valid thru
            </p>
            <p className="font-mono text-[11px] font-bold leading-tight text-foreground md:text-xs">
              Dec {currentYear}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BACK                                                               */
/* ------------------------------------------------------------------ */

export function MembershipCardBack({
  memberNumber,
  emergencyContacts,
}: SharedCardProps) {
  const memberNum = formatMemberNumber(memberNumber);
  const topContacts = emergencyContacts.slice(0, 6);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[var(--shadow-elevation-3)]"
      style={CARD_STYLE}
    >
      {/* Bottom accent stripe */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-primary via-primary/90 to-accent" />

      <div className="absolute inset-0 flex flex-col px-5 pb-4 pt-3.5 md:px-6 md:pb-5 md:pt-4">
        {/* Row 1: Small logo + org name */}
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 shrink-0 md:h-7 md:w-7">
            <Image
              src="/images/header%20logo.jpg"
              alt="PNW"
              fill
              className="object-contain"
              sizes="28px"
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary md:text-[11px]">
            Plumstead Neighbourhood Watch
          </p>
        </div>

        {/* Row 2: Barcode */}
        <div className="mt-2 flex justify-center">
          <Barcode
            value={memberNum}
            format="CODE128"
            width={1.3}
            height={36}
            displayValue={true}
            fontSize={10}
            margin={0}
            background="transparent"
            lineColor="#1a2744"
            textMargin={2}
            font="monospace"
          />
        </div>

        {/* Row 3: Emergency contacts */}
        <div className="mt-auto">
          <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.12em] text-accent md:text-[9px]">
            Emergency Contacts
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-px">
            {topContacts.map((c) => (
              <div
                key={c.service}
                className="flex items-baseline justify-between gap-1"
              >
                <span className="truncate text-[9px] text-muted-foreground md:text-[10px]">
                  {c.service}
                </span>
                <span className="shrink-0 font-mono text-[9px] font-semibold text-foreground md:text-[10px]">
                  {c.number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Org details */}
        <div className="mt-2 flex items-center justify-between border-t border-border/30 pt-1.5">
          <div className="flex items-center gap-3 text-[9px] text-muted-foreground md:text-[10px]">
            <span className="flex items-center gap-1">
              <Globe className="h-2.5 w-2.5" />
              plumsteadwatch.org.za
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-2.5 w-2.5" />
              info@plumsteadwatch.org.za
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
