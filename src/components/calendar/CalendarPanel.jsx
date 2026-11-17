import React, { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import CalendarDay from "@/components/calendar/CalendarDay";
import LoggedDayDetails from "@/components/calendar/LoggedDayDetails";
import { getCycleDay } from "@/lib/cycle";
import { addPeriodDays, deletePeriodDays } from "@/lib/periodLogs";

// yyyy-MM-dd, built from local parts so days never shift by a timezone offset.
const dayKey = (value) => {
  const d = new Date(value);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// A stored yyyy-MM-dd day, rebuilt from local parts so it lands on the right
// square in every timezone.
const parseDayKey = (value) => {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Every calendar day a log covers: start_date through end_date (a single day when open).
const expandLog = (log) => {
  const days = [];
  const end = new Date(log.end_date || log.start_date);
  for (let d = new Date(log.start_date); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
};

// The month calendar with a dot on every day that has data, plus the details of
// the day you tap. `title`/`action` fill an optional header row.
export default function CalendarPanel({
  logs,
  dailyLogs = [],
  loading,
  showJournal = false,
  title,
  action,
  onChanged,
}) {
  const [selected, setSelected] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loggedDays = useMemo(() => logs.flatMap(expandLog), [logs]);

  // Days the daily check-in recorded a symptom on, so a day that isn't part of
  // a period can still be spotted and opened.
  const symptomDays = useMemo(
    () =>
      dailyLogs
        .filter((entry) => entry.symptoms?.length > 0)
        .map((entry) => parseDayKey(entry.date)),
    [dailyLogs]
  );

  // Days with a journal entry, for people tracking general wellbeing.
  const journalDays = useMemo(
    () =>
      showJournal
        ? dailyLogs
            .filter(
              (entry) =>
                entry.journal_response?.trim() || entry.journal_voice_note
            )
            .map((entry) => parseDayKey(entry.date))
        : [],
    [dailyLogs, showJournal]
  );

  const selectedLog = useMemo(() => {
    if (!selected) return null;
    const key = dayKey(selected);
    return (
      logs.find((l) => {
        const start = dayKey(l.start_date);
        const end = dayKey(l.end_date || l.start_date);
        return key >= start && key <= end;
      }) || null
    );
  }, [logs, selected]);

  const selectedDailyLog = useMemo(
    () =>
      (selected && dailyLogs.find((entry) => entry.date === dayKey(selected))) ||
      null,
    [dailyLogs, selected]
  );

  const cycleDay = useMemo(
    () => (selected ? getCycleDay(logs, selected) : null),
    [logs, selected]
  );

  // Marks the selected day as a period day, or clears it when it already is one.
  const togglePeriodDay = async () => {
    if (!selected || saving) return;
    setSaving(true);
    setError("");
    try {
      const key = dayKey(selected);
      if (selectedLog) await deletePeriodDays(logs, [key]);
      else await addPeriodDays(logs, [key]);
      if (onChanged) await onChanged();
    } catch (e) {
      setError(e?.message || "Couldn't update this day. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {(title || action) && (
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
          {title && (
            <h3 className="font-heading text-[18px] leading-none">{title}</h3>
          )}
          {action}
        </div>
      )}

      <div className="border-y border-border py-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(value) => value && setSelected(value)}
          modifiers={{
            logged: loggedDays,
            symptom: symptomDays,
            journal: journalDays,
          }}
          components={{ DayContent: CalendarDay }}
          disabled={{ after: new Date() }}
          classNames={{
            months: "flex flex-col items-center",
            month: "w-full space-y-2",
            head_row: "flex w-full",
            head_cell:
              "flex-1 pb-2 text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground",
            row: "flex w-full",
            cell: "relative flex-1 p-0 text-center text-sm",
            day: "inline-flex h-11 w-full items-center justify-center rounded-full p-0 font-heading text-[15px] font-normal hover:bg-secondary focus-visible:outline-none aria-selected:opacity-100",
            day_logged:
              "bg-pomegranate-600/10 font-medium text-pomegranate-700 hover:bg-pomegranate-600/15",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary",
            day_today: "font-semibold underline underline-offset-4",
          }}
          className="w-full p-2"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-pomegranate-600" />
          Period day
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-symptom" />
          Symptoms
        </span>
        {showJournal && (
          <span className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-purple-800" />
            Journal entry
          </span>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="h-32 animate-pulse border border-border bg-card" />
        ) : (
          <LoggedDayDetails
            date={selected}
            log={selectedLog}
            dailyLog={selectedDailyLog}
            journal={showJournal ? selectedDailyLog : null}
            cycleDay={cycleDay}
            isPeriodDay={Boolean(selectedLog)}
            onTogglePeriod={togglePeriodDay}
            periodSaving={saving}
            periodError={error}
          />
        )}
      </div>
    </div>
  );
}