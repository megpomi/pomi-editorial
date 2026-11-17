import { useEffect, useMemo, useState } from "react";
import { buildReminders, dayKey } from "@/lib/reminders";

const DISMISS_KEY = "pomi_dismissed_reminders";
// The banner and the bell in the page header each hold a copy of the reminders,
// so a dismissal in one has to reach the other.
const DISMISS_EVENT = "pomi:reminders-dismissed";

// Dismissals are kept for the current day only: a reminder the user waved away
// this morning shouldn't come back every time they open the app today.
const readDismissed = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(DISMISS_KEY) || "[]");
    const suffix = `@${dayKey()}`;
    return Array.isArray(stored)
      ? stored.filter((key) => String(key).endsWith(suffix))
      : [];
  } catch {
    return [];
  }
};

export function useReminders(logs, dailyLogs) {
  const [dismissed, setDismissed] = useState(readDismissed);

  useEffect(() => {
    const sync = () => setDismissed(readDismissed());
    window.addEventListener(DISMISS_EVENT, sync);
    return () => window.removeEventListener(DISMISS_EVENT, sync);
  }, []);

  const reminders = useMemo(
    () =>
      buildReminders(logs, dailyLogs).filter(
        (r) => !dismissed.includes(`${r.id}@${dayKey()}`)
      ),
    [logs, dailyLogs, dismissed]
  );

  const dismiss = (id) => {
    const next = [...new Set([...readDismissed(), `${id}@${dayKey()}`])];
    localStorage.setItem(DISMISS_KEY, JSON.stringify(next));
    setDismissed(next);
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  return { reminders, dismiss };
}