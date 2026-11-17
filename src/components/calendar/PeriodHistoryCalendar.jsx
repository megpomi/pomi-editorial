import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import CalendarDay from "@/components/calendar/CalendarDay";
import ImportFromScreenshot from "@/components/calendar/ImportFromScreenshot";
import { addPeriodDays, deletePeriodDays } from "@/lib/periodLogs";

// yyyy-MM-dd, built from local parts so days never shift by a timezone offset.
const formatDay = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// Every calendar day a log covers: start_date through end_date.
const expandLog = (log) => {
  const days = [];
  const end = new Date(log.end_date || log.start_date);
  for (let d = new Date(log.start_date); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
};

export default function PeriodHistoryCalendar({
  logs,
  onSaved,
  autoImport = false,
}) {
  const [days, setDays] = useState([]);
  // Days already logged that this save removes — tapped on the calendar.
  const [removals, setRemovals] = useState([]);
  const daysRef = useRef([]);
  // The day a range starts from: tap the first day of a period, then its last.
  const rangeAnchor = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Keeps the ref in step with the selection so several screenshots imported
  // in one go build on each other instead of overwriting one another.
  const selectDays = (next) => {
    daysRef.current = next;
    setDays(next);
  };

  const today = new Date();
  const historyStart = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  const loggedDays = useMemo(() => logs.flatMap(expandLog), [logs]);
  const loggedKeys = useMemo(
    () => new Set(loggedDays.map(formatDay)),
    [loggedDays]
  );
  const removedKeys = useMemo(() => new Set(removals), [removals]);
  const keptLoggedDays = useMemo(
    () => loggedDays.filter((day) => !removedKeys.has(formatDay(day))),
    [loggedDays, removedKeys]
  );
  const removedDays = useMemo(
    () => loggedDays.filter((day) => removedKeys.has(formatDay(day))),
    [loggedDays, removedKeys]
  );

  // Tapping a logged day marks it for removal, tapping it again keeps it.
  const toggleRemoval = (day) => {
    const key = formatDay(day);
    setRemovals((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Adds the days read from an imported screenshot, skipping anything already there.
  const mergeImported = (values) => {
    const current = daysRef.current;
    const keys = new Set(current.map(formatDay));
    const next = [...current];
    values.forEach((value) => {
      const date = new Date(`${value}T00:00:00`);
      const key = formatDay(date);
      if (date > today || loggedKeys.has(key) || keys.has(key)) return;
      keys.add(key);
      next.push(date);
    });
    selectDays(next);
    return next.length - current.length;
  };

  // A period is two taps: its first day, then its last day, with every day in
  // between marked. Tapping a single day still marks just that day.
  const handleSelect = (value) => {
    const next = (value || []).filter(
      (day) => !loggedKeys.has(formatDay(day))
    );
    const nextKeys = new Set(next.map(formatDay));
    const prevKeys = new Set(daysRef.current.map(formatDay));
    const added = next.filter((day) => !prevKeys.has(formatDay(day)));
    const tookAway = daysRef.current.some(
      (day) => !nextKeys.has(formatDay(day))
    );

    // Deselecting, or a change we didn't make ourselves: start a new range.
    if (added.length !== 1 || tookAway) {
      rangeAnchor.current = null;
      selectDays(next);
      return;
    }

    const clicked = added[0];
    const anchor = rangeAnchor.current;
    if (!anchor || formatDay(anchor) === formatDay(clicked)) {
      rangeAnchor.current = clicked;
      selectDays(next);
      return;
    }

    const from = anchor < clicked ? anchor : clicked;
    const to = anchor < clicked ? clicked : anchor;
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      const key = formatDay(day);
      if (day > today || loggedKeys.has(key) || nextKeys.has(key)) continue;
      nextKeys.add(key);
      next.push(day);
    }
    rangeAnchor.current = null;
    selectDays(next);
  };

  // Opens on the most recent month, with the earlier months scrolled above it.
  // A stable callback so it only runs when the container mounts — otherwise
  // every re-render (each day you tap) would snap the view back down.
  const scrollToLatest = useCallback((node) => {
    if (node) node.scrollTop = node.scrollHeight;
  }, []);

  const handleSave = async () => {
    if (!days.length && !removals.length) return;
    setSaving(true);
    setError("");
    try {
      const remaining = removals.length
        ? await deletePeriodDays(logs, removals)
        : logs;
      if (days.length) {
        await addPeriodDays(remaining, days.map(formatDay));
      }
      selectDays([]);
      setRemovals([]);
      setSaving(false);
      onSaved();
    } catch (e) {
      setError(e?.message || "Couldn't save your days. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImportFromScreenshot onImported={mergeImported} autoOpen={autoImport} />

      <div className="border-y border-border py-2">
        <div
          ref={scrollToLatest}
          className="max-h-[23rem] overflow-y-auto"
        >
          <Calendar
            mode="multiple"
            selected={days}
            // Days already logged stay as they are, so they can't be saved twice.
            onSelect={handleSelect}
            numberOfMonths={12}
            defaultMonth={historyStart}
            disabled={{ after: today }}
            modifiers={{ logged: keptLoggedDays, removing: removedDays }}
            onDayClick={(day, modifiers) => {
              if (modifiers.logged || modifiers.removing) {
                rangeAnchor.current = null;
                toggleRemoval(day);
              }
            }}
            components={{ DayContent: CalendarDay }}
            classNames={{
              months: "flex flex-col items-center",
              month: "w-full space-y-3",
              head_row: "flex w-full",
              head_cell:
                "flex-1 font-normal text-[0.8rem] text-muted-foreground",
              row: "flex w-full mt-1",
              cell: "relative flex-1 p-0 text-center text-sm",
              day: "inline-flex h-11 w-full items-center justify-center rounded-full p-0 text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-selected:opacity-100",
              day_selected:
                "bg-pomegranate-600 text-primary-foreground hover:bg-pomegranate-600 focus:bg-pomegranate-600",
              day_logged:
                "bg-pomegranate-200 font-semibold text-pomegranate-900 hover:bg-pomegranate-200",
              day_removing:
                "bg-transparent font-semibold text-muted-foreground line-through hover:bg-accent",
              day_today: "font-semibold",
            }}
            className="w-full p-3"
          />
        </div>

        {error && (
          <p className="px-4 pt-2 text-sm text-destructive">{error}</p>
        )}

        <div className="flex items-center gap-3 px-4 py-3">
          <span className="flex-1 font-heading text-[13.5px] italic text-muted-foreground">
            {[
              days.length > 0 &&
                `${days.length} day${days.length === 1 ? "" : "s"} selected`,
              removals.length > 0 && `${removals.length} to remove`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
          <Button
            onClick={handleSave}
            disabled={(!days.length && !removals.length) || saving}
            className="rounded-[3px] bg-primary px-6 font-heading text-[15px] hover:bg-pomegranate-700"
          >
            {saving ? "Saving…" : removals.length ? "Save changes" : "Save days"}
          </Button>
        </div>
      </div>
    </div>
  );
}