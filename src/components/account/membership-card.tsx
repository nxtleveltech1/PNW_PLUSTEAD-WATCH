"use client";

import Image from "next/image";
import Barcode from "react-barcode";
import { ShieldCheck, Globe, Mail } from "lucide-react";
import { ZONE_SECTIONS } from "@/data/zone-polygons";

export type EmergencyContactItem = {
  service: string;
  number: string;
};

type SharedCardProps = {
  firstName: string | null;
  lastName: string | null;
  zone: { name: string; postcodePrefix?: string | null } | null;
  street: { name: string } | null;
  houseNumber: string | null;
  section: string | null;
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
  section,
  memberNumber,
  memberSince,
  profileImageUrl,
}: SharedCardProps) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Member";
  const streetParts = [houseNumber, street?.name].filter(Boolean).join(" ");
  const locationParts = [
    streetParts || null,
    zone?.name ?? null,
    zone?.postcodePrefix ?? null,
  ].filter(Boolean);
  const addressLine = locationParts.length > 0 ? locationParts.join(", ") : null;
  const sectionInfo = section
    ? ZONE_SECTIONS.find((s) => s.id === section) ?? null
    : null;
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
        className="absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #ef4444 0%, transparent 70%)" }}
      />

      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: "linear-gradient(90deg, #1e3a5f 0%, #3b82f6 30%, #ef4444 70%, #5b1a1a 100%)",
        }}
      />

      {/* Photo: positioned top-left, spans ~62% height */}
      <div className="absolute left-[4%] top-[6%] h-[56%] w-[34%] overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-lg">
        {profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profileImageUrl}
            alt={fullName}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/30 md:text-3xl">
            {initials || "?"}
          </div>
        )}
      </div>

      {/* Active member badge: top-right */}
      <div className="absolute right-[4%] top-[6%]">
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/90 md:text-[10px]">
            Active Member
          </span>
          <span className="text-[9px] font-bold text-white/50 md:text-[10px]">|</span>
          <span className="text-[9px] font-bold text-white/90 md:text-[10px]">
            {currentYear}
          </span>
        </div>
      </div>

      {/* Name + address: right of photo, vertically centered */}
      <div className="absolute left-[42%] right-[4%] top-[30%] flex flex-col justify-center">
        <h2 className="truncate font-display text-xl font-bold uppercase leading-tight tracking-wide text-white md:text-2xl">
          {fullName}
        </h2>
        {addressLine && (
          <p className="mt-1 text-[11px] font-medium leading-snug text-white/70 md:text-sm">
            {addressLine}
          </p>
        )}
        {sectionInfo && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: sectionInfo.color }}
            />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-white/50 md:text-[10px]">
              {sectionInfo.name}
            </span>
          </div>
        )}
      </div>

      {/* Bottom bar: PNW logo + stats strip */}
      <div className="absolute inset-x-[4%] bottom-[5%] flex items-end gap-2">
        {/* PNW logo -- overlaps into photo area */}
        <div className="relative -mt-4 h-12 w-14 shrink-0 md:h-14 md:w-16">
          <Image
            src="/images/full%20logo.jpg"
            alt="PNW"
            fill
            className="object-contain object-left-bottom"
            sizes="64px"
          />
        </div>

        {/* Stats strip + tagline */}
        <div className="flex flex-1 flex-col">
          <div className="flex overflow-hidden rounded-md border border-white/10 bg-white/95">
            <div className="flex-1 px-2 py-1 md:px-2.5">
              <p className="text-[6px] font-semibold uppercase tracking-[0.06em] text-red-600 md:text-[7px]">
                Member Number
              </p>
              <p className="font-mono text-[10px] font-bold leading-tight text-gray-900 md:text-[11px]">
                {memberNum}
              </p>
            </div>
            <div className="flex-1 border-l border-gray-200 px-2 py-1 text-center md:px-2.5">
              <p className="text-[6px] font-semibold uppercase tracking-[0.06em] text-gray-500 md:text-[7px]">
                Joined
              </p>
              <p className="font-mono text-[10px] font-bold leading-tight text-gray-900 md:text-[11px]">
                {joinedLabel}
              </p>
            </div>
            <div className="flex-1 border-l border-gray-200 px-2 py-1 text-right md:px-2.5">
              <p className="text-[6px] font-semibold uppercase tracking-[0.06em] text-gray-500 md:text-[7px]">
                Expiry
              </p>
              <p className="font-mono text-[10px] font-bold leading-tight text-gray-900 md:text-[11px]">
                DEC 31, {currentYear}
              </p>
            </div>
          </div>
          <p className="mt-1 text-center text-[7px] font-bold uppercase tracking-[0.18em] text-white/35 md:text-[8px]">
            Neighbourhood Watch &bull; Stronger Together
          </p>
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
