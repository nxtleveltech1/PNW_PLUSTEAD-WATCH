"use client";

import Image from "next/image";
import Barcode from "react-barcode";
import { ShieldCheck, Globe, Mail } from "lucide-react";

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

function formatJoinedDate(d: Date): string {
  const date = new Date(d);
  const month = date.toLocaleString("en-ZA", { month: "short" }).toUpperCase();
  return `${month} ${date.getFullYear()}`;
}

const CARD_RATIO = { aspectRatio: "85.6 / 53.98" } as const;

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
  const addressParts = [houseNumber, street?.name].filter(Boolean);
  const addressLine =
    addressParts.length > 0
      ? addressParts.join(" ") + (zone?.name ? `, ${zone.name}` : "")
      : null;
  const zoneName = zone?.name ?? null;
  const currentYear = new Date().getFullYear();
  const memberNum = formatMemberNumber(memberNumber);
  const joinedLabel = formatJoinedDate(memberSince);
  const initials = [firstName?.[0], lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elevation-3)]"
      style={{
        ...CARD_RATIO,
        background:
          "linear-gradient(135deg, #0a0e1a 0%, #111827 40%, #0f172a 70%, #1a1025 100%)",
      }}
    >
      {/* Ambient glow effects */}
      <div
        className="absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #ef4444 0%, transparent 70%)" }}
      />

      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: "linear-gradient(90deg, #1e3a5f 0%, #3b82f6 30%, #ef4444 70%, #5b1a1a 100%)",
        }}
      />

      <div className="absolute inset-0 flex">
        {/* Left column: profile photo */}
        <div className="flex w-[38%] items-start p-4 md:p-5">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg">
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt={fullName}
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/40 md:text-3xl">
                {initials || "?"}
              </div>
            )}
          </div>
        </div>

        {/* Right column: member info */}
        <div className="flex w-[62%] flex-col py-4 pr-4 md:py-5 md:pr-5">
          {/* Active member badge */}
          <div className="flex justify-end">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 md:text-[11px]">
                Active Member
              </span>
              <span className="text-[10px] font-bold text-white/50 md:text-[11px]">|</span>
              <span className="text-[10px] font-bold text-white/90 md:text-[11px]">
                {currentYear}
              </span>
            </div>
          </div>

          {/* Name + address */}
          <div className="mt-auto space-y-1">
            <h2 className="truncate font-display text-xl font-bold leading-tight text-white md:text-2xl">
              {fullName}
            </h2>
            {addressLine && (
              <p className="text-xs leading-snug text-white/60 md:text-sm">
                {addressLine}
              </p>
            )}
            {!addressLine && zoneName && (
              <p className="text-xs text-white/60 md:text-sm">{zoneName}</p>
            )}
            {zoneName && addressLine && (
              <p className="text-xs font-medium text-white/50">
                Section: {zoneName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-3 md:px-5 md:pb-4">
        <div className="flex items-end gap-3">
          {/* PNW logo */}
          <div className="relative h-14 w-16 shrink-0 md:h-16 md:w-[72px]">
            <Image
              src="/images/full%20logo.jpg"
              alt="PNW"
              fill
              className="object-contain object-left-bottom"
              sizes="72px"
            />
          </div>

          {/* Stats strip */}
          <div className="flex flex-1 overflow-hidden rounded-lg border border-white/10 bg-white/95">
            <div className="flex-1 px-2.5 py-1.5 md:px-3">
              <p className="text-[7px] font-semibold uppercase tracking-[0.08em] text-red-600 md:text-[8px]">
                Member Number
              </p>
              <p className="font-mono text-[11px] font-bold leading-tight text-gray-900 md:text-xs">
                {memberNum}
              </p>
            </div>
            <div className="flex-1 border-l border-gray-200 px-2.5 py-1.5 md:px-3">
              <p className="text-[7px] font-semibold uppercase tracking-[0.08em] text-gray-500 md:text-[8px]">
                Joined
              </p>
              <p className="font-mono text-[11px] font-bold leading-tight text-gray-900 md:text-xs">
                {joinedLabel}
              </p>
            </div>
            <div className="flex-1 border-l border-gray-200 px-2.5 py-1.5 md:px-3">
              <p className="text-[7px] font-semibold uppercase tracking-[0.08em] text-gray-500 md:text-[8px]">
                Expiry
              </p>
              <p className="font-mono text-[11px] font-bold leading-tight text-gray-900 md:text-xs">
                DEC 31, {currentYear}
              </p>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-1.5 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 md:text-[9px]">
          Neighbourhood Watch &bull; Stronger Together
        </p>
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
  const topContacts = emergencyContacts.slice(0, 8);

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elevation-3)]"
      style={{
        ...CARD_RATIO,
        background:
          "linear-gradient(135deg, #0a0e1a 0%, #111827 40%, #0f172a 70%, #1a1025 100%)",
      }}
    >
      {/* Bottom accent line */}
      <div
        className="absolute inset-x-0 bottom-0 h-[3px]"
        style={{
          background: "linear-gradient(90deg, #1e3a5f 0%, #3b82f6 30%, #ef4444 70%, #5b1a1a 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col px-5 pb-4 pt-3.5 md:px-6 md:pb-5 md:pt-4">
        {/* Row 1: Logo + org name */}
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
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 md:text-[11px]">
            Plumstead Neighbourhood Watch
          </p>
        </div>

        {/* Row 2: Barcode */}
        <div className="mt-2 flex justify-center rounded-lg bg-white/95 px-3 py-2">
          <Barcode
            value={memberNum}
            format="CODE128"
            width={1.3}
            height={34}
            displayValue={true}
            fontSize={10}
            margin={0}
            background="transparent"
            lineColor="#111827"
            textMargin={2}
            font="monospace"
          />
        </div>

        {/* Row 3: Emergency contacts */}
        <div className="mt-auto">
          <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-red-400 md:text-[9px]">
            Emergency Contacts
          </p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-0.5">
            {topContacts.map((c) => (
              <div
                key={c.service}
                className="flex items-baseline justify-between gap-1"
              >
                <span className="truncate text-[9px] text-white/50 md:text-[10px]">
                  {c.service}
                </span>
                <span className="shrink-0 font-mono text-[9px] font-semibold text-white/80 md:text-[10px]">
                  {c.number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Org details */}
        <div className="mt-2 flex items-center gap-4 border-t border-white/10 pt-1.5 text-[9px] text-white/40 md:text-[10px]">
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
  );
}
