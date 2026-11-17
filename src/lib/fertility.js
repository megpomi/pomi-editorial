// Fertile window prediction — pure helpers, in the same spirit as lib/cycle.
// The estimate is the standard one: ovulation sits roughly 14 days before the
// next period is due, sperm can survive about five days, and an egg lives for
// roughly one — so the window runs five days before ovulation to one day after.
// A positive ovulation test is better evidence than the average, so it moves
// the predicted ovulation to the day after it.
import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import { computeCycleStats } from "./cycle";

const LUTEAL_DAYS = 14;
const DAYS_BEFORE_OVULATION = 5;
const DAYS_AFTER_OVULATION = 1;
// The two days before ovulation, and ovulation itself, are the most fertile.
const PEAK_DAYS_BEFORE = 2;
// A thermal shift is the last three readings sitting this far above the ones
// before them, which usually means ovulation has already happened.
const THERMAL_SHIFT = 0.2;
const SHIFT_DAYS = 3;

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

// The most recent positive ovulation test, as a yyyy-MM-dd string.
export function getPositiveOvulationTestDate(dailyLogs) {
  const positives = (dailyLogs || [])
    .filter((entry) => entry.ovulation_test === "positive" && entry.date)
    .map((entry) => String(entry.date).slice(0, 10))
    .sort();
  return positives[positives.length - 1] || null;
}

export function getFertileWindow(
  logs,
  { positiveTestDate = null, now = new Date() } = {}
) {
  const { sorted, avgCycle } = computeCycleStats(logs || []);
  if (!sorted.length) return null;

  const cycleLength = avgCycle || 28;
  const lastStart = toLocalDay(sorted[sorted.length - 1].start_date);

  // Only a test from this cycle says anything about this cycle.
  const test = positiveTestDate ? toLocalDay(positiveTestDate) : null;
  const confirmed = test && test >= lastStart ? test : null;

  const ovulationDate = confirmed
    ? addDays(confirmed, 1)
    : addDays(lastStart, Math.max(7, cycleLength - LUTEAL_DAYS) - 1);

  const fertileStart = addDays(ovulationDate, -DAYS_BEFORE_OVULATION);
  const fertileEnd = addDays(ovulationDate, DAYS_AFTER_OVULATION);
  // Two weeks after ovulation is when a test could first read positive.
  const testDate = addDays(ovulationDate, LUTEAL_DAYS);

  const today = startOfDay(now);
  const nextStart = addDays(lastStart, cycleLength);

  return {
    cycleLength,
    confirmedByTest: Boolean(confirmed),
    lastStart,
    ovulationDate,
    ovulationDayOfCycle: differenceInCalendarDays(ovulationDate, lastStart) + 1,
    peakStart: addDays(ovulationDate, -PEAK_DAYS_BEFORE),
    fertileStart,
    fertileEnd,
    windowDays: DAYS_BEFORE_OVULATION + DAYS_AFTER_OVULATION + 1,
    testDate,
    daysUntilTest: differenceInCalendarDays(testDate, today),
    daysUntilOvulation: differenceInCalendarDays(ovulationDate, today),
    daysUntilWindow: differenceInCalendarDays(fertileStart, today),
    inFertileWindow: today >= fertileStart && today <= fertileEnd,
    // A cycle that has run past the next expected start means these dates are
    // about to be replaced by the period that starts the next cycle.
    awaitingPeriod: today > nextStart,
  };
}

// The logged temperature readings read back: the latest one, and whether the
// recent ones have risen the way they do after ovulation.
export function getBbtInsight(dailyLogs) {
  const readings = (dailyLogs || [])
    .filter((entry) => typeof entry.bbt === "number" && entry.bbt > 0)
    .map((entry) => ({
      date: String(entry.date).slice(0, 10),
      value: entry.bbt,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  if (!readings.length) return null;

  const recent = readings.slice(-SHIFT_DAYS);
  const baseline = readings.slice(-(SHIFT_DAYS * 2), -SHIFT_DAYS);
  const average = baseline.length
    ? baseline.reduce((sum, reading) => sum + reading.value, 0) / baseline.length
    : null;
  const shifted = Boolean(
    average != null &&
      recent.length === SHIFT_DAYS &&
      recent.every((reading) => reading.value >= average + THERMAL_SHIFT)
  );

  return {
    latest: readings[readings.length - 1],
    average,
    shifted,
  };
}

// How many days of intimacy were logged inside the fertile window.
export function countIntimacyDays(dailyLogs, start, end) {
  const from = startOfDay(start);
  const to = startOfDay(end);
  return (dailyLogs || []).filter((entry) => {
    if (!entry.had_sex || !entry.date) return false;
    const day = toLocalDay(entry.date);
    return day >= from && day <= to;
  }).length;
}