import React from "react";
import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/alm/Primitives";
import Pomegranate from "@/components/alm/Pomegranate";
import AdBanner from "@/components/ads/AdBanner";
import useIsSubscriber from "@/hooks/use-is-subscriber";

// Almanac's masthead: the wordmark in italic Playfair, the day or the section
// on the right, and the heavy double rule beneath.
export default function Masthead({ kicker, actions, to = "/" }) {
  const subscriber = useIsSubscriber();

  return (
    <header className="px-6 pt-5 pb-4">
      <div className="flex items-center justify-between gap-3">
        <Link to={to} className="flex items-center gap-2">
          <Pomegranate size={26} />
          <span className="font-heading text-[24px] italic leading-none text-primary">
            Pomi
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {kicker ? (
            <Eyebrow className="text-right leading-tight">{kicker}</Eyebrow>
          ) : null}
          {actions}
        </div>
      </div>
      <div className="mt-3 h-[4px] border-y border-foreground" />
      {!subscriber && <AdBanner className="mt-3" />}
    </header>
  );
}