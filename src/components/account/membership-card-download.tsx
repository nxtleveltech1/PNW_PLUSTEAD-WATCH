"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type MembershipCardDownloadProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  fileName?: string;
};

async function captureElement(el: HTMLElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: null,
  });
}

export function MembershipCardDownload({
  front,
  back,
  fileName = "pnw-membership-card",
}: MembershipCardDownloadProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  async function handleDownload() {
    if (!frontRef.current || !backRef.current) return;

    setIsCapturing(true);
    try {
      const [frontCanvas, backCanvas] = await Promise.all([
        captureElement(frontRef.current),
        captureElement(backRef.current),
      ]);

      const gap = 24;
      const combined = document.createElement("canvas");
      combined.width = Math.max(frontCanvas.width, backCanvas.width);
      combined.height = frontCanvas.height + gap + backCanvas.height;
      const ctx = combined.getContext("2d")!;
      ctx.drawImage(frontCanvas, 0, 0);
      ctx.drawImage(backCanvas, 0, frontCanvas.height + gap);

      const dataUrl = combined.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Front
          </p>
          <div ref={frontRef} className="w-full max-w-[420px]">
            {front}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Back
          </p>
          <div ref={backRef} className="w-full max-w-[420px]">
            {back}
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={isCapturing}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {isCapturing ? "Preparing..." : "Download Card"}
      </Button>
    </div>
  );
}
