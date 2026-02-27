"use client";

import dynamic from "next/dynamic";

const HeroContent = dynamic(
  () => import("./hero-content").then((m) => ({ default: m.HeroContent })),
  { ssr: false, loading: () => <div className="absolute inset-0" aria-hidden /> }
);

export function HeroClient() {
  return <HeroContent />;
}
