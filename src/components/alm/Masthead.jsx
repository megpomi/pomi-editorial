import React from "react";
import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/alm/Primitives";
import Pomegranate from "@/components/alm/Pomegranate";
import HeaderActions from "@/components/alm/HeaderActions";

// Almanac's masthead: the wordmark in italic Playfair, the day or the section
// beneath it, and the heavy double rule closing it off.
export default function Masthead({ kicker, actions, to = "/" }) {
  return (
    <header className="px-6 pt-5 pb-4">
      <div className="flex items-center justify-between gap-3">
        <Link to={to} className="flex items-center gap-2">
          <Pomegranate size={26} />
          <span className="font-heading text-[24px] italic leading-none text-primary">
            Pomi
          </span>
        </Link>
        <HeaderActions />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        {kicker ? <Eyebrow className="leading-tight">{kicker}</Eyebrow> : <span />}
        {actions}
      </div>
      <div className="mt-2 h-[4px] border-y border-foreground" />
    </header>
  );
}