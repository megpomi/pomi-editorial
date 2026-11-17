import React from "react";
import { getCycleStats } from "@/lib/cycle";
import { Eyebrow } from "@/components/alm/Primitives";

const formatRange = (stats) => {
  if (stats.minCycle == null || stats.maxCycle == null) return null;
  return stats.minCycle === stats.maxCycle
    ? `${stats.minCycle}`
    : `${stats.minCycle}–${stats.maxCycle}`;
};

export default function CycleStats({ logs }) {
  const stats = getCycleStats(logs);
  const range = formatRange(stats);

  const cards = [
    {
      label: "Previous cycle",
      value: stats.lastCycleLength,
      hint: "Start to start",
    },
    {
      label: "Previous period",
      value: stats.lastPeriodLength,
      hint: "Days of bleeding",
    },
    {
      label: "Cycle range",
      value: range,
      hint: stats.cycleCount ? `Across ${stats.cycleCount} cycles` : null,
    },
  ];

  return (
    <section>
      <Eyebrow>Your cycle stats</Eyebrow>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
        {stats.hasHistory
          ? "How your recent cycles compare."
          : "Record a couple of periods and your figures will fill in."}
      </p>

      <div className="mt-5 grid grid-cols-3 divide-x divide-border border-y border-border">
        {cards.map((card) => (
          <div key={card.label} className="px-3 py-4 first:pl-0">
            <p className="eyebrow text-muted-foreground">{card.label}</p>
            <p className="mt-2 font-heading text-[28px] leading-none">
              {card.value == null ? "—" : card.value}
              {card.value != null && (
                <span className="ml-1 font-heading text-[13px] italic text-muted-foreground">
                  days
                </span>
              )}
            </p>
            {card.hint && (
              <p className="mt-2 text-[11.5px] leading-snug text-muted-foreground">
                {card.hint}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}