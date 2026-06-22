"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AdBanner } from "@/components/ads/adsterra-banner";

type HomeStickyAdProps = {
  adKey?: string | null;
};

export function HomeStickyAd({ adKey }: HomeStickyAdProps) {
  const [dismissed, setDismissed] = useState(false);
  const key = adKey?.trim();

  if (dismissed || !key) {
    return null;
  }

  return (
    <div className="sticky top-20 z-20 py-2">
      <div className="mx-auto max-w-4xl">
        <div className="relative mx-auto max-w-[360px] pr-10">
          <AdBanner type="banner-320x50" adKey={key} eager />
          <button
            type="button"
            aria-label="关闭广告"
            className="absolute right-1 top-1 z-10 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setDismissed(true)}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
