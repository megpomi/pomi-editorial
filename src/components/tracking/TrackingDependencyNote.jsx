import React from "react";
import { Info } from "lucide-react";

// A quiet aside under the tracking options: conception insights are read off
// the cycle, so the two areas are chosen together.
export default function TrackingDependencyNote({ className = "" }) {
  return (
    <p
      className={`mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground ${className}`}
    >
      <Info className="mt-[2px] h-3.5 w-3.5 shrink-0 text-primary/60" />
      <span>
        Choosing Trying for a baby brings Menstrual cycles with it. You can
        track Menstrual cycles on its own, without the ovulation and fertile
        window insights that Trying for a baby adds.
      </span>
    </p>
  );
}