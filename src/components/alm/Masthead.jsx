import React from "react";
import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/alm/Primitives";
import AdBanner from "@/components/ads/AdBanner";
import useIsSubscriber from "@/hooks/use-is-subscriber";

// Almanac's masthead: the wordmark in italic Playfair, the day or the section
// on the right, and the heavy double rule beneath.
export default function Masthead({ kicker, actions, to = "/" }) {
  const subscriber = useIsSubscriber();

  return (
    <header className="px-6 pt-5 pb-4">
      <div className="flex items-baseline justify-between gap-4">
        <Link
          to={to}
          className="font-heading text-[24px] italic leading-none text-primary"
        >
          Pomi
        </Link>
        <div className="flex items-baseline gap-4">
          {kicker ? <Eyebrow className="text-right">{kicker}</Eyebrow> : null}
          {actions}
        </div>
      </div>
      <div className="mt-3 h-[4px] border-y border-foreground" />
      {!subscriber && <AdBanner className="mt-3" />}
    </header>
  );
}