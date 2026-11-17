import React, { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { Rule } from "@/components/alm/Primitives";
import TodayCycleBlock from "@/components/dashboard/TodayCycleBlock";
import TodaysEntry from "@/components/dashboard/TodaysEntry";
import HistoricalDaysPrompt from "@/components/dashboard/HistoricalDaysPrompt";
import ReminderBanner from "@/components/reminders/ReminderBanner";
import FeaturedCauses from "@/components/donations/FeaturedCauses";
import { useReminders } from "@/hooks/use-reminders";
import useIsSubscriber from "@/hooks/use-is-subscriber";
import { getCurrentPhase } from "@/lib/cycle";
import { NO_DATA_NOTE, PHASE_NOTES } from "@/lib/phaseNotes";
import { MOOD_OPTIONS, prettySymptom } from "@/lib/dailyLog";
import { promptForDate } from "@/lib/journalPrompts";
import { recordAdVisit } from "@/lib/donations";

// Reminders that are about logging a period still open the calendar.
const PERIOD_REMINDERS = ["first_log", "period_due"];
const FLOW_LABELS = { light: "Light flow", medium: "Medium flow", heavy: "Heavy flow" };

export default function Home() {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const [logs, setLogs] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const dailyLogs = useMemo(
    () => (todayEntry ? [todayEntry] : []),
    [todayEntry]
  );
  const { reminders, dismiss } = useReminders(logs, dailyLogs);

  const openFromReminder = (reminder) =>
    navigate(
      PERIOD_REMINDERS.includes(reminder?.id) ? "/log-period" : "/log-today"
    );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Only the signed-in person's own records: admins can read every user's,
      // and another account's entry would put the wrong day at the top.
      const me = await base44.auth.me();
      const owner = { created_by_id: me?.id };
      const [cycles, dailies] = await Promise.all([
        base44.entities.CycleLog.filter(owner, {
          sort: "-start_date",
          limit: 100,
        }),
        base44.entities.DailyLog.filter(
          { ...owner, date: todayKey },
          { limit: 1 }
        ),
      ]);
      setLogs(cycles.items);
      setTodayEntry(dailies.items[0] || null);
    } catch (e) {
      toast({
        title: "Couldn't load today",
        description: e?.message || "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, todayKey]);

  useEffect(() => {
    load();
  }, [load]);

  const subscriber = useIsSubscriber();

  useEffect(() => {
    // Wait for the server's ad-free answer, so a subscriber's visit is never logged as an ad view.
    if (subscriber === null) return;
    base44.auth
      .me()
      .then((u) => (u ? recordAdVisit(u, subscriber) : u))
      .then((u) => setUser(u || null))
      .catch(() => setUser(null))
      .finally(() => setCheckingProfile(false));
  }, [subscriber]);

  const status = getCurrentPhase(logs);
  const hasCycle = status.phase !== "unknown";
  // Before any history exists the "Start your history" box is the way in, so
  // the first-log reminder would only repeat it.
  const showBanner = hasCycle && reminders.length > 0;

  // Which parts of the day to offer comes from the tracking areas chosen during
  // onboarding or in the profile.
  const tracking = user?.tracking_focus || [];
  const tracksWellbeing = tracking.includes("general_wellbeing");
  const showCycle = tracking.includes("menstrual_cycles") || !tracksWellbeing;

  const moodLabel = MOOD_OPTIONS.find(
    (option) => option.value === todayEntry?.mood
  )?.label;

  // The Almanac front page: where the user is in their cycle as the headline,
  // or an invitation to log.
  // The cycle line greets the user by name when Pomi knows it.
  const firstName = (user?.preferred_name || user?.full_name || "")
    .trim()
    .split(/\s+/)[0];
  const cycleKicker = firstName
    ? `Today in ${firstName}${firstName.endsWith("s") ? "’" : "’s"} cycle`
    : "Today, in your cycle";

  let block;
  if (showCycle && hasCycle) {
    block = {
      kicker: cycleKicker,
      title: `Day ${status.dayOfCycle}`,
      note: PHASE_NOTES[status.phase] || NO_DATA_NOTE,
    };
  } else if (showCycle) {
    block = {
      kicker: cycleKicker,
      title: "Day 0",
      logHref: "/log-today",
      subtitle: "Log your first period and Pomi will write a note here each day.",
      note: NO_DATA_NOTE,
    };
  } else {
    // Without cycles there is no cycle day to headline, so the date takes its place.
    block = {
      kicker: "Today",
      title: moodLabel || format(new Date(), "EEEE d MMMM"),
      logHref: moodLabel ? undefined : "/log-today",
      subtitle: "Your day, in your own words.",
      note: promptForDate(todayKey).prompt,
    };
  }

  const options = [];
  options.push({
    title: "Mood & lifestyle",
    desc: "Daily mood, sex, exercise, food and drink intake.",
    to: "/log-today?section=mood",
  });
  if (showCycle) {
    options.push({
      title: "Menstrual symptoms",
      desc: "Period flow, symptoms and how your body feels.",
      to: "/log-today?section=cycle",
    });
  }
  if (tracksWellbeing) {
    options.push({
      title: "Journal",
      desc: "Today's note for you.",
      to: "/log-today?section=journal",
    });
  }

  const logged = [];
  if (todayEntry) {
    if (FLOW_LABELS[todayEntry.flow_intensity]) {
      logged.push(FLOW_LABELS[todayEntry.flow_intensity]);
    }
    if (moodLabel) logged.push(moodLabel);
    (todayEntry.symptoms || []).forEach((symptom) => {
      const label = prettySymptom(symptom);
      logged.push(label.charAt(0).toUpperCase() + label.slice(1));
    });
    if (todayEntry.journal_response) logged.push("Journal");
  }

  if (checkingProfile || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pomegranate-100 border-t-pomegranate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <TodayCycleBlock
          {...block}
          status={showCycle && hasCycle ? status : null}
          phase={showCycle && hasCycle ? status.phase : null}
        />

        {showBanner && (
          <div className="px-6">
            <ReminderBanner
              reminder={reminders[0]}
              onDismiss={dismiss}
              onLogPeriod={openFromReminder}
            />
          </div>
        )}

        {showCycle && !hasCycle && (
          <div className={showBanner ? "mt-7 px-6" : "px-6"}>
            <HistoricalDaysPrompt />
          </div>
        )}

        {(showBanner || (showCycle && !hasCycle)) && <Rule className="my-7" />}

        <TodaysEntry options={options} logged={logged} />

        <div className="mt-8">
          <FeaturedCauses />
        </div>

        <p className="px-6 pt-6 text-center text-[12px] leading-relaxed text-muted-foreground">
          Pomi is not a medical device. For health concerns, please consult a
          healthcare professional.
        </p>
      </div>

      <AlmTabs />
    </div>
  );
}