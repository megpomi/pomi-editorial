import React from "react";
import { getCurrentPhase, phaseLabel } from "@/lib/cycle";
import { Eyebrow, Rule } from "@/components/alm/Primitives";

const PHASE_COPY = {
  period: {
    title: "On your period",
    note: "Your period is likely underway. Rest is not a reward you have to earn: warmth, water and an earlier night tend to help more than pushing through.",
  },
  follicular: {
    title: "Follicular phase",
    note: "Energy often lifts in the days after a period. If yours does, it can be a good stretch for focused work. If it doesn't, that is ordinary too.",
  },
  ovulation: {
    title: "Ovulatory phase",
    note: "You may be near ovulation. Some people notice more energy or a mild one-sided ache; many notice nothing at all. Both are normal.",
  },
  luteal: {
    title: "Luteal phase",
    note: "In the second half of the cycle, sleep and mood can feel more sensitive. Noting how you feel now helps Pomi show you clearer patterns later.",
  },
  unknown: {
    title: "A blank first page",
    note: "Record the first day of your last period and Pomi will begin to keep the count: where you are, what may come next, and what your own notes add up to.",
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
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })
      : "—";

  return (
    <>
      <section className="px-6 pt-6">
        <Eyebrow>
          {status.dayOfCycle != null ? phaseLabel(status.phase) : "The first page"}
        </Eyebrow>
        {status.dayOfCycle != null ? (
          <>
            <h1 className="mt-3 font-heading text-[64px] leading-[0.95] tracking-tight">
              Day {status.dayOfCycle}
            </h1>
            <p className="mt-2 font-heading text-[18px] italic text-muted-foreground">
              of {status.avgCycle}, in the {phaseLabel(status.phase).toLowerCase()} phase
            </p>
          </>
        ) : (
          <h1 className="mt-3 font-heading text-[40px] leading-[1.02] tracking-tight">
            Welcome to <span className="italic text-primary">Pomi.</span>
          </h1>
        )}

        {status.dayOfCycle != null && (
          <div className="mt-6">
            <div className="relative h-[2px] w-full bg-border">
              <span
                className="absolute left-0 top-0 h-[2px] bg-primary transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[12.5px]">
              <span className="text-muted-foreground">
                Next period{" "}
                <span className="font-heading text-[15px] italic text-foreground">
                  {status.daysUntilNext <= 0
                    ? "any day now"
                    : `in ${status.daysUntilNext} days`}
                </span>{" "}
                <span className="text-muted-foreground/80">
                  ({fmtDate(status.nextStart)})
                </span>
              </span>
              <span className="text-muted-foreground">
                Average cycle{" "}
                <span className="font-heading text-[15px] italic text-foreground">
                  {status.avgCycle} days
                </span>
              </span>
            </div>
          </div>
        )}
      </section>

      <Rule className="my-6" />

      <section className="px-6">
        <Eyebrow className="mb-3">The day's note</Eyebrow>
        <p className="alm-dropcap text-[15px] leading-[1.65]">{meta.note}</p>
      </section>
    </>
  );
}