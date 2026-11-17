import React from "react";
import { Activity, Droplet, Repeat } from "lucide-react";
import { getCycleStats } from "@/lib/cycle";

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
      icon: <Repeat className="h-4 w-4" />,
      label: "Previous cycle",
      value: stats.lastCycleLength,
      hint: "Start to start",
    },
    {
      icon: <Droplet className="h-4 w-4" />,
      label: "Previous period",
      value: stats.lastPeriodLength,
      hint: "Days of bleeding",
    },
    {
      icon: <Activity className="h-4 w-4" />,
      label: "Cycle range",
      value: range,
      hint: stats.cycleCount ? `Across ${stats.cycleCount} cycles` : null,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
      <h2 className="font-heading text-lg font-semibold text-slate-800">
        Your cycle stats
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        {stats.hasHistory
          ? "How your recent cycles compare."
          : "Log a couple of periods and your stats will fill in."}
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, hint }) {
  return (
    <div className="rounded-2xl bg-pomegranate-50/70 p-4">
      <div className="mb-2 flex items-center gap-1.5 text-pomegranate-400">
        {icon}
        <span className="text-xs uppercase tracking-[0.12em]">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-heading text-2xl font-semibold text-slate-800">
          {value == null ? "—" : value}
        </span>
        {value != null && (
          <span className="text-xs text-slate-400">days</span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}