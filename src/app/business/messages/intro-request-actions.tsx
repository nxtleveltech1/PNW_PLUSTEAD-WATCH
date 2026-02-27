"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { respondToIntroRequest } from "../actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function IntroRequestActions({ introId }: { introId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRespond(accept: boolean) {
    setLoading(true);
    const result = await respondToIntroRequest(introId, accept);
    setLoading(false);
    if (result.ok) {
      toast.success(accept ? "Intro request accepted." : "Intro request declined.");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="mt-4 flex gap-2">
      <Button size="sm" onClick={() => handleRespond(true)} disabled={loading}>
        Accept
      </Button>
      <Button size="sm" variant="outline" onClick={() => handleRespond(false)} disabled={loading}>
        Decline
      </Button>
    </div>
  );
}
