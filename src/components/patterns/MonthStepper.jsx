import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth } from "@/lib/patterns";

// Month navigation for the patterns block: back through the months that hold
// data, never forward past the present month.
export default function MonthStepper({ month, onChange, canGoForward }) {
  const button =
    "flex h-8 w-8 items-center justify-center text-primary transition-colors hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center border border-border">
      <button
        type="button"
        onClick={() => onChange(-1)}
        aria-label="Previous month"
        className={button}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="min-w-[7.5rem] border-x border-border px-3 py-1.5 text-center font-heading text-[13px] italic">
        {formatMonth(month)}
      </span>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={!canGoForward}
        aria-label="Next month"
        className={button}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}