import React from "react";
import AdBanner from "@/components/ads/AdBanner";
import useIsSubscriber from "@/hooks/use-is-subscriber";

// The ad space at the foot of a page. Ad-free subscribers never see it, and
// nothing renders until the server has confirmed the free plan.
export default function FreeUserAd({ className = "mt-7 px-6" }) {
  const subscriber = useIsSubscriber();

  if (subscriber !== false) return null;

  return (
    <div className={className}>
      <AdBanner />
    </div>
  );
}