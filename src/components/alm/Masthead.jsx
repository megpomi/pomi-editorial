import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Pomegranate from "@/components/alm/Pomegranate";
import HeaderActions from "@/components/alm/HeaderActions";

// The one-line banner every page carries: the mark, the wordmark, the date,
// then the ad-free invitation, the reminders and the profile door.
export default function Masthead() {
  const now = new Date();

  return (
    <div className="px-5 pt-4 pb-3 sm:px-6">
      <div className="flex items-center gap-2.5">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Pomegranate size={24} />
          <span className="font-heading text-[22px] italic leading-none text-primary">
            Pomi
          </span>
        </Link>

        <span className="eyebrow truncate text-muted-foreground sm:hidden">
          {format(now, "d MMM")}
        </span>
        <span className="eyebrow hidden truncate text-muted-foreground sm:inline">
          {format(now, "EEEE d MMMM")}
        </span>

        <div className="ml-auto">
          <HeaderActions />
        </div>
      </div>

      <div className="mt-3 h-[4px] border-y border-foreground" />
    </div>
  );
}