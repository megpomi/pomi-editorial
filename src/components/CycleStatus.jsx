import React from "react";
import { getCurrentPhase, phaseLabel } from "@/lib/cycle";
import { Eyebrow } from "@/components/alm/Primitives";

const PHASE_COPY = {
  period: {
    title: "On your period",
    sub: "Be gentle with yourself today.",
  },
  follicular: {
    title: "Follicular phase",
    sub: "Energy returning — a good week to start things.",
  },
  ovulation: {
    title: "Ovulation",
    sub: "Peak energy and focus.",
  },
  luteal: {
    title: "Luteal phase",
    sub: "Wind down — rest and reflect.",
  },
  unknown: {
    title: "Welcome to Pomi",
    sub: "Log your first period above to start tracking.",
  },
};

export default function CycleStatus({ logs }) {
  const status = getCurrentPhase(logs);
  const meta = PHASE_COPY[status.phase] || PHASE_COPY.unknown;

  const progress =
    status.dayOfCycle != null
      ? Math.min(100, Math.round((status.dayOfCycle / status.avgCycle) * 100))
      : 0;

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "—";

  return (
    <section className="px-6">
      <Eyebrow>{phaseLabel(status.phase)}</Eyebrow>

      <h2 className="mt-3 font-heading text-[30px] leading-tight tracking-tight">
        {meta.title}
      </h2>
      <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted-foreground">
        {meta.sub}
      </p>

      {status.phase !== "unknown" && (
        <>
          <div className="mt-6 flex items-end gap-3">
            <span className="font-heading text-[58px] leading-[0.85] tracking-tight">
              {status.dayOfCycle}
            </span>
            <span className="mb-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              day of cycle
            </span>
          </div>

          <div className="relative mt-5 h-[2px] w-full bg-border">
            <span
              className="absolute left-0 top-0 h-[2px] bg-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[12.5px]">
            <span className="text-muted-foreground">
              Cycle day{" "}
              <span className="font-heading text-[15px] text-foreground">
                {status.dayOfCycle}
              </span>
            </span>
            <span className="text-muted-foreground">
              Next period{" "}
              <span className="font-heading text-[15px] text-foreground">
                {status.daysUntilNext <= 0
                  ? "Any day"
                  : `in ${status.daysUntilNext}d`}
              </span>{" "}
              <span className="text-muted-foreground/70">
                {fmtDate(status.nextStart)}
              </span>
            </span>
          </div>
        </>
      )}
    </section>
  );
}