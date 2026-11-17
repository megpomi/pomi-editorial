import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { AlmButton, Eyebrow, Rule } from "@/components/alm/Primitives";
import CycleStatus from "@/components/CycleStatus";
import CycleStats from "@/components/dashboard/CycleStats";
import CalendarPanel from "@/components/calendar/CalendarPanel";
import CharityImpact from "@/components/CharityImpact";
import CyclePatterns from "@/components/patterns/CyclePatterns";
import DonationTracker from "@/components/DonationTracker";
import { recordAdVisit } from "@/lib/donations";
import ReminderBanner from "@/components/reminders/ReminderBanner";
import JournalPrompt from "@/components/journal/JournalPrompt";
import ReminderBell from "@/components/reminders/ReminderBell";
import { useReminders } from "@/hooks/use-reminders";
import useIsSubscriber from "@/hooks/use-is-subscriber";

// Reminders that are about logging a period still open the calendar.
const PERIOD_REMINDERS = ["first_log", "period_due"];

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const { reminders, dismiss } = useReminders(logs, dailyLogs);
  const navigate = useNavigate();
  const goToLogPeriod = () => navigate("/calendar?log=1");
  const hasHistory = logs.length > 0;

  // Until there's any history, logging starts the historical entry flow. Once
  // history exists it opens the daily check-in for today, and the historical
  // entry page is reached from the calendar instead.
  const openLogger = () =>
    navigate(hasHistory ? "/log-today" : "/calendar?log=1");

  const openFromReminder = (reminder) =>
    PERIOD_REMINDERS.includes(reminder?.id) ? goToLogPeriod() : openLogger();

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Only the signed-in person's own logs: admins can read every user's
      // records, and another account's entry would skew the stats.
      const me = await base44.auth.me();
      const owner = { created_by_id: me?.id };
      const [cycles, dailies] = await Promise.all([
        base44.entities.CycleLog.filter(owner, {
          sort: "-start_date",
          limit: 100,
        }),
        base44.entities.DailyLog.filter(owner, {
          sort: "-date",
          limit: 200,
        }),
      ]);
      setLogs(cycles.items);
      setDailyLogs(dailies.items);
    } catch (e) {
      toast({
        title: "Couldn't load your cycles",
        description: e?.message || "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

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

  // The name given during onboarding greets them here; accounts made another way
  // fall back to the first word of their account name.
  const firstName = (user?.preferred_name || user?.full_name || "")
    .trim()
    .split(/\s+/)[0];

  // People tracking general wellbeing get a daily journalling prompt instead of
  // cycle-only framing at the top of their dashboard.
  const tracking = user?.tracking_focus || [];
  const tracksWellbeing = tracking.includes("general_wellbeing");
  const tracksCycles = tracking.includes("menstrual_cycles");

  if (checkingProfile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead
          kicker={format(new Date(), "EEEE d MMMM")}
          actions={
            <ReminderBell
              reminders={reminders}
              onDismiss={dismiss}
              onLogPeriod={openFromReminder}
            />
          }
        />

        <section className="px-6 pb-1">
          <Eyebrow>Your day</Eyebrow>
          <p className="mt-2 font-heading text-[20px] italic leading-snug text-muted-foreground">
            {tracksWellbeing && !tracksCycles
              ? "A quiet moment to check in with yourself."
              : logs.length
              ? `Hello${firstName ? `, ${firstName}` : ""}. Here is where you are in your cycle today.`
              : `Hello${
                  firstName ? `, ${firstName}` : ""
                }. Let's begin your record, and give back with it.`}
          </p>
        </section>

        <CycleStatus logs={logs} />

        <div className="px-6 pt-7">
          <AlmButton onClick={openLogger}>
            {hasHistory ? "Write today's entry" : "Log your period"}
          </AlmButton>
          <div className="mt-3 text-center">
            <Link
              to="/upgrade"
              className="font-heading text-[13px] italic text-primary underline underline-offset-4"
            >
              Go ad-free, and give more
            </Link>
          </div>
        </div>

        {reminders.length > 0 && (
          <div className="px-6 pt-7">
            <ReminderBanner
              reminder={reminders[0]}
              onDismiss={dismiss}
              onLogPeriod={openFromReminder}
            />
          </div>
        )}

        {tracksWellbeing && (
          <div className="px-6 pt-7">
            <JournalPrompt dateKey={format(new Date(), "yyyy-MM-dd")} />
          </div>
        )}

        <Rule className="my-7" />

        <div className="px-6">
          <CycleStats logs={logs} />
        </div>

        <Rule className="my-7" />

        <section className="px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <Eyebrow>The month</Eyebrow>
              <h2 className="mt-2 font-heading text-[26px] leading-none">
                Your calendar
              </h2>
            </div>
            {tracksCycles && (
              <Link
                to="/calendar?log=1"
                className="font-heading text-[13px] italic text-primary underline underline-offset-4"
              >
                Log past days
              </Link>
            )}
          </div>
        </section>
        <div className="px-6 pt-5">
          <CalendarPanel
            logs={logs}
            dailyLogs={dailyLogs}
            loading={loading}
            showJournal={tracksWellbeing}
            onChanged={loadLogs}
          />
        </div>

        <Rule className="my-7" />

        <section className="px-6">
          <Eyebrow>Review</Eyebrow>
          <h2 className="mt-2 font-heading text-[26px] leading-none">
            Your patterns
          </h2>
          <div className="mt-5">
            <CyclePatterns logs={logs} dailyLogs={dailyLogs} />
          </div>
        </section>

        <Rule className="my-7" />

        <section className="px-6">
          <Eyebrow>Give</Eyebrow>
          <h2 className="mt-2 font-heading text-[26px] leading-none">
            What your record supports
          </h2>
        </section>
        <div className="px-6 pt-5">
          <CharityImpact />
        </div>
        <div className="px-6 pt-6">
          <DonationTracker user={user} />
        </div>

        <p className="px-6 pt-10 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Pomi is not a medical device. For health concerns, consult a
          healthcare professional.
        </p>
      </div>
      <AlmTabs />
    </div>
  );
}