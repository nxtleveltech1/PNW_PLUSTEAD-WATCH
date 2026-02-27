"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="font-display text-xl font-semibold">Something went wrong</h2>
      {isDev && (
        <p className="max-w-md text-center text-sm text-muted-foreground">
          {error.message}
          {error.digest && ` (digest: ${error.digest})`}
        </p>
      )}
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
