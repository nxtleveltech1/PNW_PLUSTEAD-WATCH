"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { rsvpBusinessEvent } from "../../actions";

export function BusinessEventRsvpButton({
  eventId,
  hasRsvped,
}: {
  eventId: string;
  hasRsvped: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await rsvpBusinessEvent(eventId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.data?.removed ? "RSVP removed." : "You're attending!");
      window.location.reload();
    });
  }

  return (
    <Button onClick={handleClick} disabled={pending}>
      {pending ? "..." : hasRsvped ? "Remove RSVP" : "RSVP"}
    </Button>
  );
}
