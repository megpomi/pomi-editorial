import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Pomegranate from "@/components/alm/Pomegranate";
import HeaderActions from "@/components/alm/HeaderActions";

// The one-line banner every page carries: the mark, the wordmark, the date at
// the centre, then the ad-free invitation, the reminders and the profile door.
export default function Masthead() {
  const now = new Date();

  return (
    <div
      className="px-5 pt-4 pb-3 sm:px-6"
      // Clears the phone's status bar and notch.
      style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex flex-1 items-center justify-start">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <Pomegranate size={24} />
            <span className="font-heading text-[22px] italic leading-none text-primary">
              Pomi
            </span>
          </Link>
        </div>

        <span className="hidden min-w-0 truncate text-[9.5px] tracking-[0.06em] text-muted-foreground min-[360px]:block sm:hidden">
          {format(now, "EEEE d MMM")}
        </span>
        <span className="hidden whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
          {format(now, "EEEE d MMMM")}
        </span>

        <div className="flex flex-1 items-center justify-end">
          <HeaderActions />
        </div>
      </div>

      <div className="mt-3 h-[4px] border-y border-foreground" />
    </div>
  );
}