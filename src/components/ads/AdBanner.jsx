import React, { useEffect, useRef } from "react";
import {
  ADSENSE_CLIENT,
  ADSENSE_SLOT,
  adsConfigured,
  loadAdSense,
} from "@/lib/ads";

// One Google AdSense unit. Shows a placeholder until the AdSense ids are set
// in src/lib/ads.js.
export default function AdBanner({ className = "" }) {
  const filled = useRef(false);

  useEffect(() => {
    if (!adsConfigured() || filled.current) return;
    filled.current = true;
    loadAdSense().then(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ad blockers and offline previews simply leave the space empty.
      }
    });
  }, []);

  if (!adsConfigured()) {
    return (
      <div
        className={`hidden h-[34px] w-full min-w-0 items-center justify-center border border-dashed border-border bg-secondary/40 px-3 text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:flex ${className}`}
      >
        Sponsor space
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block min-h-[50px] w-full min-w-0 ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={ADSENSE_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}