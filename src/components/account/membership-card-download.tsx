"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type MembershipCardDownloadProps = {
  children: React.ReactNode;
  fileName?: string;
};

export function MembershipCardDownload({
  children,
  fileName = "pnw-membership-card",
}: MembershipCardDownloadProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  async function handleDownload() {
    const el = cardRef.current;
    if (!el) return;

    setIsCapturing(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div ref={cardRef} className="w-full max-w-[400px]">
        {children}
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
        {isCapturing ? "Preparing..." : "Download PNG"}
      </Button>
    </div>
  );
}
