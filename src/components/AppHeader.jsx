import React from "react";
import { Link } from "react-router-dom";
import HeaderActions from "@/components/alm/HeaderActions";
import Pomegranate from "@/components/alm/Pomegranate";

// Shared page header, in Almanac's voice: the italic wordmark, and the ad-free
// and profile doors on the right, always in the same place.
export default function AppHeader({ children, maxWidth = "max-w-3xl" }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur">
      <div
        className={`mx-auto flex ${maxWidth} flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <Pomegranate size={24} />
            <span className="font-heading text-[22px] italic leading-none text-primary">
              Pomi
            </span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <HeaderActions />
          {children}
        </div>
      </div>
    </header>
  );
}