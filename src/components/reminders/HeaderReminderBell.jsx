import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ReminderBell from "@/components/reminders/ReminderBell";
import { useReminders } from "@/hooks/use-reminders";

// Reminders that are about logging a period still open the calendar.
const PERIOD_REMINDERS = ["first_log", "period_due"];

// The bell lives in the banner on every page, so it reads the user's own logs
// itself rather than waiting for the page underneath to hand them over.
export default function HeaderReminderBell() {
  const navigate = useNavigate();
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const [logs, setLogs] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);
  const [tracking, setTracking] = useState([]);

  useEffect(() => {
    let active = true;

    const load = () => {
      base44.auth
        .me()
        .then((me) => {
          const owner = { created_by_id: me?.id };
          setTracking(me?.tracking_focus || []);
          return Promise.all([
            base44.entities.CycleLog.filter(owner, {
              sort: "-start_date",
              limit: 100,
            }),
            base44.entities.DailyLog.filter(
              { ...owner, date: todayKey },
              { limit: 1 }
            ),
          ]);
        })
        .then(([cycles, dailies]) => {
          if (!active) return;
          setLogs(cycles.items);
          setTodayEntry(dailies.items[0] || null);
        })
        .catch(() => {});
    };

    load();

    // Logging anywhere in the app has to clear the matching reminder here too.
    const watch = (Entity) => {
      try {
        return Entity.subscribe(load);
      } catch {
        return () => {};
      }
    };
    const stop = [watch(base44.entities.CycleLog), watch(base44.entities.DailyLog)];

    return () => {
      active = false;
      stop.forEach((unsubscribe) => unsubscribe());
    };
  }, [todayKey]);

  const dailyLogs = useMemo(
    () => (todayEntry ? [todayEntry] : []),
    [todayEntry]
  );
  const { reminders, dismiss } = useReminders(logs, dailyLogs, {
    conception: tracking.includes("trying_to_conceive"),
  });

  const handleLogPeriod = (reminder) =>
    navigate(
      PERIOD_REMINDERS.includes(reminder?.id) ? "/log-period" : "/log-today"
    );

  return (
    <ReminderBell
      reminders={reminders}
      onDismiss={dismiss}
      onLogPeriod={handleLogPeriod}
    />
  );
}