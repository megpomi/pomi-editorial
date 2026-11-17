// Fertile window prediction — pure helpers, in the same spirit as lib/cycle.
// The estimate is the standard one: ovulation sits roughly 14 days before the
// next period is due, sperm can survive about five days, and an egg lives for
// roughly one — so the window runs five days before ovulation to one day after.
import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import { computeCycleStats } from "./cycle";

const LUTEAL_DAYS = 14;
const DAYS_BEFORE_OVULATION = 5;
const DAYS_AFTER_OVULATION = 1;

// Date-only strings ("yyyy-MM-dd") parsed as local midnight, so day counts
// never shift by a timezone offset.
function toLocalDay(value) {
  if (typeof value === "string") {
    const [y, m, d] = value.split("-").map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getFertileWindow(logs, now = new Date()) {
  const { sorted, avgCycle } = computeCycleStats(logs || []);
  if (!sorted.length) return null;

  const cycleLength = avgCycle || 28;
  const lastStart = toLocalDay(sorted[sorted.length - 1].start_date);
  const ovulationDayOfCycle = Math.max(7, cycleLength - LUTEAL_DAYS);
  const ovulationDate = addDays(lastStart, ovulationDayOfCycle - 1);
  const fertileStart = addDays(ovulationDate, -DAYS_BEFORE_OVULATION);
  const fertileEnd = addDays(ovulationDate, DAYS_AFTER_OVULATION);

  const today = startOfDay(now);
  const nextStart = addDays(lastStart, cycleLength);

  return {
    cycleLength,
    ovulationDate,
    ovulationDayOfCycle,
    fertileStart,
    fertileEnd,
    windowDays: DAYS_BEFORE_OVULATION + DAYS_AFTER_OVULATION + 1,
    daysUntilOvulation: differenceInCalendarDays(ovulationDate, today),
    daysUntilWindow: differenceInCalendarDays(fertileStart, today),
    inFertileWindow: today >= fertileStart && today <= fertileEnd,
    // A cycle that has run past the next expected start means these dates are
    // about to be replaced by the period that starts the next cycle.
    awaitingPeriod: today > nextStart,
  };
}