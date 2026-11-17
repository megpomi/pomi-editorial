import React from "react";
import { Link } from "react-router-dom";
import AdBanner from "@/components/ads/AdBanner";
import Pomegranate from "@/components/alm/Pomegranate";
import useIsSubscriber from "@/hooks/use-is-subscriber";

// Shared page header, in Almanac's voice: the italic wordmark, the free-plan
// sponsor strip filling the space, and the page's own actions on the right.
export default function AppHeader({ children, maxWidth = "max-w-3xl" }) {
  const subscriber = useIsSubscriber();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur">
      <div
        className={`mx-auto flex ${maxWidth} items-center justify-between gap-4 px-6 py-3`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <Pomegranate size={24} />
            <span className="font-heading text-[22px] italic leading-none text-primary">
              Pomi
            </span>
          </Link>
          {!subscriber && <AdBanner className="flex-1" />}
        </div>
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      </div>
    </header>
  );
}