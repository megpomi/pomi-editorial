import React, { useState } from "react";
import { Link } from "react-router-dom";
import { prettySymptom } from "@/lib/dailyLog";
import MoodFace from "@/components/icons/MoodFace";
import JournalEntryDialog from "@/components/journal/JournalEntryDialog";
import { Eyebrow } from "@/components/alm/Primitives";

const FLOW_LABEL = { light: "Light", medium: "Medium", heavy: "Heavy" };

const prettyDate = (d) =>
  d
    ? d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

// yyyy-MM-dd from local parts, so the day never shifts by a timezone offset.
const dayKey = (d) => {
  if (!d) return "";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const Row = ({ label, children }) => (
  <div className="flex gap-4 border-b border-border py-2.5 last:border-0">
    <span className="w-24 shrink-0 pt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </span>
    <span className="min-w-0 flex-1 text-[14px] leading-relaxed">{children}</span>
  </div>
);

export default function LoggedDayDetails({
  date,
  log,
  dailyLog,
  journal,
  cycleDay,
  isPeriodDay,
  onTogglePeriod,
  periodSaving,
  periodError,
}) {
  const [journalOpen, setJournalOpen] = useState(false);
  const journalResponse = journal?.journal_response?.trim() || "";
  const journalVoice = journal?.journal_voice_note || "";
  const hasJournal = Boolean(journalResponse || journalVoice);
  // A period entry and the daily check-in are separate records for the same
  // day, so the panel shows whatever either of them has to say.
  const flow =
    log?.flow_intensity ||
    (dailyLog?.flow_intensity && dailyLog.flow_intensity !== "none"
      ? dailyLog.flow_intensity
      : null);
  const mood = dailyLog?.mood || log?.mood;
  const symptoms = [
    ...new Set([...(dailyLog?.symptoms || []), ...(log?.symptoms || [])]),
  ];
  const notes = dailyLog?.notes || log?.notes;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-heading text-[19px] leading-snug">
          {prettyDate(date)}
        </h3>
        {cycleDay ? (
          <Eyebrow>Day {cycleDay} of your cycle</Eyebrow>
        ) : null}
      </div>

      {!log && !dailyLog ? (
        <p className="mt-3 font-heading text-[15px] italic text-muted-foreground">
          Nothing logged for this day.
        </p>
      ) : (
        <div className="mt-3 border-t border-border">
          {flow && <Row label="Flow">{FLOW_LABEL[flow] || "—"} flow</Row>}
          {mood && (
            <Row label="Mood">
              <span className="inline-flex items-center gap-1.5 capitalize">
                <MoodFace
                  mood={mood}
                  className="h-4 w-4 text-primary"
                />
                {mood}
              </span>
            </Row>
          )}
          {symptoms.length > 0 && (
            <Row label="Symptoms">
              <span className="flex flex-wrap gap-1.5">
                {symptoms.map((s) => (
                  <span
                    key={s}
                    className="border border-border px-2 py-0.5 text-[12px] capitalize"
                  >
                    {prettySymptom(s)}
                  </span>
                ))}
              </span>
            </Row>
          )}
          {dailyLog?.had_sex && <Row label="Intimacy">Yes</Row>}
          {dailyLog?.ovulation_test && (
            <Row label="Ovulation test">
              <span className="capitalize">{dailyLog.ovulation_test}</span>
            </Row>
          )}
          {typeof dailyLog?.bbt === "number" && (
            <Row label="Temperature">{dailyLog.bbt} °C</Row>
          )}
          {notes && (
            <p className="mt-3 border-t border-border pt-3 font-heading text-[15px] italic leading-relaxed text-muted-foreground">
              {notes}
            </p>
          )}
          {hasJournal && (
            <button
              type="button"
              onClick={() => setJournalOpen(true)}
              className="mt-3 flex w-full items-baseline justify-between gap-3 border-t border-border pt-3 text-left font-heading text-[15px] italic text-primary underline underline-offset-4"
            >
              <span>
                Journal entry saved
                {journalVoice ? " (with a voice note)" : ""}
              </span>
              <span className="shrink-0 text-[10px] uppercase not-italic tracking-[0.18em] text-muted-foreground">
                Read
              </span>
            </button>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          to={`/log-today?date=${dayKey(date)}`}
          className="font-heading text-[13px] italic text-primary underline underline-offset-4"
        >
          Add or edit entries
        </Link>
        {onTogglePeriod && (
          <button
            type="button"
            onClick={onTogglePeriod}
            disabled={periodSaving}
            className="font-heading text-[13px] italic text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary disabled:opacity-50"
          >
            {periodSaving
              ? "Saving…"
              : isPeriodDay
              ? "Remove as period day"
              : "Add as period day"}
          </button>
        )}
      </div>

      {periodError && (
        <p className="mt-2 text-[13px] text-destructive">{periodError}</p>
      )}

      <JournalEntryDialog
        open={journalOpen}
        onOpenChange={setJournalOpen}
        date={date}
        response={journalResponse}
        voiceNote={journalVoice}
      />
    </div>
  );
}