import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import {
  AlmButton,
  AlmChip,
  AlmSection,
  Eyebrow,
} from "@/components/alm/Primitives";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  FlowPicker,
  MoodPicker,
  TogglePill,
} from "@/components/daily-log/DailyLogFields";
import SymptomPicker from "@/components/daily-log/SymptomPicker";
import LifestylePicker from "@/components/daily-log/LifestylePicker";
import DischargePicker from "@/components/daily-log/DischargePicker";
import JournalEntryBox from "@/components/journal/JournalEntryBox";
import {
  addPeriodDays,
  deletePeriodDays,
  toDayKey,
} from "@/lib/periodLogs";

const EMPTY = {
  flow_intensity: "none",
  mood: "",
  symptoms: [],
  discharge: false,
  discharge_types: [],
  had_sex: false,
  alcohol: false,
  light_exercise: false,
  intense_exercise: false,
  caffeine: false,
  custom_lifestyle: [],
  journal_response: "",
  journal_voice_note: "",
  notes: "",
};

// Daily check-in. One entry per day: saving again updates it. Opened with a
// ?date= param it edits that day instead of today.
export default function LogToday() {
  const today = format(new Date(), "yyyy-MM-dd");
  const requestedDate = new URLSearchParams(window.location.search).get("date");
  const date = requestedDate || today;
  const isToday = date === today;
  const [form, setForm] = useState(EMPTY);
  const [entryId, setEntryId] = useState(null);
  const [periodLogs, setPeriodLogs] = useState([]);
  const [periodBusy, setPeriodBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    base44.auth
      .me()
      .then((me) =>
        base44.entities.DailyLog.filter(
          { date, created_by_id: me?.id },
          { limit: 1 }
        )
      )
      .then((page) => {
        if (!active) return;
        const entry = page.items[0];
        setEntryId(entry?.id || null);
        setForm({
          flow_intensity: entry?.flow_intensity || "none",
          mood: entry?.mood || "",
          symptoms: entry?.symptoms || [],
          discharge: entry?.discharge || false,
          discharge_types: entry?.discharge_types || [],
          had_sex: entry?.had_sex || false,
          alcohol: entry?.alcohol || false,
          light_exercise: entry?.light_exercise || false,
          intense_exercise: entry?.intense_exercise || false,
          caffeine: entry?.caffeine || false,
          custom_lifestyle: entry?.custom_lifestyle || [],
          journal_response: entry?.journal_response || "",
          journal_voice_note: entry?.journal_voice_note || "",
          notes: entry?.notes || "",
        });
      })
      .catch(() => active && setError("Couldn't load this day's entry."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [date]);

  // Period days live in their own history, so the toggle needs the runs that
  // already exist to extend or split them correctly.
  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((me) =>
        base44.entities.CycleLog.filter(
          { created_by_id: me?.id },
          { limit: 100 }
        )
      )
      .then((page) => active && setPeriodLogs(page.items))
      .catch(() => active && setError("Couldn't load your period history."));
    return () => {
      active = false;
    };
  }, []);

  // Which boxes to show comes from the tracking areas chosen in the profile.
  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((user) => active && setTracking(user?.tracking_focus || []))
      .catch(() => active && setTracking([]));
    return () => {
      active = false;
    };
  }, []);

  const set = (patch) => setForm((current) => ({ ...current, ...patch }));

  const isPeriodDay = periodLogs.some((log) => {
    const start = toDayKey(log.start_date);
    const end = toDayKey(log.end_date || log.start_date);
    return date >= start && date <= end;
  });

  const togglePeriod = async (next) => {
    if (periodBusy) return;
    setPeriodBusy(true);
    setError("");
    try {
      const updated = next
        ? await addPeriodDays(periodLogs, [date])
        : await deletePeriodDays(periodLogs, [date]);
      setPeriodLogs(updated.filter(Boolean));
      if (!next) set({ flow_intensity: "none" });
    } catch (e) {
      setError(e?.message || "Couldn't update this period day. Please try again.");
    } finally {
      setPeriodBusy(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        date,
        flow_intensity: form.flow_intensity,
        symptoms: form.symptoms,
        discharge: form.discharge,
        discharge_types: form.discharge_types,
        had_sex: form.had_sex,
        alcohol: form.alcohol,
        light_exercise: form.light_exercise,
        intense_exercise: form.intense_exercise,
        caffeine: form.caffeine,
        custom_lifestyle: form.custom_lifestyle,
        journal_response: form.journal_response,
        journal_voice_note: form.journal_voice_note,
        notes: form.notes,
      };
      if (form.mood) payload.mood = form.mood;
      if (entryId) {
        await base44.entities.DailyLog.update(entryId, payload);
      } else {
        await base44.entities.DailyLog.create(payload);
      }
      toast({
        title: isToday ? "Today's entry kept" : "Entry kept",
        description: isToday
          ? "Thanks for checking in."
          : "Thanks for filling in that day.",
      });
      navigate("/");
    } catch (e) {
      setError(e?.message || "Couldn't save your entry. Please try again.");
      setSaving(false);
    }
  };

  const tracksWellbeing = (tracking || []).includes("general_wellbeing");
  const showCycle =
    (tracking || []).includes("menstrual_cycles") || !tracksWellbeing;

  const week = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead
          kicker="Entry"
          actions={
            <Link
              to="/"
              className="font-heading text-[12.5px] italic text-primary underline underline-offset-4"
            >
              Close
            </Link>
          }
        />

        <div className="px-6">
          <Eyebrow>{isToday ? "Today's page" : "A page from before"}</Eyebrow>
          <h1 className="mt-3 font-heading text-[30px] leading-tight tracking-tight">
            {format(new Date(`${date}T00:00:00`), "EEEE d MMMM")}
          </h1>

          <div className="mt-5 flex justify-between">
            {week.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              const active = key === date;
              return (
                <Link
                  key={key}
                  to={`/log-today?date=${key}`}
                  className="flex w-10 flex-col items-center gap-1"
                >
                  <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    {format(d, "EE")}
                  </span>
                  <span
                    className={`w-7 border-b-2 pb-1 text-center font-heading text-[17px] transition-colors ${
                      active
                        ? "border-primary text-primary"
                        : "border-transparent"
                    }`}
                  >
                    {d.getDate()}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-4 border-t border-border" />

        {loading || !tracking ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {showCycle && (
              <>
                <AlmSection
                  n="i"
                  title="Flow"
                  description="Log today as a period day, then how your flow felt."
                >
                  <div className="mb-4">
                    <AlmChip
                      on={isPeriodDay}
                      onClick={() => togglePeriod(!isPeriodDay)}
                      disabled={periodBusy}
                    >
                      {isPeriodDay ? "A period day" : "Not a period day"}
                    </AlmChip>
                  </div>
                  <FlowPicker
                    value={form.flow_intensity}
                    onChange={(value) => set({ flow_intensity: value })}
                    disabled={!isPeriodDay}
                  />
                </AlmSection>

                <AlmSection n="ii" title="Mood">
                  <MoodPicker
                    value={form.mood}
                    onChange={(value) => set({ mood: value })}
                  />
                </AlmSection>

                <AlmSection n="iii" title="Body">
                  <SymptomPicker
                    value={form.symptoms}
                    onChange={(value) => set({ symptoms: value })}
                  />
                </AlmSection>

                <AlmSection n="iv" title="Lifestyle">
                  <Label className="eyebrow text-muted-foreground">
                    What today held
                  </Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <TogglePill
                      label="Sex"
                      checked={form.had_sex}
                      onChange={(value) => set({ had_sex: value })}
                    />
                    <TogglePill
                      label="Light exercise"
                      checked={form.light_exercise}
                      onChange={(value) => set({ light_exercise: value })}
                    />
                    <TogglePill
                      label="Intense exercise"
                      checked={form.intense_exercise}
                      onChange={(value) => set({ intense_exercise: value })}
                    />
                    <TogglePill
                      label="Alcohol"
                      checked={form.alcohol}
                      onChange={(value) => set({ alcohol: value })}
                    />
                    <TogglePill
                      label="Caffeine"
                      checked={form.caffeine}
                      onChange={(value) => set({ caffeine: value })}
                    />
                    <LifestylePicker
                      value={form.custom_lifestyle}
                      onChange={(value) => set({ custom_lifestyle: value })}
                    />
                  </div>
                </AlmSection>

                <AlmSection n="v" title="Discharge">
                  <div className="mb-4">
                    <AlmChip
                      on={form.discharge}
                      onClick={() =>
                        set({
                          discharge: !form.discharge,
                          discharge_types: form.discharge
                            ? []
                            : form.discharge_types,
                        })
                      }
                    >
                      {form.discharge ? "Noted today" : "None noted"}
                    </AlmChip>
                  </div>
                  <DischargePicker
                    value={form.discharge_types}
                    onChange={(value) => set({ discharge_types: value })}
                    disabled={!form.discharge}
                  />
                </AlmSection>
              </>
            )}

            <AlmSection n={showCycle ? "vi" : "i"} title="In your own words">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="daily-notes" className="eyebrow text-muted-foreground">
                    Notes
                  </Label>
                  <Textarea
                    id="daily-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set({ notes: e.target.value })}
                    placeholder="Anything else you noticed today?"
                    className="ruled-lines rounded-none border-0 bg-transparent px-0 font-heading text-[16px] italic shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
                  />
                </div>

                {tracksWellbeing && (
                  <JournalEntryBox
                    dateKey={date}
                    response={form.journal_response}
                    voiceNote={form.journal_voice_note}
                    onResponseChange={(value) =>
                      set({ journal_response: value })
                    }
                    onVoiceNoteChange={(value) =>
                      set({ journal_voice_note: value })
                    }
                  />
                )}
              </div>
            </AlmSection>

            {error && (
              <p className="px-6 pt-4 text-[13px] text-destructive">{error}</p>
            )}

            <div className="px-6 pt-6">
              <AlmButton onClick={save} disabled={saving}>
                {saving ? "Keeping…" : "Keep this entry"}
              </AlmButton>
              <p className="mt-3 text-center font-heading text-[13px] italic text-muted-foreground">
                One entry a day. Saving again revises this page.
              </p>
            </div>
          </>
        )}
      </div>
      <AlmTabs />
    </div>
  );
}