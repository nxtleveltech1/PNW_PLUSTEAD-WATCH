"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type Zone = { id: string; name: string; postcodePrefix: string | null };

export function FindZoneForm({ zones }: { zones: Zone[] }) {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = postcode.replace(/\s/g, "").slice(0, 4);
    const zone = zones.find(
      (z) => z.postcodePrefix && normalized.startsWith(z.postcodePrefix)
    ) ?? zones.find((z) => z.postcodePrefix === normalized);
    if (zone) {
      router.push(`/register?zone=${zone.id}`);
    } else {
      router.push("/start-scheme");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="e.g. 7800"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        className="flex-1"
        aria-label="Postcode"
      />
      <Button type="submit">Find</Button>
    </form>
  );
}
