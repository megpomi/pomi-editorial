import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { Eyebrow, Rule } from "@/components/alm/Primitives";
import { useToast } from "@/components/ui/use-toast";
import PeriodHistoryCalendar from "@/components/calendar/PeriodHistoryCalendar";
import CycleStatus from "@/components/CycleStatus";
import CycleStats from "@/components/dashboard/CycleStats";
import CyclePatterns from "@/components/patterns/CyclePatterns";

// The calendar page: the period history to edit, the cycle it adds up to, and
// the month-by-month patterns underneath — everything the dashboard leaves out
// in favour of today.
export default function CycleCalendar() {
  const [logs, setLogs] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  // Arriving from the dashboard prompt to import a screenshot.
  const [searchParams] = useSearchParams();
  const autoImport = searchParams.get("import") === "1";

  const loadAll = useCallback(
    () =>
      base44.auth
        .me()
        .then((me) => {
          const owner = { created_by_id: me?.id };
          return Promise.all([
            base44.entities.CycleLog.filter(owner, {
              sort: "-start_date",
              limit: 200,
            }),
            base44.entities.DailyLog.filter(owner, {
              sort: "-date",
              limit: 500,
            }),
          ]);
        })
        .then(([cycles, dailies]) => {
          setLogs(cycles.items);
          setDailyLogs(dailies.items);
        })
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <section className="px-6">
          <h1 className="font-heading text-[26px] leading-tight tracking-tight sm:text-[30px]">
            Your calendar
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Tap days you were menstruating to add them, or tap a logged day to
            remove it.
          </p>
        </section>

        <Rule className="my-6" />

        <div className="px-6">
          {loading ? (
            <div className="h-64 animate-pulse border border-border bg-card" />
          ) : (
            <PeriodHistoryCalendar
              logs={logs}
              autoImport={autoImport}
              onSaved={() => {
                loadAll();
                toast({
                  title: "Calendar updated",
                  description:
                    "Your period days are saved. Head back to today when you're ready.",
                });
              }}
            />
          )}
        </div>

        {!loading && (
          <>
            <Rule className="my-7" />

            <div className="px-6">
              <CycleStatus logs={logs} />
            </div>

            <Rule className="my-7" />

            <div className="px-6">
              <CycleStats logs={logs} />
            </div>

            <Rule className="my-7" />

            <section className="px-6">
              <Eyebrow className="mb-4">Your patterns</Eyebrow>
              <CyclePatterns logs={logs} dailyLogs={dailyLogs} />
            </section>
          </>
        )}
      </div>

      <AlmTabs />
    </div>
  );
}