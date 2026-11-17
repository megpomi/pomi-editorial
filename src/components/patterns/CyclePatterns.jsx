import React, { useMemo, useState } from "react";
import MonthStepper from "@/components/patterns/MonthStepper";
import SymptomTiles from "@/components/patterns/SymptomTiles";
import {
  formatMonth,
  monthSeries,
  shiftMonth,
  startOfMonth,
  summarise,
  symptomBreakdown,
  symptomDayCount,
} from "@/lib/patterns";

// The month-by-month view of what the user logged: the present month on open,
// with the stepper walking back through earlier ones.
export default function CyclePatterns({ logs, dailyLogs = [] }) {
  const thisMonth = startOfMonth(new Date());
  const [month, setMonth] = useState(thisMonth);

  const move = (delta) =>
    setMonth((current) => {
      const next = shiftMonth(current, delta);
      return next > thisMonth ? current : next;
    });

  const series = useMemo(
    () => monthSeries(logs, dailyLogs, month),
    [logs, dailyLogs, month]
  );
  const stats = useMemo(() => summarise(series), [series]);
  const symptomDays = useMemo(
    () => symptomDayCount(dailyLogs, month),
    [dailyLogs, month]
  );
  const symptoms = useMemo(
    () => symptomBreakdown(logs, dailyLogs, month),
    [logs, dailyLogs, month]
  );
  const isThisMonth = month.getTime() === thisMonth.getTime();

  const tiles = [
    { label: "Days logged", value: symptomDays },
    { label: "Symptoms logged", value: stats.symptoms },
    { label: "Usual mood", value: stats.mood || "—" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xs text-[14px] leading-relaxed text-muted-foreground">
          How you felt and what you recorded, month by month.
        </p>
        <MonthStepper month={month} onChange={move} canGoForward={!isThisMonth} />
      </div>

      {series.length === 0 ? (
        <p className="mt-5 border-l-2 border-primary pl-4 font-heading text-[15px] italic leading-relaxed text-muted-foreground">
          {isThisMonth
            ? "Nothing recorded yet this month. Your trends appear here as you check in."
            : `Nothing recorded in ${formatMonth(month)}.`}
        </p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-3 divide-x divide-border border-y border-border">
            {tiles.map((tile) => (
              <div key={tile.label} className="px-3 py-4 first:pl-0">
                <p className="font-heading text-[24px] leading-none">
                  {tile.value}
                </p>
                <p className="eyebrow mt-2 text-muted-foreground">
                  {tile.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="eyebrow mb-4 text-muted-foreground">
              Symptoms logged
            </p>
            <SymptomTiles symptoms={symptoms} monthLabel={formatMonth(month)} />
          </div>
        </>
      )}
    </div>
  );
}