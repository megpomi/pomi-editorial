import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Eyebrow } from "@/components/alm/Primitives";
import { getFertileWindow } from "@/lib/fertility";

const dayMonth = (date) => format(date, "d MMM");

const plural = (n) => `${n} day${n === 1 ? "" : "s"}`;

// The conception reading of the cycle, set as one editorial block beneath the
// day's figures: where the fertile window falls and how close it is.
export default function FertileWindow({ logs }) {
  const window = getFertileWindow(logs);
  if (!window) return null;

  const {
    cycleLength,
    ovulationDate,
    fertileStart,
    fertileEnd,
    daysUntilOvulation,
    daysUntilWindow,
    inFertileWindow,
    awaitingPeriod,
  } = window;

  let headline;
  let detail;

  if (awaitingPeriod) {
    headline = "Log your period to refresh this";
    detail = `Your fertile window was expected around ${dayMonth(
      ovulationDate
    )}. Once your next period starts, Pomi moves the window on to the new cycle.`;
  } else if (inFertileWindow) {
    headline =
      daysUntilOvulation === 0
        ? "Ovulation expected today"
        : `Ovulation in ${plural(daysUntilOvulation)}`;
    detail = `Your fertile window is open until ${dayMonth(
      fertileEnd
    )}. The days just before ovulation are usually the most fertile.`;
  } else if (daysUntilWindow > 0) {
    headline = `Fertile window opens in ${plural(daysUntilWindow)}`;
    detail = `${dayMonth(fertileStart)} – ${dayMonth(
      fertileEnd
    )}, with ovulation expected around ${dayMonth(ovulationDate)}.`;
  } else {
    headline = "This cycle's window has passed";
    detail = `Ovulation was expected around ${dayMonth(
      ovulationDate
    )}. Your next window begins after your next period starts.`;
  }

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <Eyebrow className="text-primary">Fertile window</Eyebrow>
        <p className="font-heading text-[12.5px] italic leading-none text-muted-foreground">
          {dayMonth(fertileStart)} – {dayMonth(fertileEnd)}
        </p>
      </div>

      <p className="mt-2.5 font-heading text-[21px] leading-snug sm:text-[24px]">
        {headline}
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
        {detail}
      </p>

      <div className="mt-3.5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <Link
          to="/log-today?section=cycle"
          className="font-heading text-[13px] text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700"
        >
          Log today's cervical mucus
        </Link>
        <p className="text-[11.5px] leading-snug text-muted-foreground">
          Estimated from your average {cycleLength}-day cycle. An estimate to
          read alongside your body, not a contraceptive method.
        </p>
      </div>
    </section>
  );
}