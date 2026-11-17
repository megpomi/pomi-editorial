import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Eyebrow } from "@/components/alm/Primitives";
import {
  countIntimacyDays,
  getBbtInsight,
  getFertileWindow,
  getPositiveOvulationTestDate,
} from "@/lib/fertility";

const dayMonth = (date) => format(date, "d MMM");
const plural = (n) => `${n} day${n === 1 ? "" : "s"}`;

const Row = ({ label, children, note }) => (
  <div className="flex gap-4 border-b border-border py-2.5">
    <span className="w-[104px] shrink-0 pt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-heading text-[14.5px] leading-snug">
        {children}
      </span>
      {note ? (
        <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">
          {note}
        </span>
      ) : null}
    </span>
  </div>
);

// The conception reading of the cycle: where the fertile window falls, how
// close it is, and what the logged tests and temperatures say about it.
export default function FertileWindow({ logs, dailyLogs = [] }) {
  const window = getFertileWindow(logs, {
    positiveTestDate: getPositiveOvulationTestDate(dailyLogs),
  });
  if (!window) return null;

  const bbt = getBbtInsight(dailyLogs);
  const intimacy = countIntimacyDays(
    dailyLogs,
    window.fertileStart,
    window.fertileEnd
  );

  let headline;
  let detail;

  if (window.awaitingPeriod) {
    headline = "Log your period to refresh this";
    detail = `Your fertile window was expected around ${dayMonth(
      window.ovulationDate
    )}. Once your next period starts, Pomi moves the window on to the new cycle.`;
  } else if (window.inFertileWindow) {
    headline = window.confirmedByTest
      ? "Ovulation expected after your positive test"
      : window.daysUntilOvulation === 0
      ? "Ovulation expected today"
      : `Ovulation in ${plural(window.daysUntilOvulation)}`;
    detail = `Your fertile window is open until ${dayMonth(
      window.fertileEnd
    )}. The days just before ovulation are usually the most fertile.`;
  } else if (window.daysUntilWindow > 0) {
    headline = `Fertile window opens in ${plural(window.daysUntilWindow)}`;
    detail = `${dayMonth(window.fertileStart)} – ${dayMonth(
      window.fertileEnd
    )}, with ovulation expected around ${dayMonth(window.ovulationDate)}.`;
  } else {
    headline = "This cycle's window has passed";
    detail = `Ovulation was expected around ${dayMonth(
      window.ovulationDate
    )}. Your next window begins after your next period starts.`;
  }

  const testNote =
    window.daysUntilTest > 0
      ? `in ${plural(window.daysUntilTest)}`
      : window.daysUntilTest === 0
      ? "today, at the earliest"
      : "Passed — log your period when it starts";

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <Eyebrow className="text-primary">Fertile window</Eyebrow>
        <p className="font-heading text-[12.5px] italic leading-none text-muted-foreground">
          {dayMonth(window.fertileStart)} – {dayMonth(window.fertileEnd)}
        </p>
      </div>

      <p className="mt-2.5 font-heading text-[21px] leading-snug sm:text-[24px]">
        {headline}
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
        {detail}
      </p>

      <div className="mt-4 border-t border-border">
        <Row
          label="Most fertile"
          note={
            window.confirmedByTest
              ? "Set by your positive ovulation test"
              : `Estimated from your average ${window.cycleLength}-day cycle`
          }
        >
          {dayMonth(window.peakStart)} – {dayMonth(window.ovulationDate)}
        </Row>

        <Row label="Test from" note={testNote}>
          {dayMonth(window.testDate)}
        </Row>

        {bbt ? (
          <Row
            label="Temperature"
            note={
              bbt.shifted
                ? "A sustained rise — ovulation has likely passed"
                : "Take it first thing, before getting up"
            }
          >
            {bbt.latest.value} °C · {dayMonth(new Date(`${bbt.latest.date}T00:00:00`))}
          </Row>
        ) : null}

        {intimacy > 0 ? (
          <Row label="Intimacy" note="Logged inside this fertile window">
            {intimacy} {intimacy === 1 ? "day" : "days"}
          </Row>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <Link
          to="/log-today?section=cycle"
          className="font-heading text-[13px] text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-pomegranate-700"
        >
          Log an ovulation test or temperature
        </Link>
        <p className="text-[11.5px] leading-snug text-muted-foreground">
          An estimate to read alongside your body, not a contraceptive method.
        </p>
      </div>
    </section>
  );
}