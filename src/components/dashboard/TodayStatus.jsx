import React from "react";
import { phaseLabel } from "@/lib/cycle";

// The three figures a cycle is read by, set as a ruled band under the day's
// headline: where you are, which day it is, and when the next one is due.
const shortDate = (d) =>
  d
    ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "—";

export default function TodayStatus({ status }) {
  if (!status || status.phase === "unknown" || status.dayOfCycle == null) {
    return null;
  }

  // How far through the expected cycle today sits, drawn as a rose rule under
  // the phase so the line lengthens a little every day.
  const progress = Math.min(
    100,
    Math.max(2, Math.round((status.dayOfCycle / (status.avgCycle || 28)) * 100))
  );

  const cells = [
    {
      label: "Phase",
      value: phaseLabel(status.phase),
      note: null,
      progress,
    },
    {
      label: "Day of cycle",
      value: status.dayOfCycle,
      note: `of ${status.avgCycle} days`,
    },
    {
      label: "Next period",
      value: shortDate(status.nextStart),
      note:
        status.daysUntilNext <= 0
          ? "Any day now"
          : `in ${status.daysUntilNext} day${status.daysUntilNext === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div className="grid grid-cols-3 divide-x divide-border border-y border-border">
      {cells.map((cell) => (
        <div key={cell.label} className="px-3 py-3.5 first:pl-0 last:pr-0">
          <p className="eyebrow text-muted-foreground">{cell.label}</p>
          <p className="mt-1.5 font-heading text-[17px] leading-tight sm:text-[19px]">
            {cell.value}
          </p>
          {cell.progress != null ? (
            <div className="mt-2.5 h-[3px] w-full rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                style={{ width: `${cell.progress}%` }}
              />
            </div>
          ) : null}
          {cell.note ? (
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
              {cell.note}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}